var requestPromise = require('request-promise');
var base64 = require('js-base64').Base64;
var mongoose = require('mongoose');
var TeamModel = mongoose.model('Team');
var EmailModel = mongoose.model('Email');
var ThreadModel = mongoose.model('Thread');
var Promise = require('bluebird');
var _ = require('lodash');

function Utils() {};

function messageFilter(message, prop) {
    return message.filter(function(obj) {
        console.log('messageFilter object:', obj)
        return obj['name'].toLowerCase() === prop.toLowerCase();
    })
}

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

Utils.prototype.getOneMessage = function(team, messageId){
    var settings = threadRequestManager(team);
    var urlTail = '/messages/' + messageId;
    var fullUrl = settings.urlHead + urlTail;
    return requestPromise.get(fullUrl, settings.options)
}

Utils.prototype.syncInbox = function(team) {
    // console.log('using utils.js on this team', team)
    var settings = threadRequestManager(team),
        urlTail = `/history?startHistoryId=${team.historyId}`,
        // startHistoryId = team.historyId, //newest message's history id?
        fullUrl = settings.urlHead + urlTail
        console.log(fullUrl, 'options', settings.options)
    return requestPromise.get(fullUrl, settings.options)
}

Utils.prototype.createLatestMessage = function(messageHeaders, email){
    //returns a LatestMessage object to save in the Threads model
    var sender = messageFilter(messageHeaders, 'From');
    sender = sender[0] ? sender[0].value : 'No Sender';

    var subject = messageFilter(messageHeaders, 'Subject');
    subject = subject[0] ? subject[0].value : 'No Subject';

    return {
        date:email.internalDate,
        from: sender,
        subject: subject,
        snippet: email.snippet
    }
}

Utils.prototype.saveSync = function(googleObj, team){
    var self = this;
    return new Promise(function(resolve, resject){
        if (googleObj.history) {
            var historyMessages = googleObj.history;
            var updatedThreads = {};
            //Iterate through each 'change' in googleObj history
            historyMessages.forEach(function(historyObj){
                //Iterate through messages array of each 'change'
                historyObj.messages.forEach(function(message){
                    var histMsgArr = updatedThreads[message.threadId]; //array of 'changed' messages in each thread 
                    updatedThreads[message.threadId] = updatedThreads[message.threadId] || [];
                    if (updatedThreads[message.threadId].indexOf(message.id) === -1){
                        updatedThreads[message.threadId].push(message.id)
                    }
                })
            })
            var updatedMessagesArrays = _.values(updatedThreads);
            console.log('updatedThreads', updatedThreads)
            console.log('updatedMessagesArrays', updatedMessagesArrays)
            var promisesforUpdatingMessages = updatedMessagesArrays.map(function(messageArray){
                return self.getUpdatedMessagesAndSave(team, messageArray);
            })
            Promise.all(promisesforUpdatingMessages)
            .then(function(result){
                console.log('done syncing!')
                resolve();
            })
        } else {
            console.log('naaa');
            resolve();
        };
    })
}
//message in this case is array of message objects containing an id and threadid
Utils.prototype.getUpdatedMessagesAndSave = function(team, messageArray){
    var self = this;
    return new Promise(function(resolve, reject){
        messageArray.forEach(function(messageId){
                EmailModel.findOne({'googleObj.id':messageId}).exec()
                .then(function(message){
                    if (!message){
                        var createdEmail;
                        var gmailObject;
                        self.getOneMessage(team, messageId)
                        .then(function(gmailMessage){
                            gmailObject = gmailMessage;
                            gmailObject = JSON.parse(gmailObject);
                            var newEmail = new EmailModel({
                                googleObj: gmailObject
                            })
                            return newEmail.save()
                        })
                        .then(function(newEmail){
                            createdEmail = newEmail;
                            return ThreadModel.findOne({googleThreadId:gmailObject.threadId}).exec()
                        })
                        .then(function(thread){
                            var latestMessage = self.createLatestMessage(createdEmail.googleObj.payload.headers, createdEmail.googleObj)
                            if (thread){
                                ThreadModel.findByIdAndUpdate(thread._id, {$addToSet:{messages:createdEmail}, latestMessage:latestMessage})
                                .exec().then(function(updatedThread){
                                    console.log('updatedThread', updatedThread)
                                    resolve();
                                })
                            } else {
                                self.getOneThread(team, gmailObject.threadId)
                                .then(function(oneThread){
                                    oneThread = JSON.parse(oneThread)
                                    var newThread = new ThreadModel({
                                        associatedEmail: team.email[0].address,
                                        googleThreadId: oneThread.id,
                                        historyId: oneThread.historyId,
                                        messages: [createdEmail],
                                        latestMessage: latestMessage
                                    })
                                    return newThread.save()
                                })
                                .then(function(createdThread){
                                    return TeamModel.findOneAndUpdate({_id:team.id}, {$push:{threads:createdThread}})
                                })
                                .then(function(Team){
                                    console.log('didnt find thread with id ', gmailObject.threadId)
                                    resolve();
                                })
                            }
                        })
                        console.log('didn\'t find', messageId)
                    } else {
                        resolve();
                    }
                })
            })
    })
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
            console.log('part',part.body.data)
            return part
        })
    } else if (message.googleObj.payload.body){
        message.googleObj.payload.body.data = base64.decode(message.googleObj.payload.body.data).replace("==", "").replace("==", "")
        console.log('message.googleObj.payload.body.data', message.googleObj.payload.body.data)
    } else {
         //not decoding b/c partId is empty.
         console.log('partId', message.googleObj.payload.partId)
    }
    return message;
}


Utils.prototype.getThreadContentsAndAddToTeam = function(team, thread) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.getOneThread(team, thread.id)
            .then(function(thread) {
                thread = JSON.parse(thread);
                var headers = thread.messages[thread.messages.length - 1].payload.headers
                var latestMessage = self.createLatestMessage(headers, thread.messages[thread.messages.length - 1])

                var newThread = new ThreadModel({
                    associatedEmail: team.email[team.email.length - 1].address,
                    googleThreadId: thread.id,
                    historyId: thread.historyId,
                    latestMessage: latestMessage
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