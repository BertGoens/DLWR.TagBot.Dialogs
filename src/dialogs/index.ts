import { bot } from '../server'
import { DefaultDialog, DefaultDialogId } from './default'
import { SelectDocumentDialogId, SelectDocumentIntentDialog } from './select-document/index'
import { TagDocumentDialog, TagDocumentName } from './tag-document/tag-document'

export const LibraryId = '*'
export const applyDialogs = () => {
	bot.library(LibraryId).dialog(DefaultDialogId, DefaultDialog)
	bot.library(LibraryId).dialog(SelectDocumentDialogId, SelectDocumentIntentDialog)
	bot.library(LibraryId).dialog(TagDocumentName, TagDocumentDialog)
}
