import * as builder from 'botbuilder'
import { SharePointStore, IDocument } from '../../stores'

export const ConfirmIntent: builder.IDialogWaterfallStep[] = [
	async function sendConfirmMessage(session, args, next) {
		const document: IDocument = session.dialogData.document

		const msg = new builder.Message().text('Ok, I have added these tags: ' + document.Tags)

		try {
			await SharePointStore.SaveDocument(document)
			session.send(msg)
			session.endDialog("I'll contact you the next workday if there is anything to be tagged.")
		} catch (error) {
			session.send('Something went wrong when trying to save, please try again.')
		}
	},
]
