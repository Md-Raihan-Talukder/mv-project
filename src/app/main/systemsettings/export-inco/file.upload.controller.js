(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('FileUploadController', FileUploadController);

    /** @ngInject */
    function FileUploadController(PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, $mdDialog, commonApiService, utilService) {
        var vm = this;

        init();

        function init() {
            commonApiService.getItems(vm, "EXPORT_INCO", "inCoTypes", false);
        }


        vm.setFiles = function (element) {
            vm.$apply(function (vm) {
                console.log('files:', element.files);
                // Turn the FileList object into an Array
                vm.files = []
                for (var i = 0; i < element.files.length; i++) {
                    vm.files.push(element.files[i])
                }
                vm.progressVisible = false
            });
        };

        vm.uploadFile = function () {
            var fd = new FormData()
            for (var i in vm.files) {
                fd.append("uploadedFile", vm.files[i])
            }
            var xhr = new XMLHttpRequest()
            xhr.upload.addEventListener("progress", uploadProgress, false)
            xhr.addEventListener("load", uploadComplete, false)
            xhr.addEventListener("error", uploadFailed, false)
            xhr.addEventListener("abort", uploadCanceled, false)
            xhr.open("POST", "/fileupload")
            vm.progressVisible = true
            xhr.send(fd)
        }

        function uploadProgress(evt) {
            vm.$apply(function () {
                if (evt.lengthComputable) {
                    vm.progress = Math.round(evt.loaded * 100 / evt.total)
                } else {
                    vm.progress = 'unable to compute'
                }
            })
        }

        function uploadComplete(evt) {
            /* This event is raised when the server send back a response */
            alert(evt.target.responseText)
        }

        function uploadFailed(evt) {
            alert("There was an error attempting to upload the file.")
        }

        function uploadCanceled(evt) {
            vm.$apply(function () {
                vm.progressVisible = false
            })
            alert("The upload has been canceled by the user or the browser dropped the connection.")
        }

    }
})();
