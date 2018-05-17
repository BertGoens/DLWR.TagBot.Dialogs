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
		if (results.response) {
			session.send('Document complete!')
			session.endDialogWithResult({ response: true })
		} else {
			session.send('Perhaps another time')
			session.endDialogWithResult({ response: false })
		}
	},
]
