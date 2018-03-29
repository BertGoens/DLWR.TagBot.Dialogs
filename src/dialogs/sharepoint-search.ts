import * as builder from "botbuilder";
import { TagDocumentName } from "./tagdocument";
import { SharePointStore, IDocument } from "../stores";

export const SharePointSearchLuisName = "SharePoint.Search";
export const SharePointSearchDialog: builder.IDialogWaterfallStep[] = [
  async function sharepointDocumentLookup(session, args, next) {
    var message = new builder.Message().text(
      "... Looking for untagged documents ... "
    );
    session.send(message);

    session.sendTyping();

    var documents = await SharePointStore.GetDocuments({});

    // try extracting entities
    var numberEntity = builder.EntityRecognizer.findEntity(
      args.entities,
      "builtin.number"
    );

    // end conversation when nothing untagged
    if (!documents || (documents && documents.length === 0)) {
      session.send(new builder.Message().text("No untagged documents found."));
      return session.endDialog();
    }

    session.userData.documents = documents;
    if (numberEntity) {
      // number entity detected, validate
      if (numberEntity.entity > documents.length) {
        numberEntity.entity = documents.length;
      } else if (numberEntity.entity < 0) {
        numberEntity.entity = 0;
      }

      session.userData.tagAmount = numberEntity.entity;
      return next({ response: numberEntity.entity });
    } else {
      // no entities detected, ask user for a number
      builder.Prompts.number(
        session,
        `${documents.length} documents found, how many would you like to tag?`,
        {
          integerOnly: true,
          minValue: 0,
          maxValue: documents.length,
          maxRetries: 1
        }
      );
    }
  },
  function prepareUser(session, results, next) {
    var numberToTag = parseInt(results.response);

    if (results.response > 0) {
      // remove excess documents from tag queue
      var docs: IDocument[] = session.userData.documents;
      if (docs.length > numberToTag) {
        var cutExcessNumber = docs.length - numberToTag;
        session.userData.documents.splice(0, cutExcessNumber);
      }

      session.userData.documentsTagged = 0;
      session.userData.documentsToTag = numberToTag;
      session.replaceDialog(TagDocumentName);
    } else {
      // End
      session.endDialog(new builder.Message().text("Done tagging for today"));
      return;
    }
  }
];
