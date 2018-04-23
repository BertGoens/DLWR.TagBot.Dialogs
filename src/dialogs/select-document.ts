import * as builder from 'botbuilder'
import { TagDocumentName } from './tag-document'
import { SharePointStore, IDocument, IQueryOptions } from '../stores'
import {
	resolveDocumentFileType,
	resolveDocumentAuthor,
	sortIntentsByScore,
} from '../util/entity-resolver'
import {
	CancelLuisName,
	StopLuisName,
	ShowNextLuisName,
	ShowPreviousLuisName,
	ConfirmLuisName,
	intentThreshold,
	NoneLuisName,
} from '.'
import { logInfo, logSilly } from '../util'
import { Pager, IPagerOptions } from '../util/pager'

export const SelectDocumentName = '/SelectDocument'

export interface IDisplayChoice {
	session: builder.Session
	documents: IDocument[]
	currentViewIndex?: number
	requestedViewIndex?: number
}

const buildChoiceMessage = (options: IDisplayChoice) => {
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

	return { message: msg, viewIndex: myPage.page }
}

export const SelectDocumentDialog: builder.IDialogWaterfallStep[] = [
	function displayChoice(session, results, next) {
		const dcOptions: IDisplayChoice = {
			session: session,
			documents: session.userData.documents,
			currentViewIndex: session.userData.currentViewIndex,
			requestedViewIndex: results.requestedViewIndex,
		}
		const msgSelectDocument = buildChoiceMessage(dcOptions)
		logSilly(`Page ${msgSelectDocument.viewIndex}`)
		session.userData.currentViewIndex = msgSelectDocument.viewIndex
		builder.Prompts.text(session, msgSelectDocument.message)
	},
	function validateChoice(session, results, next) {
		if (results && results.response) {
			// Step 1
			// Response Matches: Select document ${number}
			const regexp = /Select document \d/gi
			if (results.response.match(regexp)) {
				const numbersOnly = /\d+/
				const selectedDocumentIndex = results.response.match(numbersOnly)
				const selectedDocument = session.userData.documents[selectedDocumentIndex[0]]
				session.userData.selectedDocument = selectedDocument
				session.beginDialog('*:' + TagDocumentName, { document: selectedDocument })
			}

			// Step 2
			// Decide on next action
			builder.LuisRecognizer.recognize(
				results.response,
				process.env.LUIS_MODEL_URL,
				(err, intents, entities) => {
					if (intents) {
						const bestIntent = sortIntentsByScore(intents)[0]
						logSilly(`Best intent: ${bestIntent.intent}, Score: ${bestIntent.score}`)

						const defaultAction = () => {
							session.send('Sorry, I did not quite catch that, please select a document.')
							session.replaceDialog(SelectDocumentName, {
								requestedViewIndex: session.userData.currentViewIndex,
							})
						}

						if (bestIntent.score < intentThreshold) {
							defaultAction()
						}

						if ([CancelLuisName, StopLuisName].includes(bestIntent.intent)) {
							session.endConversation()
						}

						if (ShowNextLuisName === bestIntent.intent) {
							const currentIndex = session.userData.currentViewIndex || 0
							const newIndex = currentIndex + 1
							session.replaceDialog(SelectDocumentName, {
								requestedViewIndex: newIndex,
							})
						}

						if (ShowPreviousLuisName === bestIntent.intent) {
							const currentIndex = session.userData.currentViewIndex || 0
							const newIndex = currentIndex - 1
							session.replaceDialog(SelectDocumentName, {
								requestedViewIndex: newIndex,
							})
						}

						const handledIntents = [
							CancelLuisName,
							StopLuisName,
							ShowNextLuisName,
							ShowPreviousLuisName,
						]
						if (!handledIntents.includes(bestIntent.intent)) {
							defaultAction()
						}
					}
				}
			)
		}
	},
]
