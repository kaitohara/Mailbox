var requestPromise = require('request-promise');
var base64 = require('js-base64').Base64;
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');
var EmailModel = mongoose.model('Email');
var ThreadModel = mongoose.model('Thread');

function Utils() {};

function threadRequestManager(team) {
    var requestSettings = {}
    var latestEmailIndex = team.email.length - 1;
    var aToken = team.email[latestEmailIndex].accessToken;
    requestSettings.options = {
        headers: {
            'Authorization': 'Bearer ' + aToken
        }
    }
    requestSettings.urlHead = 'https://www.googleapis.com/gmail/v1/users/' + team.email[latestEmailIndex].address.replace('@', '%40')
    return requestSettings;
}

Utils.prototype.getRecentThreads = function(team, maxResults) {
    var settings = threadRequestManager(team);
    var urlTail = '/threads?maxResults=' + maxResults
    var fullUrl = settings.urlHead + urlTail;
    return requestPromise.get(fullUrl, settings.options)
}

Utils.prototype.getOneThread = function(team, threadId) {
    var settings = threadRequestManager(team);
    var urlTail = '/threads/' + threadId;
    var fullUrl = settings.urlHead + urlTail;
    return requestPromise.get(fullUrl, settings.options)
}

Utils.prototype.syncInbox = function(team) {
    var settings = threadRequestManager(team),
        urlTail = '/history',
        startHistoryId , //newest message's history id?
        fullUrl = settings.urlHead + urlTail
    var getPageOfHistory
    return requestPromise.get(fullUrl, settings.options)

}

function tokenRequestManager(team) {
    var requestSettings = {}
        // use this to get the correct token, not necessarily most recent
    var latestEmailIndex = team.email.length - 1;
    var email = team.email[latestEmailIndex];
    var rToken = email.refreshToken;
    requestSettings.url = 'https://www.googleapis.com/oauth2/v3/token'
    requestSettings.options = {
        form: {
            grant_type: 'refresh_token',
            client_id: googleConfig.clientID,
            client_secret: googleConfig.clientSecret,
            refresh_token: rToken
        }
    }
    return requestSettings;
}

Utils.prototype.getFreshToken = function(team) {
    var settings = tokenRequestManager(team)

    return requestPromise.post(settings.url, settings.options)
        .then(function(googleResponse) {
            var parsedResult = JSON.parse(googleResponse)
            return parsedResult.access_token
        })
        .then(function(aToken) {
            team.email[latestEmailIndex].accessToken = aToken;
            return team.save()
        })
}

Utils.prototype.useNewToken = function(team, threadId) {
    return this.getFreshToken(team).then(function(newTeam) {
        return threadId ? this.getOneThread(newTeam, threadId) : this.getRecentThreads(newTeam, 10)
    })
}

Utils.prototype.decode = function(message) {
    console.log('decoding this: ', message)
    if (message.googleObj.payload.parts) {
       message.googleObj.payload.parts.forEach(function(part) {
           console.log("part", part)
           part.body.data = base64.decode(part.body.data).replace("==", "").replace("==", "")
           return part
       })
   } else {
        //not decoding b/c partId is empty.
        console.log('partId', message.googleObj.payload.partId)
   }
    return message;
}

function messageFilter(message, prop) {
    return message.filter(function(obj) {
        return obj['name'] === prop;
    })
}

Utils.prototype.getThreadContentsAndAddToTeam = function(team, thread) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.getOneThread(team, thread.id)
            .then(function(thread) {
                thread = JSON.parse(thread);
                var latestMessage = thread.messages[thread.messages.length - 1].payload.headers

                // var date = messageFilter(latestMessage, 'Date')[0].value
                var sender = messageFilter(latestMessage, 'From')
                sender = sender[0] ? sender[0].value : 'No Sender'

                var subject = messageFilter(latestMessage, 'Subject')
                subject = subject[0] ? subject[0].value : 'No Subject'

                var newThread = new ThreadModel({
                    associatedEmail: team.email[team.email.length - 1].address,
                    googleThreadId: thread.id,
                    historyId: thread.historyId,
                    latestMessage: {
                        date: thread.messages[thread.messages.length - 1].internalDate,
                        from: sender,
                        subject: subject,
                        snippet: thread.messages[thread.messages.length - 1].snippet
                    }
                })
                newThread.save()
                    .then(function(createdThread) {
                        TeamModel.findOneAndUpdate({
                                _id: team._id
                            }, {
                                $addToSet: {
                                    threads: createdThread
                                }
                            })
                            .exec()
                            .then(function() {
                                thread.messages.forEach(function(message) {
                                        var newEmail = new EmailModel({
                                            googleObj: message
                                        })
                                        newEmail.save()
                                            .then(function(newEmail) {
                                                //store email refs in Thread messages array
                                                ThreadModel.findOneAndUpdate({
                                                    googleThreadId: thread.id
                                                }, {
                                                    $push: {
                                                        messages: newEmail
                                                    }
                                                }).exec().then(function() {
                                                    resolve();
                                                });
                                            })
                                    }) // END OF forEach message
                            })
                    })
            })
    });
};

module.exports = new Utils();