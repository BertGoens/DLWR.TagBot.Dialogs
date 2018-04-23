import * as builder from 'botbuilder'

export const StopIntent: builder.IDialogWaterfallStep[] = [
	function quitConversaino(session, args, next) {
		const msg = new builder.Message().text("Alright, I didn't add any tags")
		session.endConversation()
	},
]
