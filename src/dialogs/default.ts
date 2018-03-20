import * as builder from "botbuilder";

export const onDefault: builder.IDialogWaterfallStep[] = [
  async function informUserOfMisunderstanding(session, args, next) {
    session.send(
      "Sorry, I did not understand that, type 'help' to see what I can do.",
      session.message.text
    );
  }
];
