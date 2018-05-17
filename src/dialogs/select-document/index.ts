import * as builder from 'botbuilder'
import {
	CancelLuisName,
	HelpLuisName,
	ShowNextLuisName,
	ShowPreviousLuisName,
	StopLuisName,
	intentThreshold,
} from '../constants'
import { DefaultAction } from './default'
import { BeginAction } from './display-documents'
import { HelpIntent } from './help'
import { SelectDocumentsRegex } from './on-select-document'
import { NextPageIntent } from './show-next'
import { PreviousPageIntent } from './show-previous'
import { StopIntent } from './stop'

export interface IApplyDialogOptions {
	recognizers: [builder.IIntentRecognizer]
	bot: builder.UniversalBot
}

export const SelectDocumentDialogId = '/select-document'

export const SelectDocumentIntentDialog = (recognizer) => {
	return new builder.IntentDialog({
		recognizers: [recognizer],
		intentThreshold: intentThreshold,
	})
		.onBegin(BeginAction)
		.matches(/Select document \d/gi, SelectDocumentsRegex)
		.matches(ShowPreviousLuisName, PreviousPageIntent)
		.matches(ShowNextLuisName, NextPageIntent)
		.matchesAny([StopLuisName, CancelLuisName], StopIntent)
		.matches(HelpLuisName, HelpIntent)
		.onDefault(DefaultAction)
}
