import * as builder from 'botbuilder'
import { LibraryId } from '..'
import { IDocument, IField } from '../../stores'
import { FieldTextDialogId } from '../fields/fieldtext'
import { IFieldTextArgs } from '../fields/fieldtext/steps'
import { TaxonomyFieldDialogId } from '../fields/taxonomy'
import { MakeFieldMessage } from './util/make-message'

interface IOptions {
	field: IField
	document: IDocument
	session: builder.Session
}
const launchDialog = (options: IOptions) => {
	switch (options.field.Type) {
		case 'TaxonomyField':
			const args1: IFieldTextArgs = {
				document: options.document,
				field: options.field,
			}
			options.session.beginDialog(`${LibraryId}:${TaxonomyFieldDialogId}`, args1)
			break
		case 'FieldText':
			const args2: IFieldTextArgs = {
				document: options.document,
				field: options.field,
			}
			options.session.beginDialog(`${LibraryId}:${FieldTextDialogId}`, args2)
			break
		default:
			options.session.dialogData.field = null
			const text =
				"Sorry, I don't know how to manage that fieldtype as of yet." +
				'Please complete this action on the website.'
			options.session.send(text)
			break
	}
}

export const OnSelectField: builder.IDialogWaterfallStep[] = [
	function validateSelection(session, results, next) {
		const quotedTextRegex = /(["'])(?:(?=(\\?))\2.)*?\1/
		const selectedFieldResult = results.matched.input.match(quotedTextRegex)[0]
		const selectedFieldTitle = selectedFieldResult.replace(/"/g, '')

		// get field properties
		const document: IDocument = session.dialogData.document
		const fields: IField[] = session.dialogData.response.Fields

		let fieldId
		for (const mprop of document.MissingProperties) {
			if (mprop.Title === selectedFieldTitle) {
				fieldId = mprop.Id
				break
			}
		}

		let saveField: IField
		for (const cField of fields) {
			if (cField.Id === fieldId) {
				saveField = cField
				break
			}
		}

		session.dialogData.field = saveField

		launchDialog({ field: saveField, document: document, session: session })
	},

	function(session, results) {
		// remove field from missing fields
		const editField: IField = session.dialogData.field
		const document: IDocument = session.dialogData.document

		if (results && results.response) {
			const newMissingFields = document.MissingProperties.filter((missingField) => {
				if (missingField.Id !== editField.Id) {
					return missingField
				}
			})

			document.MissingProperties = newMissingFields
			session.dialogData.document = document

			// Quit if no fields left
			if (document.MissingProperties && document.MissingProperties.length < 1) {
				return session.endDialogWithResult({ response: true })
			}
		}
		session.dialogData.field = null

		// Show new dialog
		const msg = MakeFieldMessage({ fields: document.MissingProperties, session: session })
		session.send(msg)
	},
]
