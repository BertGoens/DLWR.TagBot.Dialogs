import * as builder from "botbuilder";
import {
  SelectDocumentDialog,
  TagDocumentDialog,
  TagDocumentName,
  SelectDocumentName,
  GreetingLuisName,
  SharePointSearchLuisName,
  ConfirmLuisName,
  CancelLuisName,
  ShowSettingsLuisName,
  IgnoreUserLuisName,
  UnignoreUserLuisName,
  HelpDialogLuisName,
  StopLuisName,
  ReminderCreateLuisName,
  NoneLuisName,
  onDefault,
  GreetingDialog,
  SharePointSearchDialog,
  ConfirmDialog,
  ShowSettingsDialog,
  IgnoreUserDialog,
  UnignoreUserialog,
  HelpDialog,
  StopDialog,
  ReminderCreateDialog,
  NoneDialog
} from ".";

export * from "./cancel";
export * from "./confirm";
export * from "./default";
export * from "./greeting";
export * from "./help";
export * from "./none";
export * from "./reminder-create";
export * from "./select-document";
export * from "./sharepoint-search";
export * from "./show-settings";
export * from "./stop";
export * from "./tag-document";
export * from "./ignore-user";
export * from "./unignore-user";

export const ShowNextLuisName = "Utilities.ShowNext";
export const ShowPreviousLuisName = "Utilities.ShowPrevious";
export const DefaultDialogName = "/";
export const intentThreshold = 0.4;

export interface IApplyDialogOptions {
  recognizer: builder.IIntentRecognizer;
  bot: builder.UniversalBot;
}

export const applyDialogs = (options: IApplyDialogOptions) => {
  const intentDialog = new builder.IntentDialog({
    recognizers: [options.recognizer],
    intentThreshold: intentThreshold
  })
    .matches(GreetingLuisName, GreetingDialog)
    .matches(SharePointSearchLuisName, SharePointSearchDialog)
    .matches(ConfirmLuisName, ConfirmDialog)
    .matches(CancelLuisName, CancelLuisName)
    .matches(ShowSettingsLuisName, ShowSettingsDialog)
    .matches(IgnoreUserLuisName, IgnoreUserDialog)
    .matches(UnignoreUserLuisName, UnignoreUserialog)
    .matches(HelpDialogLuisName, HelpDialog)
    .matches(StopLuisName, StopDialog)
    .matches(ReminderCreateLuisName, ReminderCreateDialog)
    .matches(NoneLuisName, NoneDialog)
    .onDefault(onDefault);

  options.bot.library("*").dialog(SelectDocumentName, SelectDocumentDialog);
  options.bot.library("*").dialog(TagDocumentName, TagDocumentDialog);
  options.bot.library("*").dialog(DefaultDialogName, intentDialog);
};
