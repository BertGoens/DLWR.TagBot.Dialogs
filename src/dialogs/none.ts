import * as builder from 'botbuilder'

export const NoneLuisName = 'None'
export const NoneDialog: builder.IDialogWaterfallStep[] = [
	function sendHelpMessage(session, args, next) {
		const message = new builder.Message().text(
			"Hi... I'm a TagBot. I can find and show you untagged documents on SharePoint, " +
				' suggest tags and add your tags for you.'
		)
		session.send(message)
	},
]
