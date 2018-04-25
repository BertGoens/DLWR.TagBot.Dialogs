import { DefaultDialogId, DefaultDialog } from './default/index'
import { SelectDocumentDialogId, SelectDocumentIntentDialog } from './select-document/index'
import { TagDocumentDialogId, TagDocumentDialog } from './tag-document/index'
import { logSilly } from '../util'

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
	bot.library(LibraryId).dialog(TagDocumentDialogId, TagDocumentDialog(recognizer))
	logSilly(`Added: ${LibraryId}:${TagDocumentDialogId}`)
}
