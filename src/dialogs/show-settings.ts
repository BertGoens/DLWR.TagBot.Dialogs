import * as builder from "botbuilder";
import * as db from "../stores";
import { SettingsStore } from "../stores";

export const ShowSettingsLuisName = "Bot.ShowSettings";
export const ShowSettingsDialog: builder.IDialogWaterfallStep[] = [
  async function settingsLookup(session, args, next) {
    var userId = session.message.user.id;
    var channelId = session.message.source;

    var userSettings = await SettingsStore.GetSettingsById(userId, channelId);
    var reply = new builder.Message();
    var text = "Your settings are:  \n" + JSON.stringify(userSettings);

    reply.text(text);
    session.send(reply);
  }
];
