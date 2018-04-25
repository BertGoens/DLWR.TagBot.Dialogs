import * as builder from 'botbuilder'
export const StopIntent: builder.IDialogWaterfallStep[] = [
	function quitConversaino(session, args, next) {
		session.endConversation('Ok')
	},
]
