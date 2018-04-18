import { IDocument, KeywordStore } from "../stores";
import * as builder from "botbuilder";
import { recognizer, intentThreshold } from "../server";
import { logSilly, logInfo } from "../util";
import { NoneLuisName, CancelLuisName, StopLuisName, ConfirmLuisName } from ".";
import { debuglog } from "util";

export const TagDocumentName = "TagDocument";
export const TagDocumentDialog: builder.IDialogWaterfallStep[] = [
  function selectDocument(session, results, next) {
    if (session.userData.documentsTagged >= session.userData.documentsToTag) {
      // End
      session.endConversation(
        new builder.Message().text("Done tagging for today!")
      );
    } else {
      next();
    }
  },
  async function tagDocument(session, results, next) {
    // take tag document
    var document: IDocument =
      session.userData.documents[session.userData.documentsTagged];

    session.sendTyping();
    // Get suggested tags
    var keywords = await KeywordStore.GetKeywords(document.Path);
    let suggestedTags = [];
    if (keywords && keywords.documents && keywords.documents[0]) {
      suggestedTags = keywords.documents[0].keyPhrases;
    }
    logInfo(`${suggestedTags.length} key words/phrase received, taking 5`);
    // Do not exceed more then 4 tags (don't bombard the user with suggestions)
    suggestedTags = suggestedTags.slice(0, 4);

    var text = "Some suggested tags:  \n" + suggestedTags.join(",\n");

    var linkToUrl = builder.CardAction.openUrl(
      session,
      document.Path,
      "Open " + document.Title
    );

    var cardMsg = new builder.Message(session);
    cardMsg.attachments([
      new builder.HeroCard(session).title(document.Title).buttons([linkToUrl])
    ]);

    session.send(cardMsg);
    session.send(new builder.Message().text(text).textFormat("plain"));

    builder.Prompts.text(session, "What tags should we add?", {
      maxRetries: 2
    });
  },
  function ConfirmTags(session, results, next) {
    // analyse if the user wants to quit, or added tags
    if (results && results.response) {
      builder.LuisRecognizer.recognize(
        results.response,
        process.env.LUIS_MODEL_URL,
        (err, intents, entities) => {
          if (err) {
            debuglog("Some error occurred in calling LUIS");
          }
          if (intents) {
            // get highest scoring intent
            let sorted = intents.sort((a, b) => {
              return b.score - a.score;
            });

            let highestScoringIntent = sorted[0];
            debuglog(
              `Highest Scoring Intent: ${
                highestScoringIntent.intent
              }: ${highestScoringIntent.score.toPrecision(2)}`
            );
            if (highestScoringIntent.score > intentThreshold) {
              if (
                [CancelLuisName, StopLuisName].includes(
                  highestScoringIntent.intent
                )
              ) {
                session.endDialog("Ok, let's take a break.");
              }
            }
            var tagsToAdd = results.response;
            var msg = new builder.Message()
              .text("Do you want to add these tags: " + tagsToAdd.toString())
              .suggestedActions(
                builder.SuggestedActions.create(session, [
                  builder.CardAction.imBack(session, "Yes", "👍"),
                  builder.CardAction.imBack(session, "No", "👎")
                ])
              );
            session.userData.tagsToAdd = tagsToAdd;
            builder.Prompts.text(session, msg);
          }
        }
      );
    }
  },
  function saveTags(session, results, next) {
    if (results && results.response) {
      builder.LuisRecognizer.recognize(
        results.response,
        process.env.LUIS_MODEL_URL,
        (err, intents, entities) => {
          if (err) {
            debuglog("Some error occurred in calling LUIS");
          }
          if (intents) {
            let sorted = intents.sort((a, b) => {
              return b.score - a.score;
            });

            let highestScoringIntent = sorted[0];
            debuglog(
              `Highest Scoring Intent: ${
                highestScoringIntent.intent
              }: ${highestScoringIntent.score.toPrecision(2)}`
            );

            if (highestScoringIntent.intent == ConfirmLuisName) {
              var msg = new builder.Message().text(
                "Adding these tags: " + session.userData.tagsToAdd
              );
              session.userData.documentsTagged += 1;
              session.send(msg);
              session.replaceDialog(TagDocumentName);
            } else if (
              [CancelLuisName, StopLuisName].includes(
                highestScoringIntent.intent
              )
            ) {
              var msg = new builder.Message().text(
                "Didn't add the tags" + session.userData.tagsToAdd
              );
              session.send(msg);
              session.replaceDialog(TagDocumentName);
            }
          }
        }
      );
    }
  }
];
