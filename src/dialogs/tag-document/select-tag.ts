import * as builder from 'botbuilder'
import { LibraryId } from '..'
import { TagDocumentDialogId } from '.'

export const SelectTagRegex: builder.IDialogWaterfallStep[] = [
	function validateSelection(session, results, next) {
		const numbersOnly = /\d+/
		const selectedTagIndex = results.matched.input.match(numbersOnly)
		const selectedDocument = session.userData.documents[selectedTagIndex[0]]
		session.userData.selectedDocument = selectedDocument
		// Ask for more tags
		session.replaceDialog(`${TagDocumentDialogId}`, { document: selectedDocument })
	},
]
