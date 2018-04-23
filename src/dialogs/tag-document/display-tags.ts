import * as builder from 'botbuilder'
import { IDocument, KeywordStore } from '../../stores'
import { logSilly } from '../../util'
import { Pager } from '../../util/pager'

export interface IDisplayChoice {
	session: builder.Session
	document: IDocument
	tagList: { availableTags: string[]; generatedTags: string[] }
	currentViewIndex?: number
	requestedViewIndex?: number
}

export const DispayTagsMsg = (options: IDisplayChoice) => {
	// display 4 choices
	const document: IDocument = options.document
	const pagerSize = 4

	const myPage = Pager().TakePage({
		documents: options.tagList.availableTags,
		pageSize: pagerSize,
		requestedPage: options.requestedViewIndex,
	})

	const cardActions = myPage.documents.map((myTag: string) => {
		return builder.CardAction.imBack(options.session, `Add tag ${myTag}`, myTag)
	})

	const thumbnailCard = new builder.ThumbnailCard(options.session)
		.title(document.Title)
		.buttons(cardActions)
		.subtitle(`Author: ${document.Author}`)
		.text(`Tags: ${myPage.page}/All  /nChoose your fitting tags from the list:`)

	const msg = new builder.Message(options.session).addAttachment(thumbnailCard)

	const nextPageIM = builder.CardAction.imBack(options.session, 'Next page', 'Next page')
	const previousIM = builder.CardAction.imBack(options.session, 'Previous page', 'Previous page')

	const suggestions = []
	if (myPage.previousPagePossible) {
		suggestions.push(previousIM)
	}
	if (myPage.nextPagePossible) {
		suggestions.push(nextPageIM)
	}
	if (suggestions.length > 0) {
		msg.suggestedActions(builder.SuggestedActions.create(options.session, suggestions))
	}

	logSilly(`Tag Page ${myPage.page}`)
	options.session.dialogData.currentViewIndex = myPage.page
	return msg
}

export const BeginAction = (session: builder.Session, args, next) => {
	// take tag document
	const document: IDocument = session.dialogData.documents[session.userData.documentsTagged]

	session.sendTyping()
	// Get suggested tags
	const keywords = KeywordStore.GetKeywords(document.Path)
		.then((keywords) => {
			let suggestedTags = []
			if (keywords && keywords.documents && keywords.documents[0]) {
				suggestedTags = keywords.documents[0].keyPhrases
				session.dialogData.selectedDocumentSuggestedTags = suggestedTags
			}

			session.dialogData.selectedDocument = args.selectedDocument
			session.dialogData.selectedDocumentAvailableTags = args.selectedDocumentAvailableTags

			const options: IDisplayChoice = {
				session: session,
				document: session.dialogData.selectedDocument,
				tagList: {
					availableTags: session.dialogData.selectedDocumentAvailableTags,
					generatedTags: session.dialogData.selectedDocumentGeneratedTags,
				},
			}
			const msgSelectDocument = DispayTagsMsg(options)

			session.send(msgSelectDocument)
		})
		.catch((err) => {
			session.send('Something went wrong when collecting the tags for the selected document')
		})
}
