var requestPromise = require('request-promise');
var base64 = require('js-base64').Base64;

var replyManager = {}

replyManager.encodeEmail = function(email){
    console.log('encode email internal email: ', email)
    var unencodedString= ""+
        "Content-Type: text/plain; charset=\"UTF-8\"\n" +
        "MIME-Version: 1.0\n" +
        "Content-Transfer-Encoding: 7bit\n" +
        "to: " + email.to+"\n" +
        "from: " + email.from+"\n" +
        "Reply-To: " + email.from+"\n" +
        "subject: " + email.subject + "\n\n" +
        email.body
    console.log(' unencodedString ', unencodedString)
    return base64.encode(unencodedString).replace(/\+/g, '-').replace(/\//g, '_')
}

replyManager.sendEmail = function(team, encodedEmail) {
    var latestEmailIndex = team.email.length - 1;
    var emailUrl = team.email[latestEmailIndex].address.replace('@', '%40')
    // update this to get correct token, not necessarily most recent
    var aToken = team.email[latestEmailIndex].accessToken;
    var headers = {
        'Authorization': 'Bearer ' + aToken,
        'Content-Type': 'application/json'
    }
    var options = {
        method: "POST",
        // contentType: "message/rfc822",
        // callbackURL: 'http://localhost:1337/callback',
        headers: headers,
        body: JSON.stringify({"raw": encodedEmail})
    };
    var urlHead = 'https://www.googleapis.com/gmail/v1/users/'
    var urlTail = '/messages/send'
    var fullUrl = urlHead + emailUrl + urlTail
    console.log(' fullurl ', fullUrl)
    options.url = fullUrl
    return requestPromise(fullUrl, options)
}

module.exports = replyManager