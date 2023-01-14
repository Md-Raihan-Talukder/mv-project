(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('AttachmentsDirectiveController', AttachmentsDirectiveController);

    /** @ngInject */

    function AttachmentsDirectiveController($scope, utilService) {
        var vm = this;

        vm.ngFlowOptions = {
            // You can configure the ngFlow from here
            /*target                   : 'api/media/image',
             chunkSize                : 15 * 1024 * 1024,
             maxChunkRetries          : 1,
             simultaneousUploads      : 1,
             testChunks               : false,
             progressCallbacksInterval: 1000*/
        };
        vm.ngFlow = {
            // ng-flow will be injected into here through its directive
            flow: {}
        };

        // Methods
        vm.fileAdded = fileAdded;
        vm.upload = upload;
        vm.fileSuccess = fileSuccess;
        vm.removeFile = removeFile;


        function removeFile(file) {
            if (!$scope.self) {
                $scope.onRemoveItem({ item: comment });
            } else {
                var index = $scope.itemList.indexOf(file);
                if (index >= 0) {
                    $scope.itemList.splice(index, 1);
                    return true;
                }
            }
        }



        /**
         * File added callback
         * Triggers when files added to the uploader
         *
         * @param file
         */
        function fileAdded(file) {
            var user = utilService.getCurrentUser();
            // Prepare the temp file data for file list
            var uploadingFile = {
                id: file.uniqueIdentifier,
                file: file,
                type: '',
                owner: user,
                size: '',
                uploaded: moment().format('MMMM D, YYYY'),
                modified: '',
                opened: '',
                created: '',
                extention: '',
                location: 'My Files > Documents',
                offline: false,
                preview: 'assets/images/etc/sample-file-preview.jpg'
            };

            // Append it to the file list
            //vm.files.push(uploadingFile);

            if (!$scope.itemList) {
                $scope.itemList = [];
            }

            if (!$scope.self) {
                $scope.onAddItem({ item: uploadingFile });
            } else {
                $scope.itemList.unshift(uploadingFile);
            }

        }

        /**
         * Upload
         * Automatically triggers when files added to the uploader
         */
        function upload() {
            // Set headers
            vm.ngFlow.flow.opts.headers = {
                'X-Requested-With': 'XMLHttpRequest',
                //'X-XSRF-TOKEN'    : $cookies.get('XSRF-TOKEN')
            };

            vm.ngFlow.flow.upload();
        }

        /**
         * File upload success callback
         * Triggers when single upload completed
         *
         * @param file
         * @param message
         */
        function fileSuccess(file, message) {
            // Iterate through the file list, find the one we
            // are added as a temp and replace its data
            // Normally you would parse the message and extract
            // the uploaded file data from it
            angular.forEach($scope.itemList, function (item, index) {
                if (item.id && item.id === file.uniqueIdentifier) {
                    // Normally you would update the file from
                    // database but we are cheating here!

                    // Update the file info
                    item.name = file.file.name;
                    item.type = 'document';
                    item.modified = moment(file.file.lastModified).format('MMMM D, YYYY')

                    // Figure out & upddate the size
                    if (file.file.size < 1024) {
                        item.size = parseFloat(file.file.size).toFixed(2) + ' B';
                    }
                    else if (file.file.size >= 1024 && file.file.size < 1048576) {
                        item.size = parseFloat(file.file.size / 1024).toFixed(2) + ' Kb';
                    }
                    else if (file.file.size >= 1048576 && file.file.size < 1073741824) {
                        item.size = parseFloat(file.file.size / (1024 * 1024)).toFixed(2) + ' Mb';
                    }
                    else {
                        item.size = parseFloat(file.file.size / (1024 * 1024 * 1024)).toFixed(2) + ' Gb';
                    }
                }
            });
        }
    }

})();
