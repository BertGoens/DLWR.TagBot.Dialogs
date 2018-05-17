import * as builder from 'botbuilder'
import { LibraryId } from '..'
import { GetDocuments, GetTaxonomyValues, IQueryOptions } from '../../stores'
import { resolveDocumentAuthor, resolveDocumentFileType } from '../../util/entity-resolver'
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

		session.userData.documents = response.data

		session.send(
			response.data.Documents.length +
				' documents found with missing requirements, ' +
				'which document would you like to tag?'
		)

		session.beginDialog(`${LibraryId}:${SelectDocumentDialogId}`)
	},
	function(session, results) {
		if (results && results.response) {
			// Delete this document from memory
		}
		session.send('Done for today?')
	},
]
