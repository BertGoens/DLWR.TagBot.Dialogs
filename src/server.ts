// This loads the environment variables from the .env file
require('dotenv-safe').config({
	allowEmptyValues: true,
})

// command line arguments (overrule .env file)
const argv = require('minimist')(process.argv.slice(2))

import * as builder from 'botbuilder'
import { format } from 'date-fns'
import { join } from 'path'
import { hostname, platform } from 'os'
import * as restify from 'restify'
import { applyRoutes, botSubscribeEvents, logInfo, logSilly } from './util'
import { applyDialogs, LibraryId } from './dialogs'
import { DefaultDialogId } from './dialogs/default'
logSilly('Starting Server', format(Date.now(), 'YYYY/MM/DD-HH:mm:ss'))
logSilly(`Server hostname: ${hostname()}, platform: ${platform()}`)

// log important stuff
logInfo('Node version: ' + process.version)
logInfo('NODE_ENV=' + process.env.NODE_ENV)

// Setup Restify Server
const server = restify.createServer()
const port = argv.port || process.env.port || process.env.PORT || 3950
const addr = argv.addr || process.env.addr || process.env.ADDR || '127.0.0.1'

// Controllers
const apiMessageController = '/api/messages'

server.listen(port, addr, function() {
	logInfo('%s listening to %s', server.name, server.url)
	logInfo('Messages Controller: ' + server.url + apiMessageController)
})

const assetPath = join(__dirname, '..', 'static')
applyRoutes(server, {
	assetPath: assetPath,
	addr: addr,
	port: port,
})

// Create chat connector for communicating with the Bot Framework Service
const connector = new builder.ChatConnector({
	appId: process.env.MICROSOFT_APP_ID,
	appPassword: process.env.MICROSOFT_APP_PASSWORD,
})

// Listen for messages from users
server.post(apiMessageController, connector.listen())

const bot = new builder.UniversalBot(connector, DefaultDialogId, LibraryId)
bot.set('storage', new builder.MemoryBotStorage())

// Main dialog with LUIS
const defaultRecognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL)

applyDialogs({ bot: bot, recognizer: defaultRecognizer })
botSubscribeEvents(bot)
