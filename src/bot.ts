import * as builder from 'botbuilder'
import { promisify } from 'util'
import { LibraryId, applyDialogs } from './dialogs'
import { DefaultDialogId } from './dialogs/default'
import { botSubscribeEvents } from './util'

// Create chat connector for communicating with the Bot Framework Service
export const myBotConnector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD,
})

export const myBot = new builder.UniversalBot(myBotConnector, DefaultDialogId, LibraryId)
myBot.set('storage', new builder.MemoryBotStorage())

// Main dialog with LUIS
const defaultRecognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL)

applyDialogs({ bot: myBot, recognizer: defaultRecognizer })
botSubscribeEvents(myBot)

export interface IMsgAddress extends builder.IAddress {
	serviceUrl: string
}

export interface ISendProactiveMessageOptions {
	address: IMsgAddress
	message: string
}

export interface IStartProactiveDialogOptions {
	address: builder.IAddress
	libararyId: string
	dialogId: string
}

const sendMessageAsync = promisify(myBot.send)

/**
 * Send a message proactively
 */
export async function sendProactiveMessage(
	options: ISendProactiveMessageOptions
): Promise<builder.IAddress[]> {
	var msg = new builder.Message().address(options.address)
	msg.text(options.message)

	return await sendMessageAsync(msg)
}

/**
 * Initiate a dialog proactively
 */
export function startProactiveDialog(options: IStartProactiveDialogOptions) {
	myBot.beginDialog(options.address, `${options.libararyId}:${options.dialogId}`)
}
