define(function (){
  'use strict';
  var controller = ['$scope', 'appConstant', 'accountFactory', '$state', '$location', 'notifications', '$rootScope', '$modal', 'companyFactory',
    function ($scope, appConstant, accountFactory, $state, $location, notifications, $rootScope, $modal, companyFactory){
      $scope.app = appConstant.app;

      function bindInfo(){
        $scope.userInfo = {
          firstName: $rootScope.currentUserInfo.contact.firstName,
          lastName: $rootScope.currentUserInfo.contact.lastName,
          email: $rootScope.currentUserInfo.contact.email,
          avatar: $rootScope.currentUserInfo.contact.userImagePath
        };
      }

      function bindUserNotifications() {
        $scope.allNotifications = $rootScope.userNotifications;
        $scope.newNotifications = _.where($scope.allNotifications, {"status": "NEW"});
      }

      if ($rootScope.currentUserInfo && $rootScope.currentUserInfo.contact) {
        bindInfo();
      }

      $scope.logout = function (){
        accountFactory.logout()
          .then(function (){
            notifications.logoutSuccess();
            $state.go('signin');
          });
      };

      $scope.inviteCollaborators = function() {
        companyFactory.search().success(function(resp) {
          $modal.open({
            templateUrl: 'navbar/templates/inviteCollaborators.html',
            controller: 'InviteCollaboratorsController',
            size: 'md',
            resolve: {
              companies: function() {
                return resp.companyList;
              }
            }
          });
        });
      };

      notifications.onLoginSuccess($scope, function (){
        if ($rootScope.currentUserInfo && $rootScope.currentUserInfo.contact) {
          bindInfo();
        }
      });

      notifications.onUpdateProfileSuccess($scope, function(){
        bindInfo();
      });

      notifications.onGetNotificationSuccess($scope, function() {
        bindUserNotifications();
      });
    }];
  return controller;
});