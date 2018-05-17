import * as builder from 'botbuilder'
import { IDocument, IResponse } from '../../stores'
import { MakeFieldMessage } from './util/make-message'

export interface ISelectFieldDialogArgs {
	selectedDocument: IDocument
	response: IResponse
}

export const SendSelectFieldMsg = async (
	session: builder.Session,
	args: ISelectFieldDialogArgs,
	next
) => {
	// get parameters
	const document: IDocument = args.selectedDocument
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
