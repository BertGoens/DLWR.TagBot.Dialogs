import * as builder from "botbuilder";
import * as datefns from "date-fns";
import { SettingsStore, ISettings } from "../stores";

export const IgnoreUserLuisName = "IgnoreUser";
export const IgnoreUserDialog: builder.IDialogWaterfallStep[] = [
  async function sendIgnoreMessage(session, args, next) {
    // try extracting entities
    var muteUntillDate = builder.EntityRecognizer.resolveTime(args.entities);

    // fallback: mute for 1 day
    var tomorrow = datefns.addDays(new Date(), 1);

    var ignoreUntill: Date = tomorrow;

    if (muteUntillDate) {
      ignoreUntill = muteUntillDate;
    } else {
      ignoreUntill = tomorrow;
    }

    var message = new builder.Message();
    message.text(
      "I won't contact you untill at least " +
        datefns.format(ignoreUntill, "DD/MM/YYYY")
    );

    const userId = session.message.user.id;
    const channel = session.message.source;
    try {
      const result = await SettingsStore.GetSettingsById(userId, channel);
      const newSettings: ISettings = {
        botMutedUntill: ignoreUntill,
        channelId: result.channelId,
        userId: result.userId
      };

      await SettingsStore.SaveSettingsById(userId, newSettings);
      session.send(message);
    } catch (error) {
      session.send("Something went wrong, please try again later.");
    }
  }
];
