// This loads the environment variables from the .env file
require('dotenv-safe').config({
	allowEmptyValues: true,
})

// Set NODE_ENV to development if unset
if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development'
}

// command line arguments (overrule .env file)
const argv = require('minimist')(process.argv.slice(2))

import { format } from 'date-fns'
import { hostname, platform } from 'os'
import { join } from 'path'
import * as restify from 'restify'
import { myBotConnector } from './bot'
import { applyRoutes, logInfo, logSilly } from './util'

logSilly('Starting Server', format(Date.now(), 'YYYY/MM/DD-HH:mm:ss'))
logSilly(`Server hostname: ${hostname()}, platform: ${platform()}`)
logInfo('Node version: ' + process.version)
logInfo('NODE_ENV=' + process.env.NODE_ENV)

// Setup Restify Server
const server = restify.createServer()
server.use(restify.plugins.queryParser())

const port = argv.port || process.env.port || process.env.PORT || 3950
const addr = argv.addr || process.env.addr || process.env.ADDR || '127.0.0.1'

// Default Message Controller as stated by MSDN documentation
const apiMessageController = '/api/messages'

server.listen(port, addr, function() {
	logInfo('%s listening to %s', server.name, server.url)
	logInfo('Messages Controller: ' + server.url + apiMessageController)
})

const assetPath = join(__dirname, '..', 'static')
applyRoutes({
	server: server,
	staticAssetsPath: assetPath,
	addr: addr,
	port: port,
})

// Listen for messages from users
server.post(apiMessageController, myBotConnector.listen())

// Export it for backpack (development tool for hot module reloading)
// Note, due to module.exports = ... we cannot export anything else
module.exports = server
