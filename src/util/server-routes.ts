import * as fs from 'fs'
import { join } from 'path'
import * as restify from 'restify'
import { logSilly } from '.'
import {
	ISendProactiveMessageOptions,
	IStartProactiveDialogOptions,
	sendProactiveMessage,
	startProactiveDialog,
} from '../bot'

export interface RouteOptions {
	server: restify.Server
	staticAssetsPath: string
	addr: string
	port: string
}

export const applyRoutes = (options: RouteOptions) => {
	options.server.get(
		'/',
		restify.plugins.serveStatic({
			directory: options.staticAssetsPath,
			default: '/index.html',
		})
	)

	options.server.get('/favicon.png', (req, res, next) => {
		const faviconPath = join(options.staticAssetsPath, 'favicon.png')
		fs.readFile(faviconPath, function(err, file) {
			if (err) {
				res.send(500)
				return next()
			}

			res.statusCode = 200
			res.setHeader('Content-Type', 'image/png')
			res.write(file)
			res.end()
			return next()
		})
	})

	options.server.get('/help', (req, res, next) => {
		res.send('hello @' + options.addr + ':' + options.port)
		next()
	})

	options.server.get('/api/dialog/_sendMessage', async function(req, res, next) {
		const botId = req.params.botId // is required??
		const userId = req.params.userId
		const channelId = req.params.channelId
		const conversationId = req.params.conversationId
		const messageText = req.params.messageText
		const serviceUrl = req.params.serviceUrl

		const options: ISendProactiveMessageOptions = {
			message: messageText,
			address: {
				bot: { id: botId }, // sender
				channelId: channelId, // service name (skype / telegram)
				conversation: { id: conversationId }, // append to conversation
				user: { id: userId }, // receiver
				serviceUrl: serviceUrl, // service url
			},
		}

		logSilly(`Sending ${userId} a message on ${channelId}`)

		try {
			const result = await sendProactiveMessage(options)
			res.send(204)
			next()
		} catch (error) {
			res.send(500)
		}
	})

	options.server.get('/api/dialog/_startDialog', function(req, res, next) {
		const botId = req.params.botId
		const userId = req.params.userId
		const channelId = req.params.channelId
		const conversationId = req.params.conversationId
		const libararyId = req.params.conversationId
		const dialogId = req.params.dialogId

		const options: IStartProactiveDialogOptions = {
			dialogId: dialogId,
			libararyId: libararyId,
			address: {
				bot: { id: botId },
				channelId: channelId,
				conversation: { id: conversationId },
				user: { id: userId },
			},
		}

		startProactiveDialog(options)

		res.send(204)
		next()
	})
}
