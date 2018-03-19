import * as builder from "botbuilder";
import { ISettings, SettingsStore } from "../stores";

export const UnignoreUserLuisName = "UnignoreUser";
export const UnignoreUserialog: builder.IDialogWaterfallStep[] = [
  async function sendIgnoreMessage(session, args, next) {
    var message = new builder.Message();
    message.text("I'll send you again if there are any missing tags");

    const userId = session.message.user.name;
    const channel = session.message.source;
    const settings: ISettings = await SettingsStore.GetSettingsById(
      userId,
      channel
    );
    const newSettings: ISettings = {
      botMutedUntill: null,
      channelId: settings.channelId,
      userId: settings.userId
    };

    await SettingsStore.SaveSettingsById(userId, newSettings);
  }
];
