// This loads the environment variables from the .env file
require("dotenv-safe").config({
  allowEmptyValues: true
});

// command line arguments (overrule .env file)
const argv = require("minimist")(process.argv.slice(2));

import { logInfo, logSilly, botSubscribeEvents } from "./util";
import { format } from "date-fns";
logSilly("Starting Server", format(Date.now(), "YYYY/MM/DD-HH:mm:ss"));

import { join } from "path";
import * as builder from "botbuilder";
import * as restify from "restify";
import * as dialogs from "./dialogs";
import * as fs from "fs";

// log important stuff
logInfo("Node version: " + process.version);
logInfo("NODE_ENV=" + process.env.NODE_ENV);

// Setup Restify Server
var server = restify.createServer();
const port = argv.port || process.env.port || process.env.PORT || 3950;
const addr = argv.addr || process.env.addr || process.env.ADDR || "127.0.0.1";

// Controllers
const apiMessageController = "/api/messages";

server.listen(port, addr, function() {
  logInfo("%s listening to %s", server.name, server.url);
  logInfo("Messages Controller: " + server.url + apiMessageController);
});

const assetPath = join(__dirname, "..", "static");
server.get(
  "/",
  restify.plugins.serveStatic({
    directory: assetPath,
    default: "/index.html"
  })
);

server.get("/favicon.png", (req, res, next) => {
  const faviconPath = join(assetPath, "favicon.png");
  fs.readFile(faviconPath, function(err, file) {
    if (err) {
      res.send(500);
      return next();
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "image/png");
    res.write(file);
    res.end();
    return next();
  });
});

server.get("/help", (req, res, next) => {
  res.send("hello @" + addr + ":" + port);
  next();
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post(apiMessageController, connector.listen());

var bot = new builder.UniversalBot(connector);
bot.set("storage", new builder.MemoryBotStorage());

// Main dialog with LUIS
export const recognizer = new builder.LuisRecognizer(
  process.env.LUIS_MODEL_URL
);

bot.dialog(dialogs.TagDocumentName, dialogs.TagDocumentDialog);

var intents = new builder.IntentDialog({
  recognizers: [recognizer],
  intentThreshold: 0.4
})
  .matches(dialogs.GreetingLuisName, dialogs.GreetingDialog)
  .matches(dialogs.SharePointSearchLuisName, dialogs.SharePointSearchDialog)
  .matches(dialogs.ConfirmLuisName, dialogs.ConfirmDialog)
  .matches(dialogs.CancelLuisName, dialogs.CancelLuisName)
  .matches(dialogs.ShowSettingsLuisName, dialogs.ShowSettingsDialog)
  .matches(dialogs.IgnoreUserLuisName, dialogs.IgnoreUserDialog)
  .matches(dialogs.UnignoreUserLuisName, dialogs.UnignoreUserialog)
  .matches(dialogs.HelpDialogLuisName, dialogs.HelpDialog)
  .matches(dialogs.StopLuisName, dialogs.StopDialog)
  .matches(dialogs.ReminderCreateLuisName, dialogs.ReminderCreateDialog)
  .matches(dialogs.NoneLuisName, dialogs.NoneDialog)
  .onDefault(dialogs.onDefault);

bot.dialog("/", intents);

botSubscribeEvents(bot);
