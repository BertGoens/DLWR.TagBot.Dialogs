import { Session } from 'botbuilder'
import { logSilly } from '../../../util'

export enum SelectDocumentConst {
	response,
	currentViewIndex,
	selectedDocument,
}

export interface ISetSelectDocumentDialogData {
	key: SelectDocumentConst
	value: any
	session: Session
}

export interface IGetSelectDocumentDialogData {
	key: SelectDocumentConst
	session: Session
}

const keyCheck = (options) => {
	if (!SelectDocumentConst[options.key]) {
		logSilly(`${options.key} not found in SelectDocumentConst`)
	}
}

export const SetSelectDocumentDialogData = (options: ISetSelectDocumentDialogData) => {
	keyCheck(options)
	options.session.dialogData[options.key] = options.value
}

export const GetSelectDocumentDialogData = (options: IGetSelectDocumentDialogData) => {
	keyCheck(options)
	return options.session.dialogData[options.key]
}
