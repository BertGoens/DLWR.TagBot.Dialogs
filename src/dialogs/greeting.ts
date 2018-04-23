import * as builder from 'botbuilder'

const greetingMessage = (session) => {
	return new builder.Message()
		.text("Hi, let's tag some documents!")
		.suggestedActions(
			builder.SuggestedActions.create(session, [
				builder.CardAction.imBack(session, 'Search for documents', '👍'),
				builder.CardAction.imBack(session, 'Quit', '👎'),
			])
		)
}

export const GreetingDialog: builder.IDialogWaterfallStep[] = [
	function sendHelpMessage(session, args, next) {
		const message = session.send(greetingMessage(session))
	},
]
