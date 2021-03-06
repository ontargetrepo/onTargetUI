define(function (require){
  'use strict';
  var angular = require('angular'),
    utilService = require('app/common/services/util'),
    module,
    fileupload = require('ngFileUpload');

  module = angular.module('common.services.file', ['app.config', 'ngFileUpload', 'common.services.util']);

  module.factory('fileFactory',
    ['Upload', 'appConstant', 'utilFactory', '$http',
      function (Upload, constant, utilFactory, $http){
        var service = {};

        service.upload = function (file, newFileName, rootFolder, projectAssetFolderName, context, crop){
          newFileName = newFileName || file.name;
          return Upload.upload({
            url: constant.nodeServer + '/node/upload',
            file: file,
            fields: {
              'uuid': utilFactory.newGuid(),
              'fileName': newFileName,
              'folder': rootFolder,
              'projectAssetFolderName': projectAssetFolderName,
              'context': context || '',
              'crop': crop || false
            },
            headers: {
              'Authorization': false
            }
          });
        };
        service.convertPDFToImage = function (filePath, docId){
          return $http.post(constant.nodeServer + '/node/file/convertPdfToImage', {
            path: filePath,
            docId: docId
          });
        };
        service.move = function (filePath, newFileName, rootFolder, projectAssetFolderName, context){
          newFileName = newFileName || filePath.substring(filePath.lastIndexOf('/') + 1);
          return $http.post(constant.nodeServer + '/node/move', {
            'path': filePath,
            'uuid': utilFactory.newGuid(),
            'fileName': newFileName,
            'folder': rootFolder,
            'projectAssetFolderName': projectAssetFolderName,
            context: context || ''
          }, {
            headers: {
              'Authorization': false
            }
          });
        };

        service.info = function (path){
          return $http.post(constant.nodeServer + '/node/file/info', {path: path});
        };

        service.getPdfImage = function (path){
          return $http.post(constant.nodeServer + '/node/file/getPdfImage', {path: path});
        };

        return service;
      }
    ]
  );
});
