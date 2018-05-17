import * as builder from 'botbuilder'
import { IDisplayChoice, MakeDocumentMessage } from './util/make-message'

export const NextPageIntent: builder.IDialogWaterfallStep[] = [
	function showNextPage(session, args, next) {
		const currentIndex = session.dialogData.currentViewIndex || 0
		const newIndex = currentIndex + 1

		const options: IDisplayChoice = {
			session: session,
			response: session.dialogData.documents,
			currentViewIndex: session.dialogData.currentViewIndex,
			requestedViewIndex: newIndex,
		}
		const msgSelectDocument = MakeDocumentMessage(options)

		session.send(msgSelectDocument)
	},
]
