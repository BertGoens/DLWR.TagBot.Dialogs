import * as builder from 'botbuilder'

export const StopIntent: builder.IDialogWaterfallStep[] = [
	function quitConversaino(session, args, next) {
		// TODO Make sure this message is sent from somewhere
		const msg = new builder.Message().text("Alright, I didn't add any tags")
		session.endDialogWithResult({ response: false })
	},
]
