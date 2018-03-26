import * as builder from "botbuilder";
import { SettingsStore, ISettings } from "../stores";
import * as datefns from "date-fns";
import { greetingMessage } from "../dialogs";

export const botSubscribeEvents = (bot: any) => {
  bot.on("contactRelationUpdate", function(message) {
    if (message.action === "add") {
      var name = message.user ? message.user.name : null;
      var reply = new builder.Message()
        .address(message.address)
        .text("Hello %s. Thanks for adding me.", name || "there");
      bot.send(reply);
    }
  });

  bot.on("conversationUpdate", function(message) {
    if (message.membersAdded) {
      message.membersAdded.forEach(function(identity) {
        if (identity.id === message.address.bot.id) {
          // Bot is joining conversation
          // - For WebChat channel you'll get this on page load.
          var reply = greetingMessage(null);
          bot.send(reply);
        } else {
          // User is joining conversation
          // - For WebChat channel this will be sent when user sends first message.
          // - When a user joins a conversation the address.user field is often for
          //   essentially a system account so to ensure we're targeting the right
          //   user we can tweek the address object to reference the joining user.
          // - If we wanted to send a private message to the joining user we could
          //   delete the address.conversation field from the cloned address.
          var address = Object.create(message.address);
          address.user = identity;
          updateUser(identity.id, message.source);
          var reply = new builder.Message()
            .address(address)
            .text("Hello %s", identity.name || "there");
          bot.send(reply);
        }
      });
    }
  });

  const updateUser = async (userId, channelId) => {
    // lookup to see if the user exists

    try {
      let settings = await SettingsStore.GetSettingsById(userId, channelId);
      settings.data.lastMessageSent = datefns.addDays(Date.now(), 0);
      const result = await SettingsStore.SaveSettingsById(
        userId,
        settings.data
      );
      return;
    } catch (error) {
      // user doesn't exist
    }

    // user doesn't exist, try to create
    try {
      let settings: ISettings = {
        botMutedUntill: null,
        channelId: channelId,
        userId: userId,
        lastMessageSent: new Date(Date.now())
      };

      await SettingsStore.CreateSettings(userId, settings);
    } catch (error) {
      // something went wrong
    }
  };
};
