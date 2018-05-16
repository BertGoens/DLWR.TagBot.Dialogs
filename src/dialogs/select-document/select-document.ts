import * as builder from 'botbuilder'
import { LibraryId } from '../index'
import { SelectFieldDialogId } from '../select-field'

export const SelectDocumentsRegex: builder.IDialogWaterfallStep[] = [
	function validateSelection(session, results, next) {
		const numbersOnly = /\d+/
		const selectedDocumentIndex = results.matched.input.match(numbersOnly)
		const selectedDocument = session.userData.documents.Documents[selectedDocumentIndex[0]]
		session.userData.selectedDocument = selectedDocument
		session.beginDialog(`${LibraryId}:${SelectFieldDialogId}`, {
			document: selectedDocument,
			response: session.userData.documents,
		})
	},
	function(session, results) {
		// TODO Check their answer
		if (results.response) {
			session.send("That's correct! You are wise beyond your years...")
		} else {
			session.send(
				"Sorry you couldn't figure it out. Everyone knows that the meaning of life is 42."
			)
		}
	},
]
