import * as builder from 'botbuilder'
import {
	CancelLuisName,
	ConfirmLuisName,
	HelpLuisName,
	ShowNextLuisName,
	ShowPreviousLuisName,
	StopLuisName,
	intentThreshold,
} from '../../constants'
import { ConfirmIntent } from './confirm-tags'
import { DisplayTags } from './display-tags'
import { HelpIntent } from './help'
import { SelectTagRegex } from './select-tag'
import { NextPageIntent } from './show-next'
import { PreviousPageIntent } from './show-previous'
import { StopIntent } from './stop'
import { SuggestIntent } from './suggest-tags'

export const TaxonomyFieldDialogId = '/taxonomy-field'

export const TaxonomyFieldDialog = (recognizer) => {
	return new builder.IntentDialog({
		recognizers: [recognizer],
		intentThreshold: intentThreshold,
	})
		.onBegin(DisplayTags)
		.matches(/Add tag ["']/gi, SelectTagRegex)
		.matches(/suggest/gi, SuggestIntent)
		.matches(ConfirmLuisName, ConfirmIntent)
		.matches(ShowPreviousLuisName, PreviousPageIntent)
		.matches(ShowNextLuisName, NextPageIntent)
		.matchesAny([StopLuisName, CancelLuisName], StopIntent)
		.matches(HelpLuisName, HelpIntent)
		.onDefault(HelpIntent)
}
