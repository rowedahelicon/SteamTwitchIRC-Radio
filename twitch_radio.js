var fs = require('fs');
var Steam = require('steam');
var JSON = require('JSON');
var irc = require('twitch-irc');

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

//Log options for logging into the steam bottom

var logOnOptions = {
  account_name: steamName,
  password: steamPass,
  auth_code: steamAuthCode,
  sha_sentryfile: (fs.existsSync('sentryfile') ? fs.readFileSync('sentryfile') : undefined)
};

//Log options for logging into the Twitch chatroom

var clientOptions = {
    options: {
        debug: true,
        debugIgnore: ['ping', 'chat', 'action']
    },
	identity: {
        username: twitchName,
        password: twitchOauth
    },
    channels: [twitchChat]
}

// if we've saved a server list, use it
if (fs.existsSync('servers')) {
  Steam.servers = JSON.parse(fs.readFileSync('servers'));
}

var steamClient = new Steam.SteamClient();
var steamUser = new Steam.SteamUser(steamClient);
var steamFriends = new Steam.SteamFriends(steamClient);

steamClient.connect();
steamClient.on('connected', function() {
  steamUser.logOn(logOnOptions);
});

steamClient.on('logOnResponse', function(logonResp) {
  if (logonResp.eresult == Steam.EResult.OK) {
    console.log('Logged in!');
	steamFriends.setPersonaState(Steam.EPersonaState.Online); // to display your bot's status as "Online"
	steamFriends.setPersonaName('T.TV Bot listening on #' + twitchChat); 
	steamFriends.joinChat(groupID); // the group's SteamID as a string


  }
});

steamClient.on('servers', function(servers) {
  fs.writeFile('servers', JSON.stringify(servers));
});

steamUser.on('updateMachineAuth', function(sentry, callback) {
  fs.writeFileSync('sentry', sentry.bytes);
  callback({ sha_file: getSHA1(sentry.bytes) });
});

var client = new irc.client(clientOptions);

client.connect();

client.addListener('chat', function (channel, user, message) {
    console.log(user.username + ': ' + message);
	if(postToGroup>=1){ steamFriends.sendMessage(groupID, '(FROM TWITCH.TV) ' + user.username + ': ' + message, Steam.EChatEntryType.ChatMsg); }
	if(postToUser>=1){ steamFriends.sendMessage(steamRecord, '(FROM TWITCH.TV) ' + user.username + ': ' + message, Steam.EChatEntryType.ChatMsg); }
});

steamFriends.on('message', function(source, message, type, chatter) {
	
	if(listenToSteam>=1){
		//respond to both chat room and private messages
		console.log('Received message:' +  message);

		client.say(twitchChat, '(STEAM)' + steamFriends.personaStates[chatter || source].player_name + ':' + message);
	}
});
