app.factory('replyFactory', function($http) {

    return {
        sendEmail: function(email) {
            console.log('replyfactory', email)
            return $http.post('/api/emails/sendemail/'+email.googleThreadId, {
                email: email
            });
        }
    };

});