import * as builder from "botbuilder";
import * as datefns from "date-fns";
import * as schedule from "node-schedule";
import { resolveDateV2 } from "../util/entity-resolver";

//import { SettingsStore } from "../stores";

const sendReminder = () => {
  // send reminder to user
};

export const ReminderCreateLuisName = "Reminder.Create";
export const ReminderCreateDialog: builder.IDialogWaterfallStep[] = [
  async function createReminder(session, args, next) {
    var muteUntillDate: Date = resolveDateV2(args.entities);
    schedule.scheduleJob(muteUntillDate, sendReminder);

    var text = "I'll remind you ";
    if (datefns.isToday(muteUntillDate)) {
      var hoursDiff = datefns.differenceInHours(muteUntillDate, new Date());
      text += "in " + hoursDiff + " hours";
    } else if (datefns.isThisWeek(muteUntillDate)) {
      "this " +
        datefns.format(muteUntillDate, "dddd") +
        " at " +
        datefns.format(muteUntillDate, "HH:mm");
    } else {
      "on " + datefns.format(muteUntillDate, "YYYY/MM/DD - HH:mm");
    }

    var msg = new builder.Message().text(text);
    session.send(msg);
  }
];
