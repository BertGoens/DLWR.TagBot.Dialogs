import * as builder from 'botbuilder'
import { TagDocumentName } from '../tag-document'

export const SelectDocumentsRegex: builder.IDialogWaterfallStep[] = [
	function validateSelection(session, results, next) {
		const numbersOnly = /\d+/
		const selectedDocumentIndex = results.matched.input.match(numbersOnly)
		const selectedDocument = session.userData.documents[selectedDocumentIndex[0]]
		session.userData.selectedDocument = selectedDocument
		session.beginDialog('*:' + TagDocumentName, { document: selectedDocument })
	},
]
