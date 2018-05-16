import * as builder from 'botbuilder'
export const DidntUnderstand: builder.IDialogWaterfallStep[] = [
	function sendHelpMessage(session, args, next) {
		session.send('Sorry, I did not quite catch that, please select a field.')
	},
]
