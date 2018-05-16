import * as builder from 'botbuilder'

export const OnSelectField: builder.IDialogWaterfallStep[] = [
	function validateSelection(session, results, next) {
		const quotedTextRegex = /(["'])(?:(?=(\\?))\2.)*?\1/
		const selectedFieldResult = results.matched.input.match(quotedTextRegex)[0]
		const selectedField = selectedFieldResult.replace(/"/g, '')

		session.userData.selectedField = {}
		session.send('Editing: ' + selectedField)
		// session.beginDialog(`${LibraryId}:${TagDocumentDialogId}`, { document: selectedDocument })
	},
	/*,
	function(session, results) {
		// TODO Check their answer
		if (results.response) {
			session.send("That's correct! You are wise beyond your years...")
		} else {
			session.send(
				"Sorry you couldn't figure it out. Everyone knows that the meaning of life is 42."
			)
		}
	}, */
]
