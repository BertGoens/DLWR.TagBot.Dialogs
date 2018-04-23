import * as builder from 'botbuilder'
import {
	intentThreshold,
	StopLuisName,
	CancelLuisName,
	HelpLuisName,
	ShowNextLuisName,
	ShowPreviousLuisName,
} from '../constants'
import { BeginAction } from './display-tags'
import { StopIntent } from './stop'
import { HelpIntent } from './help'
import { NextPageIntent } from './show-next'
import { PreviousPageIntent } from './show-previous'
import { SelectTagRegex } from './select-tag'

export const TagDocumentDialogId = '/tag-document'

export const TagDocumentDialog = (recognizer) => {
	return new builder.IntentDialog({
		recognizers: [recognizer],
		intentThreshold: intentThreshold,
	})
		.onBegin(BeginAction)
		.matches(/Select tag \d/gi, SelectTagRegex)
		.matches(ShowPreviousLuisName, PreviousPageIntent)
		.matches(ShowNextLuisName, NextPageIntent)
		.matchesAny([StopLuisName, CancelLuisName], StopIntent)
		.matches(HelpLuisName, HelpIntent)
		.onDefault(HelpIntent)
}
