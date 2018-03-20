// This loads the environment variables from the .env file
require("dotenv-safe").config({
  allowEmptyValues: true
});

import { join } from "path";
import * as builder from "botbuilder";
import * as restify from "restify";

import * as dialogs from "./dialogs";

// Setup Restify Server
var server = restify.createServer();
const port = process.env.port || process.env.PORT || 3950;
const addr = process.env.addr || process.env.ADDR || "127.0.0.1";
server.listen(port, addr, function() {
  console.log("%s listening to %s", server.name, server.url);
});

const assetPath = join(__dirname, "..", "static");
server.get(
  "/",
  restify.plugins.serveStatic({
    directory: assetPath,
    default: "/index.html"
  })
);

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
server.post("/api/messages", connector.listen());

var bot = new builder.UniversalBot(connector);
bot.set("storage", new builder.MemoryBotStorage());

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);

bot.dialog("TagDocument", dialogs.LoopDialog);

var intents = new builder.IntentDialog({ recognizers: [recognizer] })
  /* , , , ,Utilities.Stop */
  .matches("Utilities.Greeting", session => {
    var message = new builder.Message().text("Hi, let's tag some documents!");
    session.send(message);
  })
  .matches(dialogs.SharePointSearchLuisName, dialogs.SharePointSearchDialog)
  .matches("Utilities.Confirm", session => {
    session.send("Ok then.");
  })
  .matches(dialogs.ShowSettingsLuisName, dialogs.ShowSettingsDialog)
  .matches(dialogs.IgnoreUserLuisName, dialogs.IgnoreUserDialog)
  .matches(dialogs.UnignoreUserLuisName, dialogs.UnignoreUserialog)
  .matches(dialogs.HelpDialogLuisName, dialogs.HelpDialog)
  .matches("Utilities.Stop", session => {
    session.endDialog();
  })
  .matches(dialogs.ReminderCreateLuisName, dialogs.ReminderCreateDialog)
  .matches(dialogs.NoneLuisName, dialogs.NoneDialog)
  .onDefault(dialogs.onDefault);

bot.dialog("/", intents);

bot.on("contactRelationUpdate", function(message) {
  if (message.action === "add") {
    var name = message.user ? message.user.name : null;
    var reply = new builder.Message()
      .address(message.address)
      .text("Hello %s. Thanks for adding me.", name || "there");
    bot.send(reply);
  }
});
