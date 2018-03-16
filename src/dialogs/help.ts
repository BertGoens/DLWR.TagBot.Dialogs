import * as builder from "botbuilder";

export const HelpDialogLuisName = "Utilities.Help";
export const HelpDialog: builder.IDialogWaterfallStep[] = [
  function sendHelpMessage(session, args, next) {
    var message = new builder.Message()
      .text(
        "" +
          "### Hi!  \n" +
          "My name is **TagBot**, I'm here to help you tag forgotten documents on SharePoint. " +
          "If I find an untagged document I'll notify you and suggest some tags.  \n" +
          "Would you like to try it out?"
      )
      .suggestedActions(
        builder.SuggestedActions.create(session, [
          builder.CardAction.imBack(session, "Search", "Search"),
          builder.CardAction.imBack(session, "Show my settings", "Settings")
        ])
      );
    session.send(message);
  }
];
