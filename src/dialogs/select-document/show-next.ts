import * as builder from 'botbuilder'
import { GetSelectDocumentDialogData, SelectDocumentConst } from './util/dialog-data'
import { IDisplayChoice, MakeDocumentMessage } from './util/make-message'

export const NextPageIntent: builder.IDialogWaterfallStep[] = [
	function showNextPage(session, args, next) {
		const currentIndex =
			GetSelectDocumentDialogData({
				key: SelectDocumentConst.currentViewIndex,
				session: session,
			}) || 0
		const newIndex = currentIndex + 1

		const options: IDisplayChoice = {
			session: session,
			response: GetSelectDocumentDialogData({
				key: SelectDocumentConst.response,
				session: session,
			}),
			currentViewIndex: currentIndex,
			requestedViewIndex: newIndex,
		}
		const msgSelectDocument = MakeDocumentMessage(options)

		session.send(msgSelectDocument)
	},
]
