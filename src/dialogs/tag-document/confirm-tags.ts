import * as builder from 'botbuilder'
import { SharePointStore, IDocument } from '../../stores'

export const ConfirmIntent: builder.IDialogWaterfallStep[] = [
	function sendConfirmMessage(session, args, next) {
		const msg = new builder.Message().text('Adding these tags: ' + session.userData.tagsToAdd)
		const document: IDocument = session.userData.documents[session.userData.documentsTagged]
		document.Tags = session.userData.tagsToAdd
		SharePointStore.SaveDocument(document).then(() => {
			session.userData.documentsTagged += 1
			session.send(msg)
			session.endDialog()
		})
	},
]
