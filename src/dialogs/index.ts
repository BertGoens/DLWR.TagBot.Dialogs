import { logSilly } from '../util'
import { DefaultDialog, DefaultDialogId } from './default/index'
import { TaxonomyFieldDialog, TaxonomyFieldDialogId } from './fields/taxonomy'
import { SelectDocumentDialogId, SelectDocumentIntentDialog } from './select-document/index'
import { SelectFieldDialog, SelectFieldDialogId } from './select-field'

// If I were to make custom Libraries for some intents
// This is how I would do it:
// const lib = new builder.Library('shop');
// More information in the ContosoFlowers example:
// https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/demo-ContosoFlowers#bot-libraries-for-creating-reusable-dialogs
export const LibraryId = '*'

export const applyDialogs = ({ bot, recognizer }) => {
	bot.library(LibraryId).dialog(DefaultDialogId, DefaultDialog(recognizer))
	logSilly(`Added: ${LibraryId}:${DefaultDialogId}`)

	bot.library(LibraryId).dialog(SelectDocumentDialogId, SelectDocumentIntentDialog(recognizer))
	logSilly(`Added: ${LibraryId}:${SelectDocumentDialogId}`)

	bot.library(LibraryId).dialog(SelectFieldDialogId, SelectFieldDialog(recognizer))
	logSilly(`Added: ${LibraryId}:${SelectFieldDialogId}`)

	bot.library(LibraryId).dialog(TaxonomyFieldDialogId, TaxonomyFieldDialog(recognizer))
	logSilly(`Added: ${LibraryId}:${TaxonomyFieldDialogId}`)
}
