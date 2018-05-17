import * as builder from 'botbuilder'
import { LibraryId } from '..'
import { IDocument, IField } from '../../stores'
import { FieldTextDialogId } from '../fields/fieldtext'
import { IFieldTextArgs } from '../fields/fieldtext/steps'
import { TaxonomyFieldDialogId } from '../fields/taxonomy'
import { MakeFieldMessage } from './display-fields'

interface IOptions {
	saveField: IField
	session: builder.Session
}
const launchDialog = (options: IOptions) => {
	switch (options.saveField.Type) {
		case 'TaxonomyField':
			options.session.beginDialog(`${LibraryId}:${TaxonomyFieldDialogId}`, {
				document: options.session.dialogData.document,
				field: options.saveField,
			})
			break
		case 'FieldText':
			const args: IFieldTextArgs = {
				document: options.session.dialogData.document,
				field: options.saveField,
			}
			options.session.beginDialog(`${LibraryId}:${FieldTextDialogId}`, args)
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

		launchDialog({ saveField: saveField, session: session })
	},

	function(session, results) {
		// remove field from missing fields
		const editField: IField = session.dialogData.field
		const document: IDocument = session.dialogData.document
		const newMissingFields = document.MissingProperties.filter((missingField) => {
			if (missingField.Id !== editField.Id) {
				return missingField
			}
		})
		session.dialogData.field = null
		document.MissingProperties = newMissingFields
		session.dialogData.document = document

		if (results && results.response) {
			// Quit if no fields left
			if (document.MissingProperties && document.MissingProperties.length < 1) {
				return session.endDialogWithResult({ response: true })
			}
		}

		// Show new dialog
		const msg = MakeFieldMessage({ fields: document.MissingProperties, session: session })
		session.send(msg)
	},
]
