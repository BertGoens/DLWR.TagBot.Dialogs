import * as builder from 'botbuilder'
import { IDocument } from '../../../stores/sharepoint-store'
import { DispayTagsMsg, IDisplayChoice } from './util/build-tags-msg'

export const SelectTagRegex: builder.IDialogWaterfallStep[] = [
	function validateSelection(session, results, next) {
		const quotedTextRegex = /(["'])(?:(?=(\\?))\2.)*?\1/
		const selectedTagResult = results.matched.input.match(quotedTextRegex)[0]
		const selectedTag = selectedTagResult.replace(/"/g, '')

		const document: IDocument = session.dialogData.document

		if (!document.Tags) {
			document.Tags = []
		}

		if (!document.Tags.includes(selectedTag)) {
			document.Tags.push(selectedTag)
			const removeIndex = document.AvailableTags.indexOf(selectedTag)
			document.AvailableTags.splice(removeIndex, 1)
		}

		session.dialogData.document = document

		const options: IDisplayChoice = {
			session: session,
			currentViewIndex: session.dialogData.currentViewIndex,
			requestedViewIndex: session.dialogData.currentViewIndex,
			document: session.dialogData.document,
			generatedTags: session.dialogData.generatedTags,
		}
		const msgSelectDocument = DispayTagsMsg(options)

		session.send(msgSelectDocument)
	},
]
