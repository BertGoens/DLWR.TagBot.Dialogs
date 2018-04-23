import { DefaultDialogId, DefaultDialog } from './default/index'
import { SelectDocumentDialogId, SelectDocumentIntentDialog } from './select-document/index'
import { TagDocumentDialogId, TagDocumentDialog } from './tag-document/index'
import { logSilly } from '../util'

export const LibraryId = '*'

// TODO, pass and accept these variables
export const applyDialogs = ({ bot, recognizer }) => {
	bot.library(LibraryId).dialog(DefaultDialogId, DefaultDialog(recognizer))
	logSilly(`Added: ${LibraryId}:${DefaultDialogId}`)
	bot.library(LibraryId).dialog(SelectDocumentDialogId, SelectDocumentIntentDialog(recognizer))
	logSilly(`Added: ${LibraryId}:${SelectDocumentDialogId}`)
	bot.library(LibraryId).dialog(TagDocumentDialogId, TagDocumentDialog(recognizer))
	logSilly(`Added: ${LibraryId}:${TagDocumentDialogId}`)
}
