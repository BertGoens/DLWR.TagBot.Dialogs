import * as builder from 'botbuilder'
import { IDocument, IField } from '../../../stores/sharepoint-store'

export interface IFieldTextArgs {
	document: IDocument
	field: IField
}

export const FieldTextSteps: builder.IDialogWaterfallStep[] = [
	function(session, args: IFieldTextArgs) {
		const saveField = args.field
		session.dialogData.field = saveField
		builder.Prompts.text(session, `Add your new ${saveField.Title} for ${args.document.Title}`, {
			maxLength: saveField.TypeProperties && saveField.TypeProperties['MaxLength'],
		})
	},
	function(session, results) {
		const response = results && results.response
		if (response) {
			session.dialogData.newValue = response
			builder.Prompts.confirm(session, `Save "${response}"? (Yes/No)`)
		} else {
			session.endDialogWithResult({ response: false })
		}
	},
	function(session, results) {
		if (results && results.response) {
			session.endDialogWithResult({ response: true })
		} else {
			session.endDialogWithResult({ response: false })
			session
		}
	},
]
