import * as builder from 'botbuilder'

export const StopIntent: builder.IDialogWaterfallStep[] = [
	function quitConversaino(session, args, next) {
		const result: builder.IDialogResult<any> = {
			response: false,
		}
		session.endDialogWithResult(result)
	},
]
