import * as builder from 'botbuilder'

export const ConfirmIntent: builder.IDialogWaterfallStep[] = [
	function sendHelpMessage(session, args, next) {
		const msg = new builder.Message().text("Ok, I didn't add any tags")
		session.send(msg)
	},
]
