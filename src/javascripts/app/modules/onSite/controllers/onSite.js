define(function(require){
  'use strict';
  var angular = require('angular');
  var controller = ['$scope', '$rootScope', '$q', 'documentFactory', '$modal', 'storage', '$stateParams', '$location', 'onSiteFactory', 'appConstant', '$filter', 'utilFactory', '$sce', '$window', 'notifications',
    function($scope, $rootScope, $q, documentFactory, $modal, storage, $stateParams, $location, onSiteFactory, appConstant, $filter, utilFactory, $sce, $window, notifications){
      $scope.app = appConstant.app;
      $scope.isLoading = false;
      $scope.viewMode = "list";
      $scope.uploadedDocumentList = [];
      $scope.uploadedDocumentArrangedList = [];
      $scope.isPreview = angular.isDefined($stateParams.docId);
      $scope.currentProject = $rootScope.currentProjectInfo;

      $scope.selectedDoc = null;

      function arrangeData(data, itemPerRow){
        var list = [];
        var row = [];
        _.forEach(data, function(dt, i){
          if(i > 0 && i % itemPerRow === 0) {
            list.push(row);
            row = [];
          }
          row.push(dt);
          if(i === data.length - 1 && row.length > 0) {
            list.push(row);
          }
        });
        return list;
      }

      //list all document
      function getUploadedDocumentList(){
        $scope.isLoading = true;
        documentFactory.getUploadedDocumentList($rootScope.currentProjectInfo.projectId).
          then(function(content){
            $scope.isLoading = false;
            $scope.uploadedDocumentList = content.data.uploadedDocumentList;
            $scope.mapData();
            $scope.uploadedDocumentArrangedList = arrangeData($scope.uploadedDocumentList, 4);

            // get current preview doc
            if($scope.isPreview) {
              var found = _.where($scope.uploadedDocumentList, {fileId: parseInt($stateParams.docId)})[0];
              if(found) {
                $scope.preview(found);
              }
            }
          }, function(error){
            $scope.isLoading = false;
          });
      }

      $scope.mapData = function(){
        $scope.uploadedDocumentList = _.map($scope.uploadedDocumentList, function(el){
          var newEl = el;
          var fileExtension = utilFactory.getFileExtension(el.name);
          var filePath = $filter('filePath')(el.name);
          el.filePath = filePath;
          el.previewPath = filePath;
          el.isImage = /(png|jpg|jpeg|tiff|gif)/.test(fileExtension);
          if(!el.isImage) {
            el.previewPath = $sce.trustAsResourceUrl('http://docs.google.com/gview?url=' + filePath + '&embedded=true');
          }
          return newEl;
        });
      };

      getUploadedDocumentList();

      //preview document
      $scope.preview = function(doc){
        console.log(doc);
        $scope.selectedDoc = doc;
        $scope.comments = [];
        $scope.isPreview = true;
        $scope.loadComment();
        $location.search('docId', doc.fileId);
      };

      // View mode
      var viewMode = storage.get('documentViewMode');
      if(!viewMode) {
        storage.set('documentViewMode', 'grid');
      }
      $scope.viewMode = viewMode || 'grid';
      $scope.changeMode = function(mode){
        $scope.viewMode = mode;
        storage.set('documentViewMode', mode);
        $scope.uploadedDocumentArrangedList = arrangeData($scope.uploadedDocumentList, 4);
      };

      // Upload doc
      var uploadModalInstance;
      $scope.upload = function(){
        // get document categories
        documentFactory.getCategories()
          .success(function(resp){
            // open modal
            uploadModalInstance = $modal.open({
              templateUrl: 'onSite/templates/upload.html',
              controller: 'UploadDocumentController',
              size: 'lg',
              resolve: {
                categories: function(){
                  return resp.categories; // resolve categories to modal
                }
              }
            });

            // modal callbacks
            uploadModalInstance.result.then(function(data){
              getUploadedDocumentList();
            }, function(){

            });
          });
      };

      // Preview
      $scope.backToList = function(){
        $location.search('docId', null);
        $scope.isPreview = false;
        $scope.selectedDoc = null;
      };

      // Comments
      $scope.comments = [];
      $scope.isLoadingComment = false;
      $scope.addCommentModel = {
        comment: ''
      };
      $scope.loadComment = function(){
        $scope.isLoadingComment = true;
        onSiteFactory.getFileComment($scope.selectedDoc.fileId)
          .success(function(resp){
            $scope.comments = resp.comments;
            // update scroll
            $scope.$broadcast('content.reload');
            $scope.isLoadingComment = false;
          })
          .error(function(err){
            console.log(err);
            $scope.isLoadingComment = false;
          });
      };
      $scope.addComment = function(model, form){
        if($scope.selectedDoc) {
          onSiteFactory.addComment($scope.selectedDoc.fileId, model.comment)
            .success(function(resp){
              $scope.comments.push({
                "comment": model.comment,
                "commentedBy": $rootScope.currentUserInfo.userId,
                "commentedDate": new Date().toISOString(),
                "commenterContact": $rootScope.currentUserInfo.contact,
                "projectFileCommentId": 0
              });
              $scope.addCommentModel.comment = '';
              form.$setPristine();
              $scope.$broadcast('autosize:update');
            })
            .error(function(err){
              console.log(err);
            });
        }
      };

      // Download
      $scope.download = function(doc){
        $window.open(doc.filePath);
      };

      /*$scope.deleteDocument = function(doc){
        onSiteFactory.deleteDocument(doc.fileId).success(
          function(resp){
            getUploadedDocumentList();
          }
        );
      };*/

      var deleteActivityModalInstance;
      $scope.deleteDocument = function(doc) {
        deleteActivityModalInstance = $modal.open({
          templateUrl: 'onSite/templates/delete.html',
          controller: 'DeleteDocumentController',
          size: 'sm',
          resolve: {
            document: function() {
              return doc;
            }
          }
        });

        deleteActivityModalInstance.result.then(
          function() {
            getUploadedDocumentList();
          });
      };

      // Events
      notifications.onCurrentProjectChange($scope, function(agrs){
        $scope.isPreview = false;
        $scope.selectedDoc = null;
        $scope.comments = [];
        $scope.uploadedDocumentList = $scope.uploadedDocumentArrangedList = [];
        getUploadedDocumentList();
      });
    }];
  return controller;
});
