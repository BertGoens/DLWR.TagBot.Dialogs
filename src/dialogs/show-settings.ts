import * as builder from "botbuilder";
import { SettingsStore } from "../stores";
import { logError, logDebug } from "../util";
import { debuglog } from "util";

export const ShowSettingsLuisName = "Bot.ShowSettings";
export const ShowSettingsDialog: builder.IDialogWaterfallStep[] = [
  async function settingsLookup(session, args, next) {
    var userId = session.message.user.id;
    var channelId = session.message.source;

    var userSettings: any = {};

    // retrieve the settings by id
    var createSettings = false;
    try {
      userSettings = await SettingsStore.GetSettingsById(userId, channelId);
      logDebug("Succesfull");
    } catch (error) {
      logDebug("GetSettingsById catch");
      createSettings = true;
    }

    if (createSettings) {
      debuglog("Create settings");
      try {
        userSettings = await SettingsStore.CreateSettings(userId, {
          userId: userId,
          channelId: channelId
        });
        logDebug("Succesfull");
      } catch (error) {
        logDebug("CreateSettings catch");
      }
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
