import * as builder from 'botbuilder'
import { IDocument } from '../../stores'
import { logSilly } from '../../util'
import { Pager } from '../../util/pager'

export interface IDisplayChoice {
	session: builder.Session
	documents: IDocument[]
	currentViewIndex?: number
	requestedViewIndex?: number
}

export const DispayDocumentsMsg = (options: IDisplayChoice) => {
	// display 5 choices
	const documents: IDocument[] = options.documents
	const pagerSize = 4 // ZERO BASED

	const myPage = Pager().TakePage({
		documents: options.documents,
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

		return new builder.ThumbnailCard(options.session)
			.title(myDocument.Title)
			.buttons([fileLink, selectFile])
			.subtitle(`Author: ${myDocument.Author}`)
			.text(`Missing: ${myDocument.MissingProperties}`)
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
	options.session.userData.currentViewIndex = myPage.page
	return msg
}

export const BeginAction = (session: builder.Session, args, next) => {
	const dcOptions: IDisplayChoice = {
		session: session,
		documents: session.userData.documents,
	}
	const msgSelectDocument = DispayDocumentsMsg(dcOptions)

	// builder.Prompts.text(session, msgSelectDocument)
	session.send(msgSelectDocument)
}
