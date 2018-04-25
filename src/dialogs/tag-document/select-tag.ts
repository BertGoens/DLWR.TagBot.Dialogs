import * as builder from 'botbuilder'
import { LibraryId } from '../index'
import { TagDocumentDialogId } from './index'
import { IDocument } from '../../stores'
import { IDisplayChoice, DispayTagsMsg } from './display-tags'

export const SelectTagRegex: builder.IDialogWaterfallStep[] = [
	function validateSelection(session, results, next) {
		const quotedTextRegex = /(["'])(?:(?=(\\?))\2.)*?\1/
		const selectedTagResult = results.matched.input.match(quotedTextRegex)[0]
		const selectedTag = selectedTagResult.replace(/"/g, '')

		const document: IDocument = session.dialogData.document

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
