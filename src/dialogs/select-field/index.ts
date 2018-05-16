import * as builder from 'botbuilder'
import { CancelLuisName, HelpLuisName, StopLuisName, intentThreshold } from '../constants'
import { DidntUnderstand } from './default'
import { SendSelectFieldMsg } from './display-fields'
import { HelpIntent } from './help'
import { OnSelectField } from './on-select-field'
import { StopIntent } from './stop'

export const SelectFieldDialogId = '/select-field'

export const SelectFieldDialog = (recognizer) => {
	return new builder.IntentDialog({
		recognizers: [recognizer],
		intentThreshold: intentThreshold,
	})
		.onBegin(SendSelectFieldMsg)
		.matches(/Add ["']/gi, OnSelectField)
		.matchesAny([StopLuisName, CancelLuisName], StopIntent)
		.matches(HelpLuisName, HelpIntent)
		.onDefault(DidntUnderstand)
}
