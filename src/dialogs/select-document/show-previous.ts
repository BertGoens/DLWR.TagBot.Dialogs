import * as builder from 'botbuilder'
import { IDisplayChoice, DispayDocumentsMsg } from './display-documents'

export const PreviousPageIntent: builder.IDialogWaterfallStep[] = [
	function showPreviousPage(session, args, next) {
		const currentIndex = session.userData.currentViewIndex || 0
		const newIndex = currentIndex - 1

		const options: IDisplayChoice = {
			session: session,
			documents: session.userData.documents,
			currentViewIndex: session.userData.currentViewIndex,
			requestedViewIndex: newIndex,
		}
		const msgSelectDocument = DispayDocumentsMsg(options)

		session.send(msgSelectDocument)
	},
]
