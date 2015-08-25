/**
 * Created by tho on 8/23/15.
 */

define(function (require){
  'use strict';
  var angular = require('angular'),
      lodash = require('lodash');

  var controller = ['$scope', '$rootScope', 'countryFactory', 'projectFactory', 'userContext', 'projectContext', 'activityFactory', 'toaster', 'taskFactory', 'notifications',
    function ($scope, $rootScope, countryFactory, projectFactory, userContext, projectContext, activityFactory, toaster, taskFactory, notifications){

      $scope.task = {};
      $scope.model = {
        user: {
          userId: userContext.authentication().userData.userId
        },
        taskBudgetEstimates : []
      };
      $scope.getTaskBudget = function () {
        taskFactory.getTaskBudget({taskId: $rootScope.currentTask.projectTaskId}).then(function (resp) {
          $scope.task = resp.data.task;

          _.forEach($scope.task.costsByMonthYear, function(n) {
            if(n.costs.length===0){
              var y = n.taskInterval.year, m = n.taskInterval.month;
              var cost1 = {
                cost:0,
                costType:"ACTUAL",
                createdBy:$scope.task.creatorId,
                fromDate: new Date(y, m, 1) > $scope.task.startDate ? new Date(y, m, 1) : $scope.task.startDate,
                toDate: new Date(y, m + 1, 0) < $scope.task.endDate ? new Date(y, m + 1, 0) : $scope.task.endDate,
                id: 0,
                month: m,
                year: y
              };
              var cost2 = {
                cost:0,
                costType:"PLANNED",
                createdBy: cost1.createdBy,
                fromDate: cost1.fromDate,
                toDate: cost1.toDate,
                id: 0,
                month: m,
                year: y
              };
              n.costs.push(cost1);
              n.costs.push(cost2);
            }
          });
        });
      };
      $scope.getTaskBudget();



      
      $scope.addTaskBudget = function () {
        _.forEach($scope.task.costsByMonthYear, function(n) {
          _.forEach(n.costs, function(cost) {
            cost.taskId = $rootScope.currentTask.projectTaskId;

            $scope.model.taskBudgetEstimates.push(cost);
          });
        });
        taskFactory.addTaskBudget($scope.model).then(
            function (resp) {
              toaster.pop('success', 'Success', resp.data.returnMessage);
              notifications.taskUpdated();
            }
        );
      };


    }];
  return controller;
});