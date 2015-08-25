app.controller('fullemailCtrl', function($scope, thread, threadFactory, $location, $anchorScroll, $rootScope, $state, $firebaseArray, $document ) {

	$scope.thread;
	$scope.assignedTo = thread.assignedTo ? thread.assignedTo.firstName : 'Assign';
	$scope.assignedBy = thread.assignedBy ? thread.assignedBy.firstName : null;

	$scope.gotoBottom = function() {
		$scope.thread = thread;
		// $location.hash('bottom');
		// $anchorScroll();
		setTimeout(function(){
    		$location.hash('bottom');
      		$anchorScroll();
  		} , 10);
    };
    $scope.gotoBottom()

  //   $scope.gotoBottomForChat = function(){
		// setTimeout(function(){
		// 	var duration = 200;
		// 	var offset = 30; //pixels; adjust for floating menu, context etc
		// 	var someElement = angular.element(document.getElementById('end'));
		// 	// $document.scrollToElement(someElement, offset, duration);
		// 	$document.scrollToElementAnimated(someElement).then(function(){
		// 		console.log('supposed to have scrolled', someElement )
		// 	})
		// }, 1500);
  //   };

  //   $scope.gotoBottomForChat = function() {
		// $scope.thread = thread;
		// setTimeout(function(){
  //   		$location.hash('bottom');
  //   		//$location.hash('end'); //either one works
  //     		$anchorScroll();
  // 		} , 1000);
  //   };

  	// var someElement = angular.element(document.getElementById('end'));
   //  $document.scrollToElementAnimated(someElement);

	$scope.extractField = function(messageObj, fieldName) {
		return messageObj.googleObj.payload.headers.filter(function(header) {
			return header.name === fieldName;
		})[0];
	};

	$scope.parseBody = function(body) {
		var regex = /On [A-z]{3}, [A-z]{3} [0-9]{1,2}, [0-9]{4} at [0-9]{1,2}:[0-9]{1,2} [A,P]M, /;
		if (body) return (body.split(regex))[0];
		return body;
	};

	$scope.assign = function(userChoice, thread, user) {
		// $scope.assignedUser = userChoice.firstName;
		threadFactory.assignUserToThread(userChoice._id, thread._id, user._id)
		.then(function(thread){
			$scope.assignedTo = thread.data.assignedTo.firstName;
			console.log('assigned to and rootscope user', $scope.thread, $rootScope.user)
			if ($scope.thread.assignedTo && ($scope.thread.assignedTo._id === $rootScope.user._id)) {
				$state.go('home.userId', 
					{userId: $rootScope.user._id}, 
					{reload:true});
			}
		});
	};

	$scope.showReply = function(index){
		console.log(index)
		var length = $scope.thread.messages.length 
		$scope.thread.messages[index].showReply = !$scope.thread.messages[index].showReply
	};

	$scope.oneAtATime = false;

	$scope.status = {
    	isFirstOpen: true,
    	isFirstDisabled: false
	};

	var ref = new Firebase('https://amber-fire-4541.firebaseio.com');
	var threadRef = ref.child('thread-'+$scope.thread._id)
	$scope.chatMessages = $firebaseArray(threadRef);
    $scope.sendMessage = function(chatMessage){
    	chatMessage.name = $scope.user.firstName;
    	console.log(chatMessage)
        $scope.chatMessages.$add(chatMessage);
        $scope.gotoBottom()
    };
})


// app.directive('slideable', function () {
//     return {
//         restrict:'C',
//         compile: function (element, attr) {
//             // wrap tag
//             var contents = element.html();
//             element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

//             return function postLink(scope, element, attrs) {
//                 // default properties
//                 attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
//                 attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
//                 element.css({
//                     'overflow': 'hidden',
//                     'height': '0px',
//                     'transitionProperty': 'height',
//                     'transitionDuration': attrs.duration,
//                     'transitionTimingFunction': attrs.easing
//                 });
//             };
//         }
//     };
// })
// app.directive('slideToggle', function() {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             var target, content;
            
//             attrs.expanded = false;
            
//             element.bind('click', function() {
//                 if (!target) target = document.querySelector(attrs.slideToggle);
//                 if (!content) content = target.querySelector('.slideable_content');
                
//                 if(!attrs.expanded) {
//                     content.style.border = '1px solid rgba(0,0,0,0)';
//                     var y = content.clientHeight;
//                     content.style.border = 0;
//                     target.style.height = y + 'px';
//                 } else {
//                     target.style.height = '0px';
//                 }
//                 attrs.expanded = !attrs.expanded;
//             });
//         }
//     }
// });
















