import * as builder from 'botbuilder'
import { intentThreshold } from '../constants'
import { HelpIntent } from './help'
import { StopIntent } from './stop'
import { DefaultAction } from './default'
import { NextPageIntent } from './show-next'
import { PreviousPageIntent } from './show-previous'
import { SelectDocumentsRegex } from './select-document'
import { BeginAction } from './display-documents'
import {
	ShowPreviousLuisName,
	ShowNextLuisName,
	StopLuisName,
	CancelLuisName,
	HelpLuisName,
} from '../constants'
import { recognizers } from '../../server'

export interface IApplyDialogOptions {
	recognizers: [builder.IIntentRecognizer]
	bot: builder.UniversalBot
}

export const SelectDocumentDialogId = '/select-document'

export const SelectDocumentIntentDialog = new builder.IntentDialog({
	recognizers: recognizers,
	intentThreshold: intentThreshold,
})
	.onBegin(BeginAction)
	.matches(/Select document \d/gi, SelectDocumentsRegex)
	.matches(ShowPreviousLuisName, PreviousPageIntent)
	.matches(ShowNextLuisName, NextPageIntent)
	.matchesAny([StopLuisName, CancelLuisName], StopIntent)
	.matches(HelpLuisName, HelpIntent)
	.onDefault(DefaultAction)
