/**
 * Created by thophan on 8/12/2015.
 */
define(function() {
  'use strict';
  var controller = ['$scope', '$rootScope', '$modalInstance', 'project', 'companies', 'countryFactory', 'projectFactory', 'userContext', 'projectContext', 'uploadFactory', 'appConstant', 'toaster', '$timeout',
    function($scope, $rootScope, $modalInstance, project, companies, countryFactory, projectFactory, userContext, projectContext, uploadFactory, appConstant, toaster, $timeout) {

      $scope.startDate = {
        options: {
          formatYear: 'yyyy',
          startingDay: 1
        },
        isOpen: false,
        open: function($event) {
          this.isOpen = true;
        }
      };

      $scope.endDate = {
        options: {
          formatYear: 'yyyy',
          startingDay: 1
        },
        isOpen: false,
        open: function($event) {
          this.isOpen = true;
        }
      };

      console.log(project);

      $scope.projectModel = {
        projectId: project.projectId,
        projectParentId: project.projectParentId,
        projectTypeId: project.projectTypeId,
        projectAddress: {
          address1: project.projectAddress.address1,
          address2: project.projectAddress.address2,
          city: project.projectAddress.city,
          state: project.projectAddress.state,
          country: project.projectAddress.country,
          zip: project.projectAddress.zip,
          addressId: project.projectAddress.addressId
        },
        companyId: project.companyId,
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        status: project.status,
        startDate: project.startDate,
        endDate: project.endDate,
        unitOfMeasurement: project.projectConfiguration[0].configValue,
        projectImagePath: project.projectImagePath
      };

      $scope.model = {
        project: $scope.projectModel,
        userId: userContext.authentication().userData.userId,
        accountStatus: userContext.authentication().userData.accountStatus
      };

      $scope.countries = countryFactory.getCountryList();
      $scope.projectStatuses = projectFactory.getProjectStatuses();
      $scope.projectTypes = projectFactory.getProjectTypes();
      $scope.unitOfMeasurements = projectFactory.getProjectUnitOfMeasurements();
      $scope.companies = companies;
      $scope.forms = {};
      $scope.editProject = true;
      $scope.addProject = false;
      $scope.onSubmit = false;


      $scope.getStateList = function() {
        var fileName = getCountryFileName($scope.projectModel.projectAddress.country);
        if(fileName !== undefined) {
          countryFactory.getStateList(fileName).then(
            function(resp) {
              $scope.states = resp.data;
            }, function(err) {
              $scope.states = {};
            }
          );
        } else {
          $scope.states = {};
        }
      };

      var getCountryFileName = function(countryCode) {
        var fileName = _($scope.countries)
          .filter(function(country) {
            return country.code === countryCode;
          })
          .pluck('filename')
          .value();

        return fileName[0];
      };

      $scope.getStateList();

      $scope.save = function() {
        $scope.onSubmit = true;
        projectFactory.addProject($scope.model).then(
          function(resp) {
            toaster.pop('success', 'Success', resp.data.returnMessage);
            $scope.project_form.$setPristine();
            $modalInstance.close({});
          }, function(err) {
            $scope.onSubmit = false;
            console.log(err);
          }
        );
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.picture = {
        file: null,
        percentage: 0,
        isUploadPicture: false
      };
      $scope.$watch('picture.file', function() {
        if($scope.picture.file) {
          if(appConstant.app.allowedImageExtension.test($scope.picture.file.type)) {
            $scope.upload([$scope.picture.file]);
          }
          else {
            toaster.pop('error', 'Error', 'Only accept jpg, png file');
          }
        }
      });

      function upload(file) {
        $scope.picture.isUploadPicture = true;
        uploadFactory.upload(file, 'project').progress(function(evt) {
          var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
          $scope.picture.percentage = progressPercentage;
        }).success(function(data, status, headers, config) {
          $timeout(function() {
            $scope.projectModel.projectImagePath = 'assets/project/' + data.imageName;
            $scope.picture.isUploadPicture = false;
          });
        })
          .error(function() {
            $scope.picture.isUploadPicture = false;
          });
      }

      $scope.upload = function(files) {
        if(files && files.length) {
          for(var i = 0; i < files.length; i++) {
            upload(files[i]);
          }
        }
      };
    }];
  return controller;
});