import * as builder from 'botbuilder'

export const StopDialog: builder.IDialogWaterfallStep[] = [
	function handleConfirmationMessage(session, args, next) {
		session.endDialog()
	},
]
