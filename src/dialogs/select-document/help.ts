import * as builder from 'botbuilder'
export const HelpIntent: builder.IDialogWaterfallStep[] = [
	function sendHelpMessage(session, args, next) {
		const message = new builder.Message()
			.text(
				`Select a document by clicking the "Select" button, or preview it by clicking "Open file". `
			)
			.suggestedActions(
				builder.SuggestedActions.create(session, [
					builder.CardAction.imBack(session, 'Cancel', 'Cancel'),
				])
			)
		session.send(message)
	},
]
