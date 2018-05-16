import * as builder from 'botbuilder'
import { LibraryId } from '..'
import { IDocument, IField } from '../../stores'
import { TaxonomyFieldDialogId } from '../fields/taxonomy'

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

		// Launch new dialog
		switch (saveField.Type) {
			case 'TaxonomyField':
				session.beginDialog(`${LibraryId}:${TaxonomyFieldDialogId}`, { document: document })
				break
			case 'FieldText':
				builder.Prompts.text(session, `Add your new ${saveField.Title}`, {
					maxLength: saveField.TypeProperties && saveField.TypeProperties['MaxLength'],
				})
				break
			default:
				session.dialogData.field = null
				const text =
					"Sorry, I don't know how to manage that fieldtype as of yet." +
					'Please complete this action on the website.'
				session.send(text)
				break
		}
	},

	function(session, results) {
		if (results && results.response) {
			session.send("That's correct! You are wise beyond your years...")
		} else {
			session.send(
				"Sorry you couldn't figure it out. Everyone knows that the meaning of life is 42."
			)
		}
	},
]
