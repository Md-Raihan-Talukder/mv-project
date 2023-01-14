(function () {
    'use strict';

    angular
        .module('app.imagedata', [])
        .config(config)
        .controller('ImageDataController', ImageDataController);;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.imagedata', {
                url: '/imagedata',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/imagedata/imagedata.html',
                        controller: 'ImageDataController as vm'
                    }
                },
                bodyClass: 'printable'
            });


        msNavigationServiceProvider.saveItem('fuse.imagedata', {
            title: 'imagedata',
            icon: 'icon-tile-four',
            state: 'app.imagedata',
            weight: 2
        });
    }

    function ImageDataController($http, $scope) {
        var vm = this;

        init();

        function init() {
            getImages();
        }

        function getImages() {
            $http.get("app/data/repository/images.json").then(function (response) {

                console.log(response.data.data);
                $scope.imagedatas = response.data.data;

            }, function (response) {
                alert(response);
            });
        }

    }


})();