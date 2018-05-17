import { WaterfallDialog } from 'botbuilder'
import { FieldTextSteps } from './steps'

export const FieldTextDialogId = '/add-text-field'

export const FieldTextDialog = new WaterfallDialog(FieldTextSteps)
