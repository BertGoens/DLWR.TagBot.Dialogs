import { AxiosResponse } from 'axios'
import * as builder from 'botbuilder'
import * as datefns from 'date-fns'
import { LibraryId } from '..'
import { GetDocuments, IQueryOptions, IResponse, ISettings, SettingsStore } from '../../stores'
import { logError } from '../../util'
import { resolveDocumentAuthor, resolveDocumentFileType } from '../../util/entity-resolver'
import { ISelectDocumentArgs } from '../select-document/display-documents'
import { SelectDocumentDialogId } from '../select-document/index'

export const SharePointSearchLuisName = 'SharePoint.Search'
export const SharePointSearchDialog: builder.IDialogWaterfallStep[] = [
	async function sharepointDocumentLookup(session, args, next) {
		const message = new builder.Message().text('... Looking for untagged documents ... ')
		session.send(message)

		session.sendTyping()

		const documentFilter: IQueryOptions = {
			title: resolveDocumentAuthor(
				builder.EntityRecognizer.findAllEntities(args.entities, 'document_title')
			),
			author: resolveDocumentAuthor(
				// TODO Change this to User
				builder.EntityRecognizer.findAllEntities(args.entities, 'document_author')
			),
			filetype: resolveDocumentFileType(
				builder.EntityRecognizer.findAllEntities(args.entities, 'document_filetypes')
			),
		}

		let response: AxiosResponse<IResponse> = null
		try {
			response = await GetDocuments(documentFilter)
		} catch (error) {
			logError(error.message)
			session.send('Something went wrong when querying documents, please try again later.')
			return session.endDialog()
		}

		// end conversation when nothing untagged
		if ((!response && !response.data) || response.data.Documents.length === 0) {
			session.send(
				new builder.Message().text(
					'No untagged documents found. ' +
						"I'll contact you the next workday if there is anything to be tagged."
				)
			)
			return session.endDialog()
		}

		session.send(
			response.data.Documents.length +
				' documents found with missing requirements, ' +
				'which document would you like to tag?'
		)

		const passArgs: ISelectDocumentArgs = {
			reponse: response.data,
		}
		session.beginDialog(`${LibraryId}:${SelectDocumentDialogId}`, passArgs)
	},
	async function(session, results) {
		const userId = session.message.user.id
		const channel = session.message.source
		try {
			const userResponse = await SettingsStore.GetSettingsById(userId)
			const newSettings: ISettings = {
				botMutedUntill: datefns.addDays(new Date(), 1),
				channelId: channel,
				userId: userId,
			}

			if (
				(userResponse &&
					userResponse.data &&
					userResponse.data.botMutedUntill &&
					userResponse.data.botMutedUntill < newSettings.botMutedUntill) ||
				(userResponse && userResponse.data.botMutedUntill == null) ||
				(userResponse && userResponse.data.botMutedUntill == undefined)
			) {
				const saveResponse = SettingsStore.SaveSettingsById(newSettings)
				session.send("I'll send you again another day if you have documents missing tags.")
			}
		} catch (error) {
			logError(error.message)
		}
	},
]
