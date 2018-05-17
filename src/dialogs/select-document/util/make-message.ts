import * as builder from 'botbuilder'
import { IDocument, IResponse } from '../../../stores'
import { logSilly } from '../../../util'
import { Pager } from '../../../util/pager'

export interface IDisplayChoice {
	session: builder.Session
	response: IResponse
	currentViewIndex?: number
	requestedViewIndex?: number
}

export const MakeDocumentMessage = (options: IDisplayChoice) => {
	// display 5 choices
	const documents: IDocument[] = options.response.Documents
	const pagerSize = 3 // ZERO BASED

	const myPage = Pager().TakePage({
		documents: options.response.Documents,
		pageSize: pagerSize,
		requestedPage: options.requestedViewIndex,
	})

	const thumbnailCards = myPage.documents.map((myDocument: IDocument) => {
		const fileLink = builder.CardAction.openUrl(options.session, myDocument.Path, 'Open file')
		const selectFile = builder.CardAction.imBack(
			options.session,
			`Select document ${documents.indexOf(myDocument)}`,
			'Select'
		)

		const missingProperties = myDocument.MissingProperties.map((prop) => {
			return prop.Title
		}).join(', ')

		return new builder.ThumbnailCard(options.session)
			.title(myDocument.Title)
			.buttons([fileLink, selectFile])
			.subtitle(`Author: ${myDocument.Author}`)
			.text(`Missing: ${missingProperties.toString()}`)
	})

	const msg = new builder.Message(options.session).attachments(thumbnailCards)

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

	logSilly(`Page ${myPage.page}`)
	options.session.dialogData.currentViewIndex = myPage.page
	return msg
}
