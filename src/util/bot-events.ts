import * as builder from 'botbuilder'
import * as datefns from 'date-fns'
import { logError, logSilly } from '.'
import { ISettings, SettingsStore } from '../stores'

const greetingMessage = (address, name) => {
	const reply = new builder.Message()
		.address(address)
		.text('Hello %s. Thanks for adding me.', name || 'there')
	return reply
}

export const botSubscribeEvents = (bot: builder.UniversalBot) => {
	// The bot was added to or removed from a user's contact list.
	// Passed an IContactRelationUpdate object.
	bot.on('contactRelationUpdate', function(message) {
		if (message.action === 'add') {
			const name = message.user && message.user.name
			bot.send(greetingMessage(message.address, name))
		}
	})

	bot.on('conversationUpdate', function(message) {
		if (message.membersAdded) {
			message.membersAdded.forEach(function(identity) {
				if (identity.id === message.address.bot.id) {
					// Bot is joining conversation
					// - For WebChat channel you'll get this on page load.
				} else {
					// User is joining conversation
					// - For WebChat channel this will be sent when user sends first message.
					// - When a user joins a conversation the address.user field is often for
					//   essentially a system account so to ensure we're targeting the right
					//   user we can tweek the address object to reference the joining user.
					// - If we wanted to send a private message to the joining user we could
					//   delete the address.conversation field from the cloned address.
					const address = Object.create(message.address)

					const settings: ISettings = {
						userId: address.user.id,
						botId: address.bot.id,
						messageId: address.id,
						channelId: address.channelId,
						conversationId: address.conversation && address.conversation.id,
						serviceUrl: address.serviceUrl,
						lastMessageSent: datefns.addDays(Date.now(), 0),
						botMutedUntill: null,
					}

					updateUser(settings)
						.then(() => {
							bot.send(greetingMessage(address, address.user.name))
						})
						.catch((err) => {
							logError(`Error occured on conversationUpdate: ${err && err.message}`)
						})
				}
			})
		}
	})

	const updateUser = async (settings: ISettings) => {
		logSilly(`User joined conversation: ${settings.userId} trough ${settings.channelId}`)

		try {
			let dbSettings = await SettingsStore.GetSettingsById(settings.userId)
			dbSettings.lastMessageSent = datefns.addDays(Date.now(), 0)
			const result = await SettingsStore.SaveSettingsById(dbSettings)
			return
		} catch (error) {
			logSilly(`User ${settings.userId} not found, creating now.`)
			logError(error.message)
		}

		// user doesn't exist, try to create
		try {
			const reply = await SettingsStore.CreateSettings(settings)
		} catch (error) {
			logSilly(`User ${settings.userId} coudn't be created.`)
			logError(error.message)
		}
	}
}
