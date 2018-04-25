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

// Important: this must be / unless you speficy the default dialog with code
// somewhere that wasn't documented. Since this is the expected default
// Dialog id, I'll leave it as standard.
export const DefaultDialogId = '/'

export const DefaultDialog = (recognizer) => { return new builder.IntentDialog({
	recognizers: [recognizer],
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
}