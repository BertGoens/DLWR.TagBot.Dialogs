import * as builder from "botbuilder";
import { SharePointStore, IDocument, IQueryOptions } from "../stores";
import {
  resolveDocumentFileType,
  resolveDocumentAuthor
} from "../util/entity-resolver";
import {
  SelectDocumentName,
  displayChoice,
  IDisplayChoice
} from "./select-document";

export const SharePointSearchLuisName = "SharePoint.Search";
export const SharePointSearchDialog: builder.IDialogWaterfallStep[] = [
  async function sharepointDocumentLookup(session, args, next) {
    const message = new builder.Message().text(
      "... Looking for untagged documents ... "
    );
    session.send(message);

    session.sendTyping();

    const documentFilter: IQueryOptions = {
      title: resolveDocumentAuthor(
        builder.EntityRecognizer.findAllEntities(
          args.entities,
          "document_title"
        )
      ),
      author: resolveDocumentAuthor(
        builder.EntityRecognizer.findAllEntities(
          args.entities,
          "document_author"
        )
      ),
      filetype: resolveDocumentFileType(
        builder.EntityRecognizer.findAllEntities(
          args.entities,
          "document_filetypes"
        )
      )
    };

    const documents = await SharePointStore.GetDocuments(documentFilter);

    // end conversation when nothing untagged
    if (!documents || (documents && documents.length === 0)) {
      // TODO: change next workday to take into account the time muted for the bot
      session.send(
        new builder.Message().text(
          "No untagged documents found. " +
            "I'll contact you the next workday if there is anything to be tagged."
        )
      );
      return session.endDialog();
    }

    session.userData.documents = documents;

    builder.Prompts.text(
      session,
      documents.length +
        " documents found with missing requirements, " +
        "which document would you like to tag?"
    );

    const dcOptions: IDisplayChoice = {
      session: session,
      documents: documents
    };
    const msgSelectDocument = displayChoice(dcOptions);
    session.send(msgSelectDocument);

    session.beginDialog(SelectDocumentName);
  }
];
