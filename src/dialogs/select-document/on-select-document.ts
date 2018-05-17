import * as builder from 'botbuilder'
import { SelectDocumentDialogId } from '.'
import { IDocument, IResponse } from '../../stores'
import { LibraryId } from '../index'
import { SelectFieldDialogId } from '../select-field'
import { ISelectFieldDialogArgs } from '../select-field/display-fields'
import { ISelectDocumentArgs } from './display-documents'
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
		if (results && results.response) {
			const finishedDocument: IDocument = GetSelectDocumentDialogData({
				key: SelectDocumentConst.selectedDocument,
				session: session,
			})

			const response: IResponse = GetSelectDocumentDialogData({
				key: SelectDocumentConst.response,
				session: session,
			})

			const newDocuments = response.Documents.filter((doc) => {
				if (doc.Path !== finishedDocument.Path) {
					return doc
				}
			})

			response.Documents = newDocuments

			SetSelectDocumentDialogData({
				key: SelectDocumentConst.response,
				value: response,
				session: session,
			})

			if (newDocuments && newDocuments.length > 0) {
				builder.Prompts.confirm(session, `Document complete, work on another document?`)
			} else {
				session.send('Document complete!')
				return session.endDialog()
			}
		}
	},
	function(session, results) {
		if (results && results.response) {
			const response: IResponse = GetSelectDocumentDialogData({
				key: SelectDocumentConst.response,
				session: session,
			})
			const dArgs: ISelectDocumentArgs = { reponse: response }
			session.replaceDialog(`${LibraryId}:${SelectDocumentDialogId}`, dArgs)
		} else {
			session.send('Perhaps another time')
			session.endDialog()
		}
	},
]
