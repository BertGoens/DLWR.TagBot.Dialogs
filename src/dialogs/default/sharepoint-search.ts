import * as builder from 'botbuilder'
import * as datefns from 'date-fns'
import { LibraryId } from '..'
import {
	GetDocuments,
	GetTaxonomyValues,
	IQueryOptions,
	ISettings,
	SettingsStore,
} from '../../stores'
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
				builder.EntityRecognizer.findAllEntities(args.entities, 'document_author')
			),
			filetype: resolveDocumentFileType(
				builder.EntityRecognizer.findAllEntities(args.entities, 'document_filetypes')
			),
		}

		// TODO Wrap this in a trycatch
		const response = await GetDocuments(documentFilter)

		const taxMap = {}
		await response.data.Fields.map(async (field) => {
			if (field.Type === 'TaxonomyField') {
				const taxId = field.TypeProperties['TermsetId']
				if (!taxMap[taxId]) {
					const values = await GetTaxonomyValues(taxId)
					taxMap[taxId] = values
				}
				field.TypeProperties['Values'] = taxMap[taxId]
			}
		})

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
			const userResponse = await SettingsStore.GetSettingsById(userId, channel)
			const newSettings: ISettings = {
				botMutedUntill: datefns.addDays(new Date(), 1),
				channelId: channel,
				userId: userId,
			}

			if (
				(userResponse &&
					userResponse.botMutedUntill &&
					userResponse.botMutedUntill < newSettings.botMutedUntill) ||
				(userResponse && userResponse.botMutedUntill == null) ||
				(userResponse && userResponse.botMutedUntill == undefined)
			) {
				const saveResponse = SettingsStore.SaveSettingsById(userId, newSettings)
				session.send("I'll send you again another day if you have documents missing tags.")
			}
		} catch (error) {
			logError(error.message)
		}
	},
]
