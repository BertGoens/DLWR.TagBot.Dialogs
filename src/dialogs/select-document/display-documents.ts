import * as builder from 'botbuilder'
import { IResponse } from '../../stores'
import { SelectDocumentConst, SetSelectDocumentDialogData } from './util/dialog-data'
import { IDisplayChoice, MakeDocumentMessage } from './util/make-message'

export interface ISelectDocumentArgs {
	reponse: IResponse
}

export const BeginAction = (session: builder.Session, args: ISelectDocumentArgs, next) => {
	const response = args.reponse

	SetSelectDocumentDialogData({
		key: SelectDocumentConst.response,
		value: response,
		session: session,
	})

	const dcOptions: IDisplayChoice = {
		session: session,
		response: response,
	}
	const msgSelectDocument = MakeDocumentMessage(dcOptions)

	session.send(msgSelectDocument)
}
