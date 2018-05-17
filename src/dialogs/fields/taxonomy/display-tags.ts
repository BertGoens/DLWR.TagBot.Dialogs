import * as builder from 'botbuilder'
import { KeywordStore } from '../../../stores/keyword-store'
import { GetTaxonomyValues, IDocument, IField } from '../../../stores/sharepoint-store'
import { logError, logSilly } from '../../../util/logger'
import { DispayTagsMsg, IDisplayChoice } from './util/build-tags-msg'

export interface ITaxonomyDialogArgs {
	document: IDocument
	field: IField
}

export const DisplayTags = async (session: builder.Session, args: ITaxonomyDialogArgs, next) => {
	// get parameters
	const document: IDocument = args.document
	const field = args.field

	// Get suggested tags (non blocking)
	let generatedTags = []
	if (field.TypeProperties['Open']) {
		session.sendTyping()

		KeywordStore.GetKeywords(document.Path)
			.then((keywords) => {
				if (keywords && keywords.documents && keywords.documents[0]) {
					generatedTags = keywords.documents[0].keyPhrases
					session.dialogData.generatedTags = generatedTags
					logSilly(`Tags retrieved: ${generatedTags.length}`)
				}
			})
			.catch((err) => {
				logError(err.message)
			})
	}

	// Get Available tags (blocking)
	try {
		const termsetId = field.TypeProperties["TermsetId"]
		const response = await GetTaxonomyValues(termsetId)
		document.AvailableTags = response.data || []
	} catch (error) {
		logError(error.message)
		const msgText =
			'Something went wrong when downloading ' +
			'the keywords for this taxonomy field, please try again later.'
		session.send(msgText)
		return session.endDialogWithResult({ response: false })
	}

	// Save parameters as dialog data
	session.dialogData.document = document
	session.dialogData.field = field
	session.dialogData.generatedTags = generatedTags

	// Display parameters
	const options: IDisplayChoice = {
		session: session,
		document: document,
		generatedTags: session.dialogData.generatedTags,
	}
	const msgSelectDocument = DispayTagsMsg(options)

	session.send(msgSelectDocument)
}
