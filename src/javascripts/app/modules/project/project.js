/**
 * Created by thophan on 8/12/2015.
 */
define(function(require){
  'use strict';
  var angular = require('angular'),
    angularBootstrap = require('angularBootstrap'),
    uiRouter = require('uiRouter'),
    config = require('app/config'),
    angularMessages = require('angularMessages'),
    controller = require('./controllers/list'),
    createController = require('./controllers/create'),
    editController = require('./controllers/edit'),
    deleteController = require('./controllers/delete'),
    template = require('text!./templates/list.html'),
    createTemplate = require('text!./templates/create.html'),
    editTemplate = require('text!./templates/edit.html'),
    deleteTemplate = require('text!./templates/delete.html'),
    createOrUpdateTemplate = require('text!./templates/_createOrUpdate.html'),
    projectDescriptionWidthDirective = require('./directives/projectDescriptionWidth'),
    changeProjectImageDirective = require('app/common/directives/changeProjectImage'),
    projectServiceModule = require('app/common/services/project'),
    accountServiceModule = require('app/common/services/account'),
    companyServiceModule = require('app/common/services/company'),
    countryServiceModule = require('app/common/services/country'),
    permissionServiceModule = require('app/common/services/permission'),
    userContextModule = require('app/common/context/user'),
    uploadServiceModule = require('app/common/services/file'),
    angularSvgRoundProgress = require('angularSvgRoundProgress'),
    utilServiceModule = require('app/common/services/util'),
    angularSanitize = require('angularSanitize'),
    toaster = require('toaster'),
    angularLocalStorage = require('angularLocalStorage'),
    ngFileUpload = require('ngFileUpload'),
    userNotificationsModule = require('app/common/services/userNotifications'),
    activityServiceModule = require('app/common/services/activity');
  var module = angular.module('app.project', ['ui.router', 'ui.bootstrap', 'angularLocalStorage', 'app.config', 'common.context.user', 'common.services.account', 'common.services.project', 'common.services.company', 'ngMessages', 'ngFileUpload', 'angular-svg-round-progress', 'common.services.util', 'ngSanitize', 'common.services.country', 'common.services.userNotifications', 'common.services.activity', 'common.directives.changeProjectImage', 'common.services.permission']);

  module.run(['$templateCache', function($templateCache){
    $templateCache.put('project/templates/list.html', template);
    $templateCache.put('project/templates/_createOrUpdate.html', createOrUpdateTemplate);
    $templateCache.put('project/templates/create.html', createTemplate);
    $templateCache.put('project/templates/edit.html', editTemplate);
    $templateCache.put('project/templates/delete.html', deleteTemplate);
  }]);

  module.controller('ProjectListController', controller);
  module.controller('ProjectCreateController', createController);
  module.controller('ProjectEditController', editController);
  module.controller('ProjectDeleteController', deleteController);

  module.directive('projectDescriptionWidth', projectDescriptionWidthDirective);

  module.config(
    ['$stateProvider',
      function($stateProvider){
        $stateProvider
          .state('app.projectlist', {
            url: '/projectlist',
            templateUrl: "project/templates/list.html",
            controller: 'ProjectListController',
            authorization: true,
            fullWidth: true,
            resolve: {
              permission: ['$q', '$state', '$window', 'permissionFactory',
                function($q, $state, $window, permissionFactory){
                  var deferred = $q.defer();
                  if(permissionFactory.checkFeaturePermission('VIEW_PROJECT')) {
                    deferred.resolve();
                  } else {
                    $window.location.href = $state.href('app.editprofile');
                  }
                  return deferred.promise;
                }]
            }
          })
          .state('app.createProject', {
            url: '/create-project',
            templateUrl: 'project/templates/create.html',
            controller: 'ProjectCreateController',
            authorization: true,
            fullWidth: true,
            resolve: {
              permission: ['$q', '$state', '$window', 'permissionFactory',
                function($q, $state, $window, permissionFactory){
                  var deferred = $q.defer();
                  if(permissionFactory.checkFeaturePermission('ADD_PROJECT')) {
                    deferred.resolve();
                  } else {
                    $window.location.href = $state.href('app.projectlist');
                  }
                  return deferred.promise;
                }]
            }
          })
          .state('app.editProject', {
            url: '/edit-project',
            templateUrl: 'project/templates/edit.html',
            controller: 'ProjectEditController',
            authorization: true,
            fullWidth: true,
            resolve: {
              project: ['$q', 'projectFactory', '$rootScope', '$location', function($q, projectFactory, $rootScope, $location){
                var project = $rootScope.editProject;
                if(!project) {
                  $location.path("/app/projectlist");
                }
                delete $rootScope.editProject;
                return project;
              }],
              companies: ['$q', 'companyFactory', function($q, companyFactory){
                var deferred = $q.defer();
                companyFactory.search()
                  .success(function(resp){
                    deferred.resolve(resp.companyList);
                  });
                return deferred.promise;
              }],
              permission: ['$q', '$state', '$window', 'permissionFactory',
                function($q, $state, $window, permissionFactory){
                  var deferred = $q.defer();
                  if(permissionFactory.checkFeaturePermission('EDIT_PROJECT')) {
                    deferred.resolve();
                  } else {
                    $window.location.href = $state.href('app.projectlist');
                  }
                  return deferred.promise;
                }]
            }
          });
      }
    ]
  );

  return module;
});