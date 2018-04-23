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
} from '../constants'

import { GreetingDialog } from './greeting'
import { SharePointSearchDialog, SharePointSearchLuisName } from './sharepoint-search'
import { HelpDialog } from './help'
import { StopDialog } from './stop'
import { UnignoreUserialog } from './unignore-user'
import { IgnoreUserDialog } from './ignore-user'
import { ShowSettingsDialog } from './show-settings'
import { ReminderCreateDialog } from './reminder-create'
import { onDefault } from './default'
import { recognizers } from '../../server'

export const DefaultDialog = new builder.IntentDialog({
	recognizers: recognizers,
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
