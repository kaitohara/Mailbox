app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state, Socket) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/navbar/navbar.html',
        // controller: 'sidebarCtrl',
        link: function(scope) {

            scope.items = [{
                label: 'Home',
                state: 'home'
            }, {
                label: 'Add Team',
                state: 'membersOnly',
                auth: true
            }];

            scope.user = null;

            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            scope.logout = function() {
                var userToLogOut = $rootScope.user.firstName;
                AuthService.logout().then(function() {
                    Socket.emit('logout', `${userToLogOut} is offline`)
                    $state.go('home');
                });
            };

            var setUser = function() {
                AuthService.getLoggedInUser().then(function(user) {
                    scope.user = user;
                    $rootScope.user = user;
                });
            };

            var removeUser = function() {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});