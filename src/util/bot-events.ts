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
					address.user = identity
					const name = identity.name
					logSilly(`Message Id: ${address.id}`)
					logSilly(`Bot     Id: ${address.bot.id}`)
					logSilly(`User    Id: ${address.user.id}`)
					logSilly(`Channel Id: ${address.channelId}`)
					logSilly(`Convrs. Id: ${address.conversation && address.conversation.id}`)
					logSilly(`Service Url: ${address.serviceUrl}`)

					updateUser(identity.id, message.source)
						.then(() => {
							bot.send(greetingMessage(address, name))
						})
						.catch((err) => {
							logError(`Error occured on conversationUpdate: ${err && err.message}`)
						})
				}
			})
		}
	})

	const updateUser = async (userId, channelId) => {
		logSilly(`User joined conversation: ${userId} trough ${channelId}`)

		try {
			let settings = await SettingsStore.GetSettingsById(userId, channelId)
			settings.lastMessageSent = datefns.addDays(Date.now(), 0)
			const result = await SettingsStore.SaveSettingsById(userId, settings)
			return
		} catch (error) {
			logSilly(`User ${userId} on ${channelId} not found, creating now.`)
		}

		// user doesn't exist, try to create
		try {
			let settings: ISettings = {
				botMutedUntill: null,
				channelId: channelId,
				userId: userId,
				lastMessageSent: datefns.addDays(Date.now(), 0),
			}

			const reply = await SettingsStore.CreateSettings(settings)
		} catch (error) {
			logSilly(`User ${userId} on ${channelId} coudn't be created.`)
		}
	}
}
