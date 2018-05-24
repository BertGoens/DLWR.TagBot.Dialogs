import * as builder from 'botbuilder'
import { debuglog } from 'util'
import { ISettings, SettingsStore } from '../../stores'
import { logDebug } from '../../util'

export const ShowSettingsDialog: builder.IDialogWaterfallStep[] = [
	async function settingsLookup(session, args, next) {
		const userId = session.message.user.id
		const channelId = session.message.source

		let userSettings: ISettings = {}

		// retrieve the settings by id
		let createSettings = false
		try {
			const response = await SettingsStore.GetSettingsById(userId)
			userSettings = response.data
		} catch (error) {
			createSettings = true
		}

		if (createSettings) {
			debuglog('Create settings')
			try {
				const response = await SettingsStore.CreateSettings({
					userId: userId,
					channelId: channelId,
				})
				userSettings = response.data
			} catch (error) {
				logDebug('CreateSettings catch')
			}
		}

		let reply = new builder.Message()

		if (userSettings) {
			let text =
				'Your saved settings are:  \n' +
				'User: {0}  \nChannel: {1}  \nBot Muted Until: {2}  \nLast Message Sent: {3}'
			text = text.replace('{0}', userSettings.userId || 'Unknown')
			text = text.replace('{1}', userSettings.channelId || 'Unknown')
			text = text.replace(
				'{2}',
				(userSettings.botMutedUntill && userSettings.botMutedUntill.toString()) || 'Unknown'
			)
			text = text.replace(
				'{3}',
				(userSettings.lastMessageSent && userSettings.lastMessageSent.toString()) || 'Unknown'
			)

			reply.text(text)
		} else {
			reply.text('Something went wrong, please try again later.')
		}
		session.send(reply)
	},
]
