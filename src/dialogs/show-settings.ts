import * as builder from "botbuilder";
import { SettingsStore } from "../stores";

export const ShowSettingsLuisName = "Bot.ShowSettings";
export const ShowSettingsDialog: builder.IDialogWaterfallStep[] = [
  async function settingsLookup(session, args, next) {
    var userId = session.message.user.id;
    var channelId = session.message.source;

    var userSettings = await SettingsStore.GetSettingsById(userId, channelId);
    var reply = new builder.Message();
    if (userSettings.error) {
      reply.text("Something went wrong, please try again later.");
    } else {
      var text = "Your settings are:  \n" + JSON.stringify(userSettings.data);
      reply.text(text);
    }

    session.send(reply);
  }
];
