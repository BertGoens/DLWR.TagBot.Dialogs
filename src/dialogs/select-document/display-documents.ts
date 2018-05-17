import * as builder from 'botbuilder'
import { IResponse } from '../../stores'
import { IDisplayChoice, MakeDocumentMessage } from './util/make-message'

export interface ISelectDocumentArgs {
	reponse: IResponse
}

export const BeginAction = (session: builder.Session, args: ISelectDocumentArgs, next) => {
	session.dialogData.documents = args.reponse
	const dcOptions: IDisplayChoice = {
		session: session,
		response: args.reponse,
	}
	const msgSelectDocument = MakeDocumentMessage(dcOptions)

	session.send(msgSelectDocument)
}
