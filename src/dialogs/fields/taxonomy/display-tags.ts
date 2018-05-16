import * as builder from 'botbuilder'
import { KeywordStore } from '../../../stores/keyword-store'
import { IDocument } from '../../../stores/sharepoint-store'
import { logSilly } from '../../../util/logger'
import { DispayTagsMsg, IDisplayChoice } from './util/build-tags-msg'

export const DisplayTags = async (session: builder.Session, args, next) => {
	// get parameters
	const document: IDocument = args.document

	session.sendTyping()

	// Get suggested tags
	let generatedTags = []
	try {
		// TODO only do if the termset is open
		const keywords = await KeywordStore.GetKeywords(document.Path)
		if (keywords && keywords.documents && keywords.documents[0]) {
			generatedTags = keywords.documents[0].keyPhrases
		}
	} catch (error) {
		session.send('Something went wrong when collecting the tags for the selected document')
		return
	}
	logSilly(`Tags retrieved: ${generatedTags.length}`)

	// Save parameters as dialog data
	session.dialogData.document = args.document
	session.dialogData.generatedTags = generatedTags

	// Display parameters
	const options: IDisplayChoice = {
		session: session,
		document: session.dialogData.document,
		generatedTags: session.dialogData.generatedTags,
	}
	const msgSelectDocument = DispayTagsMsg(options)

	session.send(msgSelectDocument)
}
