(function () {
    'use strict';
    angular
        .module('app.video')
        .controller('videoVideoCtrl', videoVideoCtrl);

    /** @ngInject */
    function videoVideoCtrl() {
        debugger
        var TECHDISER_COMPONENT_NAME = "videoVideoCtrl";
        var TECHDISER_SERVICE_INFO = {};
        var vm = this;
        vm.loadViewContent = true;

        vm.play = false;

        vm.openVideo = openVideo;
        vm.fullScreen = fullScreen;

        init();

        function init() {
            // var v = document.getElementById('movie');
            // v.pause();
        }

        function openVideo() {
            var v = document.getElementById('movie');
            if (v.paused) {
                v.play();
            } else {
                v.pause();
            }

            return false;
            // if (vm.play == false) {
            //     vm.play = true;
            // } else {
            //     vm.play = false;
            // }
        }

        function fullScreen() {
            var v = document.getElementById('movie');

            v.webkitEnterFullscreen();
        }
    }
})();
