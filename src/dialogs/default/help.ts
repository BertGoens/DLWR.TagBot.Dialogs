import * as builder from 'botbuilder'

export const HelpDialog: builder.IDialogWaterfallStep[] = [
	function sendHelpMessage(session, args, next) {
		const message = new builder.Message()
			.text(
				'' +
					'### Hey!  \n' +
					"My name is **TagBot**, I'm here to help you tag documents on SharePoint who lack required properties." +
					"If I find an untagged document I'll notify you and suggest some tags.  \n" +
					'Would you like to try it out?'
			)
			.suggestedActions(
				builder.SuggestedActions.create(session, [
					builder.CardAction.imBack(session, 'Search for documents', 'Search for documents'),
				])
			)
		session.send(message)
	},
]
