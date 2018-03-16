import { IDocument } from "../stores";
import * as builder from "botbuilder";

export const LoopDialog: builder.IDialogWaterfallStep[] = [
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
  function tagDocument(session, results, next) {
    // take tag document
    var document: IDocument =
      session.userData.documents[session.userData.documentsTagged];
    var suggestedTags = ["Skype", "Chatbot", "Autonomous"];
    // ask if the suggested tags are good

    var text = "Some suggested tags:  \n" + suggestedTags.join(",  ");

    var linkToUrl = builder.CardAction.openUrl(
      session,
      document.location,
      "Open " + document.name
    );

    var cardMsg = new builder.Message(session);
    cardMsg.attachments([
      new builder.HeroCard(session).title(document.name).buttons([linkToUrl])
    ]);

    session.send(cardMsg);
    session.send(new builder.Message().text(text).textFormat("plain"));

    builder.Prompts.text(session, "What tags should we add?", {
      maxRetries: 3
    });
  },
  function ConfirmTags(session, results, next) {
    var tagsToAdd = results.response;
    var msg = new builder.Message().text(
      "Do you want to add these tags: " + tagsToAdd.toString()
    );
    session.userData.tagsToAdd = tagsToAdd;
    builder.Prompts.confirm(session, msg);
  },
  function saveTags(session, results, next) {
    // TODO: split tagsToAdd (based on space or comma)
    var msg = new builder.Message().text(
      "Adding these tags: " + session.userData.tagsToAdd
    );
    session.userData.documentsTagged += 1;
    session.send(msg);
    session.replaceDialog("TagDocument");
  }
];
