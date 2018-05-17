import * as builder from 'botbuilder'
import { IDocument, IField, IResponse } from '../../stores'

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

export const SendSelectFieldMsg = async (session: builder.Session, args, next) => {
	// get parameters
	const document: IDocument = args.document
	const documentFieldIds = document.MissingProperties.map((missingField) => {
		return missingField.Id
	})
	const response: IResponse = args.response
	const includedFields = response.Fields.filter((detailedField) => {
		if (documentFieldIds.includes(detailedField.Id)) {
			return detailedField
		}
	})

	// save dialogdata
	session.dialogData.document = document
	session.dialogData.response = response

	const msg = MakeFieldMessage({ fields: includedFields, session: session })

	session.send(msg)
}
