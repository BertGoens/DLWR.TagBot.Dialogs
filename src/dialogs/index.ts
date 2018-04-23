import { bot } from '../server'
import { DefaultDialogName } from './constants'
import { DefaultDialog } from './default'
import { SelectDocumentDialogId, SelectDocumentIntentDialog } from './select-document/index'
import { TagDocumentDialog, TagDocumentName } from './tag-document/tag-document'

export const applyDialogs = () => {
	bot.library('*').dialog(DefaultDialogName, DefaultDialog)
	bot.library('*').dialog(SelectDocumentDialogId, SelectDocumentIntentDialog)
	bot.library('*').dialog(TagDocumentName, TagDocumentDialog)
}
