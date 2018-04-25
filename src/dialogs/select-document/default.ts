import * as builder from 'botbuilder'
export const DefaultAction: builder.IDialogWaterfallStep[] = [
	function sendHelpMessage(session, args, next) {
		session.send('Sorry, I did not quite catch that, please select a document.')
	},
]
