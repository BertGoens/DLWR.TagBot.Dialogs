import * as builder from "botbuilder";
import { SettingsStore } from "../stores";
import { logError, logDebug } from "../util";

export const ShowSettingsLuisName = "Bot.ShowSettings";
export const ShowSettingsDialog: builder.IDialogWaterfallStep[] = [
  async function settingsLookup(session, args, next) {
    var userId = session.message.user.id;
    var channelId = session.message.source;

    var userSettings: any = {};
    try {
      userSettings = await SettingsStore.GetSettingsById(userId, channelId);
      logDebug("Succesfull")
    } catch (error) {
      logDebug("show-settings catch");
      // logError(error); // throws TypeError: Converting circular structure to JSON
    }

    var reply = new builder.Message();

    if (userSettings && userSettings.data) {
      var text =
        "Your settings are:  \n" +
        `${userSettings &&
          userSettings.data &&
          JSON.stringify(userSettings.data)}`;
      reply.text(text);
    } else {
      reply.text("Something went wrong, please try again later.");
    }
    session.send(reply);
  }
];
