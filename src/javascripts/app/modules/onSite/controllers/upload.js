define(function(require) {
  'use strict';
  var angular = require('angular');
  var controller = ['$scope', '$rootScope', 'categories', '$timeout', 'documentFactory', '$modalInstance', 'fileFactory', '$filter', 'selectedCategory',
    function($scope, $rootScope, categories, $timeout, documentFactory, $modalInstance, fileFactory, $filter, selectedCategory) {
      $scope.uploadModel = {
        name: '',
        category: null,
        description: '',
        files: []
      };
      $scope.uiSelectModel = {
        selectedModel: {}
      };
      $scope.isUploading = false;
      if(!!selectedCategory && !!selectedCategory.id && !!selectedCategory.name) {
        $scope.uiSelectModel.selectedItem = selectedCategory;
      } else {
        $scope.uiSelectModel.selectedItem = {selectedItem: []};
      }

      $scope.$on('uploadBox.uploadCompleted', function(e, files) {
        $scope.uploadModel.files = angular.copy(files);
        if($scope.uploadModel.files.length > 0) {
          $scope.uploadModel.name = angular.copy($scope.uploadModel.files[0].fileName);
        }
        $scope.isUploading = false;
      });

      $scope.$on('uploadBox.startUpload', function() {
        $scope.isUploading = true;
      });

      $scope.categories = categories;

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
            var convertable = /\.(pdf|jpg|png|jpeg|gif)$/i.test(model.filePath);
            var data = {
              "projectId": $rootScope.currentProjectInfo.projectId,
              "name": model.name,
              "fileType": model.fileType,
              "createdBy": $rootScope.currentUserInfo.userId,
              "modifiedBy": $rootScope.currentUserInfo.userId,
              "categoryId": $scope.uiSelectModel.selectedItem.id,
              "description": model.description,
              "parentProjectFileId": 0,
              "projectFileId": 0,
              "isConversionComplete": !convertable, // Pdf and images are only
              "thumbnailImageName": $filter('fileThumbnail')(model.filePath),
              "filePath": model.filePath
            };

            documentFactory.saveUploadedDocsInfo(data)
              .success(function(r) {
                if(convertable) {
                  fileFactory.convertPDFToImage(resp.url, r.documentDetail.fileId)
                    .then(function() {
                      $modalInstance.close(data);
                    });
                } else {
                  $modalInstance.close(data);
                }
              })
              .error(function() {
                $scope.document_frm.$setPristine();
              });
          });
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    }];
  return controller;
});