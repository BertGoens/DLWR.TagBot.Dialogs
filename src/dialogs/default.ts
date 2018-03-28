import * as builder from "botbuilder";
import { logInfo } from "../util";

export const onDefault: builder.IDialogWaterfallStep[] = [
  async function informUserOfMisunderstanding(session, args, next) {
    logInfo(
      "Unhandeled reply: highest scoring intent: " +
        args.intent +
        ", Score: " +
        args.score
    );
    session.send(
      "Sorry, I did not understand that, type 'help' to see what I can do.",
      session.message.text
    );
  }
];
