import * as builder from "botbuilder";

export const GreetingLuisName = "Utilities.Greeting";
export const GreetingDialog: builder.IDialogWaterfallStep[] = [
  function sendHelpMessage(session, args, next) {
    var message = new builder.Message()
      .text("Hi, let's tag some documents!")
      .suggestedActions(
        builder.SuggestedActions.create(session, [
          builder.CardAction.imBack(session, "Search", "👍"),
          builder.CardAction.imBack(session, "Quit", "👎")
        ])
      );
    session.send(message);
  }
];
