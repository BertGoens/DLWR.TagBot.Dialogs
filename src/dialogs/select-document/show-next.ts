import * as builder from 'botbuilder'
import { DispayDocumentsMsg, IDisplayChoice } from './display-documents'

export const NextPageIntent: builder.IDialogWaterfallStep[] = [
	function showNextPage(session, args, next) {
		const currentIndex = session.userData.currentViewIndex || 0
		const newIndex = currentIndex + 1

		const options: IDisplayChoice = {
			session: session,
			response: session.userData.documents,
			currentViewIndex: session.userData.currentViewIndex,
			requestedViewIndex: newIndex,
		}
		const msgSelectDocument = DispayDocumentsMsg(options)

		session.send(msgSelectDocument)
	},
]
