import * as builder from 'botbuilder'

export const HelpIntent: builder.IDialogWaterfallStep[] = [
	function sendHelpMessage(session, args, next) {
		const message = new builder.Message()
			.text(`Select a missing field by clicking the "Select" button.`)
			.suggestedActions(
				builder.SuggestedActions.create(session, [
					builder.CardAction.imBack(session, 'Quit', 'Quit'),
				])
			)
		session.send(message)
	},
]
