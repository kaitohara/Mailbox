app.directive('navbar', function($rootScope, AuthService, AUTH_EVENTS, $state, Socket, $location) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/navbar/navbar.html',
        // controller: 'sidebarCtrl',
        link: function(scope) {

            scope.items = [{
                label: 'Posta',
                state: 'home'
            }
            // , {
            //     label: 'Add Team',
            //     state: 'membersOnly',
            //     auth: true
            // }
            ];

            scope.user = null;

            scope.isLoggedIn = function() {
                return AuthService.isAuthenticated();
            };

            // 12) upon logout, the frontend emits a signal
            // telling the backend that the user logged
            // out. [go to /server/io/index.js line 26]
            scope.logout = function() {
                AuthService.logout().then(function() {
                    Socket.emit('logout', $rootScope.user._id)
                        // $state.go('home');

                    // redirect user to splash page
                    // comment this out if you want to
                    // see the user's icon turn red
                    $location.url('/')
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