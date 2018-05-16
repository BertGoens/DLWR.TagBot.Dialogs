import * as builder from 'botbuilder'

export const SuggestIntent: builder.IDialogWaterfallStep[] = [
	function suggestTags(session, args, next) {
		const tags: string[] = session.dialogData.generatedTags
		const msg = new builder.Message(session)
		if (tags && tags.length > 0) {
			const firstTags = tags.slice(0, 3)
			msg.text(`Some suggested tags:  \n` + firstTags.join(', '))
		} else {
			msg.text(`I coudn't retrieve any tags to suggest.`)
		}
		const nextPageIM = builder.CardAction.imBack(session, 'Next page', 'Show existing tags')
		msg.suggestedActions(builder.SuggestedActions.create(session, [nextPageIM]))
		session.send(msg)
	},
]
