import * as builder from 'botbuilder'
import { IDocument, SaveDocument } from '../../../stores'

export const ConfirmIntent: builder.IDialogWaterfallStep[] = [
	async function sendConfirmMessage(session, args, next) {
		const document: IDocument = session.dialogData.document

		const msg = new builder.Message().text('Ok, I have added these tags: ' + document.Tags)

		try {
			const result = await SaveDocument(document)
			session.send(msg)
			session.endDialogWithResult({ response: true })
		} catch (error) {
			session.send('Something went wrong when trying to save, please try again.')
		}
	},
]
