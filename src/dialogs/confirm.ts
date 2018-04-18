import * as builder from "botbuilder";

export const ConfirmLuisName = "Utilities.Confirm";

export const ConfirmDialog: builder.IDialogWaterfallStep[] = [
  async function handleConfirmationMessage(session, args, next) {
    const message = session.send("Ok");
  }
];
