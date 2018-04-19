import * as builder from "botbuilder";
import { TagDocumentName } from "./tag-document";
import { SharePointStore, IDocument, IQueryOptions } from "../stores";
import {
  resolveDocumentFileType,
  resolveDocumentAuthor,
  sortIntentsByScore
} from "../util/entity-resolver";
import {
  CancelLuisName,
  StopLuisName,
  ShowNextLuisName,
  ShowPreviousLuisName,
  ConfirmLuisName
} from ".";
import { logInfo } from "../util";

export const SelectDocumentName = "/SelectDocument";

export interface IDisplayChoice {
  session: builder.Session;
  documents: IDocument[];
  currentViewIndex?: number;
  requestedViewIndex?: number;
}

export const displayChoice = (options: IDisplayChoice) => {
  // display 5 choices
  const documents: IDocument[] = options.documents;

  const pagerSize = 4; // ZERO BASED
  if (options.requestedViewIndex) {
    // Calculate new lowerbound
    const requestedViewIndex = options.requestedViewIndex * (pagerSize + 1);
    // Check if lowerbound is in range
    if (options.documents.length > requestedViewIndex) {
      // In range, raise our currentViewIndex:
      options.currentViewIndex = options.requestedViewIndex;
    }
  }

  const index = options.currentViewIndex || 0;
  const lowerBound = index * 4;
  const upperBound = lowerBound + pagerSize;

  const thumbnailCards = documents
    .slice(lowerBound, upperBound)
    .map((myDocument, idx, arr) => {
      const fileLink = builder.CardAction.openUrl(
        options.session,
        myDocument.Path,
        "Open file"
      );

      const selectFile = builder.CardAction.imBack(
        options.session,
        "Select document " + idx,
        "Select"
      );

      return new builder.ThumbnailCard(options.session)
        .title(myDocument.Title)
        .buttons([fileLink, selectFile])
        .subtitle("Author: ", myDocument.Author);
    });

  const msg = new builder.Message(options.session).attachments(thumbnailCards);

  return msg;
};

export const SelectDocumentDialog: builder.IDialogWaterfallStep[] = [
  function validateChoice(session, results, next) {
    logInfo("Validate Choice");
    if (results && results.response) {
      // Step 1
      // Response Matches: Select document ${number}
      const regexp = /Select document \d/gi;
      if (results.response.match(regexp)) {
        const numbersOnly = /\d+/;
        const selectedDocument: number = results.response.match(numbersOnly);
        session.userData.selectedDocumentIndex = selectedDocument;
        session.beginDialog(TagDocumentName);
      }

      // Step 2
      // Decide on next action
      builder.LuisRecognizer.recognize(
        results.response,
        process.env.LUIS_MODEL_URL,
        (err, intents, entities) => {
          if (intents) {
            const bestIntent = sortIntentsByScore(intents)[0];

            if ([CancelLuisName, StopLuisName].includes(bestIntent.intent)) {
              session.endConversation();
            }

            if (ShowNextLuisName === bestIntent.intent) {
              const index = session.userData.documentSelectIndex;
              if (index > -1) session.userData.documentSelectIndex--;
              session.replaceDialog(SelectDocumentName);
            }

            if (ShowPreviousLuisName === bestIntent.intent) {
              const newIndex = (session.userData.documentSelectIndex = 1);
              session.replaceDialog(SelectDocumentName, {
                newDocumentSelectIndex: newIndex
              });
            }
          }
        }
      );
    }
  }
];
