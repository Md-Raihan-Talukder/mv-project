(function () {
    'use strict';

    angular
        .module('app.video', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider) {
        $stateProvider
            .state('app.video', {
                abstract: true,
                url: '/video'
            })
            .state('app.video.video', {
                url: '/video',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/video/video/video.html',
                        controller: 'videoVideoCtrl as vm'
                    }
                }
            })
        //CODE_GENERATOR_MARKER_STATE
        msNavigationServiceProvider.saveItem('video', {
            title: 'Video',
            icon: 'icon-desktop-mac',
            weight: -1
        });
        msNavigationServiceProvider.saveItem('video.video', {
            title: 'Video',
            state: 'app.video.video',
            icon: 'icon-cog-box',
            weight: 1
        });
        //CODE_GENERATOR_MARKER_SAVE_ITEM
    }

})();
