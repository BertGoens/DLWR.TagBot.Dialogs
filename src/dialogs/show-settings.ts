import * as builder from "botbuilder";
import { SettingsStore, ISettings } from "../stores";
import { logError, logDebug } from "../util";
import { debuglog } from "util";

export const ShowSettingsLuisName = "Bot.ShowSettings";
export const ShowSettingsDialog: builder.IDialogWaterfallStep[] = [
  async function settingsLookup(session, args, next) {
    var userId = session.message.user.id;
    var channelId = session.message.source;

    var userSettings: ISettings = {};

    // retrieve the settings by id
    var createSettings = false;
    try {
      userSettings = await SettingsStore.GetSettingsById(userId, channelId);
    } catch (error) {
      createSettings = true;
    }

    if (createSettings) {
      debuglog("Create settings");
      try {
        userSettings = await SettingsStore.CreateSettings(userId, {
          userId: userId,
          channelId: channelId
        });
      } catch (error) {
        logDebug("CreateSettings catch");
      }
    }

    var reply = new builder.Message();

    if (userSettings) {
      var text =
        "Your saved settings are:  \n" +
        "User: {0}  \nChannel: {1}  \nBot Muted Until: {2}  \nLast Message Sent: {3}";
      text = text.replace("{0}", userSettings.userId || "Unknown");
      text = text.replace("{1}", userSettings.channelId || "Unknown");
      text = text.replace(
        "{2}",
        (userSettings.botMutedUntill &&
          userSettings.botMutedUntill.toString()) ||
          "Unknown"
      );
      text = text.replace(
        "{3}",
        (userSettings.lastMessageSent &&
          userSettings.lastMessageSent.toString()) ||
          "Unknown"
      );

      reply.text(text);
    } else {
      reply.text("Something went wrong, please try again later.");
    }
    session.send(reply);
  }
];
