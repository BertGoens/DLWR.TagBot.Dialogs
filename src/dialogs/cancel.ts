import * as builder from "botbuilder";

export const CancelLuisName = "Utilities.Cancel";

export const CancelDialog: builder.IDialogWaterfallStep[] = [
  async function handleConfirmationMessage(session, args, next) {
    var message = session.send("Cancelled");
  }
];
