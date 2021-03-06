define(function(require) {
  'use strict';
  var angular = require('angular');
  var controller = ['$scope', '$rootScope', '$timeout', 'documentFactory', '$modalInstance', 'fileFactory', 'from',
    function($scope, $rootScope, $timeout, documentFactory, $modalInstance, fileFactory, from) {
      $scope.uploadModel = {
        category: null,
        description: '',
        files: []
      };
      $scope.isUploading = false;

      $scope.$on('uploadBox.uploadCompleted', function(e, files) {
        $scope.uploadModel.files = angular.copy(files);
        $scope.isUploading = false;
      });

      $scope.$on('uploadBox.startUpload', function() {
        $scope.isUploading = true;
      });

      //$scope.categories = categories;

      $scope.removeFile = function(idx) {
        $scope.uploadModel.files.splice(idx, 1);
        $scope.$broadcast('uploadBox.DeleteFile', {idx: idx});
      };

      $scope.saveDocumentInfo = function(model) {
        if($scope.uploadModel.files.length === 0) {
          return;
        }
        fileFactory.move($scope.uploadModel.files[0].filePath, null, 'projects', $rootScope.currentProjectInfo.projectAssetFolderName, 'onsite')
          .success(function(resp) {
            model.filePath = resp.url;
            model.fileName = resp.name;
            model.fileType = resp.type;
            var data = {
              "projectId": $rootScope.currentProjectInfo.projectId,
              "name": model.filePath,
              "fileType": model.fileType,
              "createdBy": $rootScope.currentUserInfo.userId,
              "modifiedBy": $rootScope.currentUserInfo.userId,
              "categoryId": model.category.id,
              "description": model.description
            };
            documentFactory.saveUploadedDocsInfo(data)
              .success(function(resp) {
                $modalInstance.close(data);
              })
              .error(function() {
                $scope.document_frm.$setPristine();
              });
          });
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

      $scope.closeModal = function (){
        $modalInstance.close({
          from: from,
          result: $scope.uploadModel.files
        });
      };
    }];
  return controller;
});