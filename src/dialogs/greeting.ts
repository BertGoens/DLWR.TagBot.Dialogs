import * as builder from "botbuilder";

export const GreetingLuisName = "Utilities.Greeting";

export const greetingMessage = session => {
  return new builder.Message()
    .text("Hi, let's tag some documents!")
    .suggestedActions(
      builder.SuggestedActions.create(session, [
        builder.CardAction.imBack(session, "Search for 1 document", "👍"),
        builder.CardAction.imBack(session, "Quit", "👎")
      ])
    );
};

export const GreetingDialog: builder.IDialogWaterfallStep[] = [
  function sendHelpMessage(session, args, next) {
    var message = session.send(greetingMessage(session));
  }
];
