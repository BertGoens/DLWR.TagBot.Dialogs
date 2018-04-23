import * as builder from 'botbuilder'
import { IDisplayChoice, DispayTagsMsg } from './display-tags'

export const PreviousPageIntent: builder.IDialogWaterfallStep[] = [
	function showPreviousPage(session, args, next) {
		const currentIndex = session.dialogData.currentViewIndex || 0
		const newIndex = currentIndex - 1

		const options: IDisplayChoice = {
			session: session,
			currentViewIndex: session.dialogData.currentViewIndex,
			requestedViewIndex: newIndex,
			document: session.dialogData.document,
			generatedTags: session.dialogData.generatedTags,
		}
		const msgSelectDocument = DispayTagsMsg(options)

		session.send(msgSelectDocument)
	},
]
