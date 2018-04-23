import * as builder from 'botbuilder'
import {
	CancelLuisName,
	ConfirmLuisName,
	GreetingLuisName,
	IgnoreUserLuisName,
	NoneLuisName,
	ReminderCreateLuisName,
	ShowSettingsLuisName,
	StopLuisName,
	UnignoreUserLuisName,
	HelpLuisName,
	intentThreshold,
	DefaultDialogName,
} from './constants'

import { SelectDocumentDialogId, SelectDocumentIntentDialog } from './select-document/index'
import { GreetingDialog } from './greeting'
import { SharePointSearchDialog, SharePointSearchLuisName } from './sharepoint-search'
import { HelpDialog } from './help'
import { StopDialog } from './stop'
import { UnignoreUserialog } from './unignore-user'
import { IgnoreUserDialog } from './ignore-user'
import { ShowSettingsDialog } from './show-settings'
import { ReminderCreateDialog } from './reminder-create'
import { onDefault } from './default'
import { TagDocumentName, TagDocumentDialog } from './tag-document'

export interface IApplyDialogOptions {
	recognizers: [builder.IIntentRecognizer]
	bot: builder.UniversalBot
}

export const applyDialogs = (options: IApplyDialogOptions) => {
	const DefaultDialog = new builder.IntentDialog({
		recognizers: options.recognizers,
		intentThreshold: intentThreshold,
	})
		.matches(GreetingLuisName, GreetingDialog)
		.matches(SharePointSearchLuisName, SharePointSearchDialog)
		.matches(ShowSettingsLuisName, ShowSettingsDialog)
		.matches(IgnoreUserLuisName, IgnoreUserDialog)
		.matches(UnignoreUserLuisName, UnignoreUserialog)
		.matches(HelpLuisName, HelpDialog)
		.matches(StopLuisName, StopDialog)
		.onDefault(onDefault)

	options.bot.library('*').dialog(DefaultDialogName, DefaultDialog)

	const dialogOptions: IApplyDialogOptions = {
		bot: options.bot,
		recognizers: options.recognizers,
	}
	options.bot.library('*').dialog(SelectDocumentDialogId, SelectDocumentIntentDialog(dialogOptions))
	options.bot.library('*').dialog(TagDocumentName, TagDocumentDialog)
}
