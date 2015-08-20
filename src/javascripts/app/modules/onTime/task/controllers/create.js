/**
 * Created by thophan on 8/17/2015.
 */
define(function (){
  'use strict';
  var controller = ['$scope', '$rootScope', 'userContext', 'projectFactory', 'taskFactory', 'toaster', 'projectContext', 'notifications', function ($scope, $rootScope, userContext, projectFactory, taskFactory, toaster, projectContext, notifications){
    $scope.task = {
      projectTaskId: null,
      title: "",
      description: "",
      status: "",
      severity: "",
      startDate: "",
      endDate: "",
      projectId: $rootScope.activitySelected.projectId,
      assignees: []
    };

    $scope.minDate2 = $rootScope.activitySelected.startDate;
    $scope.maxDate2 = $rootScope.activitySelected.endDate;
    $scope.$watchCollection('[task.startDate, task.endDate]', function(e){
      $scope.minDate = $scope.task.startDate ? $scope.task.startDate : $rootScope.activitySelected.startDate;
      $scope.maxDate = $scope.task.endDate ? $scope.task.endDate : $rootScope.activitySelected.endDate;
    });

    $scope.model = {
      userId: userContext.authentication().userData.userId,
      task: $scope.task
    };

    $scope.contacts = {};

    $scope.taskStatuses = taskFactory.getTaskStatuses();
    $scope.taskSeverities = taskFactory.getTaskSeverities();

    $scope.startDate = {
      options: {
        formatYear: 'yyyy',
        startingDay: 1
      },
      isOpen: false,
      open: function ($event){
        this.isOpen = true;
      }
    };

    $scope.endDate = {
      options: {
        formatYear: 'yyyy',
        startingDay: 1
      },
      isOpen: false,
      open: function ($event){
        this.isOpen = true;
      }
    };

    $scope.onSubmit = false;

    taskFactory.getContacts({projectId:$rootScope.currentProjectInfo.projectId}).then(
      function (resp){
        $scope.contacts = resp.data.projectMemberList;
        console.log($scope.contacts);
      }
    );

    $scope.save = function (){
      $scope.onSubmit = true;
      taskFactory.addTask($scope.model).then(
        function (resp){
          $scope.onSubmit = false;
          /*$scope.currentProject.projects.push($scope.project);
           projectContext.setProject($scope.currentProject, null);*/
          toaster.pop('success', 'Success', resp.data.returnMessage);
          $scope.task_form.$setPristine();
          //$modalInstance.close({});
          notifications.taskCreated();
        }, function (err){
          $scope.onSubmit = false;
          $scope.task_form.$setPristine();
        }
      );
    };
    $scope.cancel = function (){
      notifications.taskCancel();
    };
  }];
  return controller;
});
