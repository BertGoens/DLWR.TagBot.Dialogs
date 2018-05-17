import * as builder from 'botbuilder'
import { IField } from '../../../stores'

interface IOptions {
	fields: IField[] | any
	session: builder.Session
}
export const MakeFieldMessage = (options: IOptions) => {
	options.fields.map((val, idx, arr) => {})
	const fieldButtons = options.fields.map((field) => {
		const button = builder.CardAction.imBack(
			options.session,
			`Add field "${field.Title}"`,
			field.Title
		)
		return button
	})

	const card = new builder.ThumbnailCard(options.session)
		.title('What field do you want to add?')
		.buttons(fieldButtons)

	const suggestedActions: builder.SuggestedActions = builder.SuggestedActions.create(
		options.session,
		[builder.CardAction.imBack(options.session, 'Quit', 'Quit')]
	)

	const msg = new builder.Message(options.session)
		.addAttachment(card)
		.suggestedActions(suggestedActions)
	return msg
}
