import * as builder from 'botbuilder'
import { IDocument, IField, IResponse } from '../../stores'

interface IOptions {
	fields: IField[]
	session: builder.Session
}
const makeFieldMessage = (options: IOptions) => {
	const fieldButtons = options.fields.map((field) => {
		const button = builder.CardAction.imBack(options.session, `Add "${field.Title}"`, field.Title)
		return button
	})

	const card = new builder.ThumbnailCard(options.session)
		.title('What field do you want to add?')
		.buttons(fieldButtons)

	const msg = new builder.Message(options.session).addAttachment(card)
	return msg
}

export const SendSelectFieldMsg = async (session: builder.Session, args, next) => {
	// get parameters
	const document: IDocument = args.document
	const documentFieldIds = document.MissingProperties.map((missingField) => {
		return missingField.Id
	})
	const response: IResponse = args.response
	const fields = response.Fields.map((field) => {
		if (documentFieldIds.includes(field.Id)) {
			return field
		}
	})

	const msg = makeFieldMessage({ fields: fields, session: session })

	session.send(msg)
}
