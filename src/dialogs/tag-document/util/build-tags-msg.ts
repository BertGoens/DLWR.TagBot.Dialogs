import * as builder from 'botbuilder'
import { IDocument } from '../../../stores/sharepoint-store'
import { logSilly } from '../../../util/logger'
import { Pager } from '../../../util/pager'

export interface IDisplayChoice {
	session: builder.Session
	document: IDocument
	generatedTags: string[]
	currentViewIndex?: number
	requestedViewIndex?: number
}

export const DispayTagsMsg = (options: IDisplayChoice) => {
	// display 4 choices
	const document: IDocument = options.document
	const pagerSize = 4

	const myPage = Pager().TakePage({
		documents: document.AvailableTags,
		pageSize: pagerSize,
		requestedPage: options.requestedViewIndex,
	})

	const cardActions = myPage.documents.map((myTag: string) => {
		return builder.CardAction.imBack(options.session, `Add tag "${myTag}"`, myTag)
	})

	const thumbnailCard = new builder.ThumbnailCard(options.session)
		.title(document.Title)
		.buttons(cardActions)
		.subtitle(`Author: ${document.Author}`)
		.text(
			`Tags page: ${myPage.page + 1}/${myPage.pageTotal}` +
				`  \nTags selected: ${(document.Tags && document.Tags.length) || 0}` +
				`  \nChoose your fitting tags from the list:`
		)

	const msg = new builder.Message(options.session).addAttachment(thumbnailCard)

	const nextPageIM = builder.CardAction.imBack(options.session, 'Next page', 'Next page')
	const previousIM = builder.CardAction.imBack(options.session, 'Previous page', 'Previous page')
	const confirmIM = builder.CardAction.imBack(options.session, 'Ok, add the tags', 'Confirm Tags')

	const suggestions = []
	if (myPage.previousPagePossible) {
		suggestions.push(previousIM)
	}
	if (myPage.nextPagePossible) {
		suggestions.push(nextPageIM)
	}
	if (document.Tags.length > 0) {
		suggestions.push(confirmIM)
	}
	if (suggestions.length > 0) {
		msg.suggestedActions(builder.SuggestedActions.create(options.session, suggestions))
	}

	logSilly(`Tag Page ${myPage.page}`)
	options.session.dialogData.currentViewIndex = myPage.page
	return msg
}
