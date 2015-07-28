# SteamTwitchIRC-Radio
This is a radio type script that can sandwich a Twitch IRC room with a Steam group and or user chat, making it easier to read two sources of chatrooms.

# Installation

This script uses Node.JS to function, and relies on the following independencies
https://www.npmjs.com/package/twitch-irc
https://www.npmjs.com/package/steam
https://www.npmjs.com/package/JSON

```unix
npm-install steam
npm-install JSON
npm-install twitch-irc
```

The twitch_radio.js script is all you need to run, it does not need to be installed on its own.

**This supports Node.JS V.0.12**

# Usage

```unix
node twitch_radio.js
```

All of the variables to edit are located at the top of the script, all of them are required except for steamAuthCode, which is only required if the bot you're using has SteamGaurd enabled, **Note that a new account will have trade access removed for a week, but only on the machine you run the script on.**

**To find your steam group's 64 bit ID, paste the group's name in this link**

http://steamcommunity.com/groups/GROUPNAME/memberslistxml/?xml=1

**For your oAUTH password for Twitch, you must visit http://twitchapps.com/tmi/**


```javascript
var groupID = ''; //64 Bit ID of the steam chat you want the bot to sit in
var steamName = ''; //Steam bot username
var steamPass = ''; //Steam bot password
var steamRecord = '7'; //Steam user who will receive bot messages]
var steamAuthCode = ''; //Optional, does this bot need an Authcode to operate, E.G. is Steamguard enabled?

var twitchChat = ''; //Room of the Twitch account you're using
var twitchName = ''; //Username of the Twitch account you're using
var twitchOauth = 'oauth:'; //OAuth of the Twitch account you're using (http://twitchapps.com/tmi/)

var postToGroup = 1; //Post incoming Twitch chat posts to the 'groupID' Id?
var postToUser = 1; //Post incoming Twitch chat posts to the 'Steam Record' Id?
var listenToSteam = 1; //Enables the twitch chat to receive messages from the steam bot
```


