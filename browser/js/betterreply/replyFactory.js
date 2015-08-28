app.factory('replyFactory', function($http) {

    return {
        sendEmail: function(emailObj) {
            console.log('replyfactory', emailObj)
            console.log('email obj length', emailObj.length)
            var threadId = emailObj[0]
            console.log('threadId within reply factory:', threadId)
            var theEmail = emailObj[1]
            console.log('the email inside of the replyfactory', theEmail)
            return $http.post('/api/emails/sendemail/'+threadId, theEmail);
        }
    };

});