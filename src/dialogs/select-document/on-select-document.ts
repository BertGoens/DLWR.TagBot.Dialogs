import * as builder from 'botbuilder'
import { LibraryId } from '../index'
import { SelectFieldDialogId } from '../select-field'
import { ISelectFieldDialogArgs } from '../select-field/display-fields'
import {
	GetSelectDocumentDialogData,
	SelectDocumentConst,
	SetSelectDocumentDialogData,
} from './util/dialog-data'

export const SelectDocumentsRegex: builder.IDialogWaterfallStep[] = [
	function validateSelection(session, results, next) {
		const numbersOnly = /\d+/
		const selectedDocumentIndex = results.matched.input.match(numbersOnly)
		const response = GetSelectDocumentDialogData({
			key: SelectDocumentConst.response,
			session: session,
		})
		const selectedDocument = response.Documents[selectedDocumentIndex[0]]
		SetSelectDocumentDialogData({
			key: SelectDocumentConst.selectedDocument,
			value: selectedDocument,
			session: session,
		})
		const startArgs: ISelectFieldDialogArgs = {
			selectedDocument: selectedDocument,
			response: response,
		}
		session.beginDialog(`${LibraryId}:${SelectFieldDialogId}`, startArgs)
	},
	function(session, results) {
		if (results.response) {
			// TODO remove this document from collection
			session.send('Document complete!')
			session.endDialogWithResult({ response: true })
		} else {
			session.send('Perhaps another time')
			session.endDialogWithResult({ response: false })
		}
	},
]
