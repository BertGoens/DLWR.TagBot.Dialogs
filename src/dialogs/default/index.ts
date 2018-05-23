import * as builder from 'botbuilder'
import {
	GreetingLuisName,
	HelpLuisName,
	IgnoreUserLuisName,
	ShowSettingsLuisName,
	StopLuisName,
	UnignoreUserLuisName,
	intentThreshold,
} from '../constants'
import { onDefault } from './default'
import { GreetingDialog } from './greeting'
import { HelpDialog } from './help'
import { IgnoreUserDialog } from './ignore-user'
import { SharePointSearchDialog, SharePointSearchLuisName } from './sharepoint-search'
import { ShowSettingsDialog } from './show-settings'
import { StopDialog } from './stop'
import { UnignoreUserialog } from './unignore-user'

// Important: this must be / unless you speficy the default dialog with code
// somewhere that wasn't documented. Since this is the expected default
// Dialog id, I'll leave it as standard.
export const DefaultDialogId = '/'

export const DefaultDialog = (recognizer) => {
	return new builder.IntentDialog({
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
