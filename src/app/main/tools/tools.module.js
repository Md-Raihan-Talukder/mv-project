(function () {
    'use strict';

    angular
        .module('app.tools', ['app.tools.tna', 'app.tools.techpack', 'app.tools.calculator'])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {

        msNavigationServiceProvider.saveItem('tools', {
            title: 'Tools',
            icon: 'icon-android-studio',
            class: 'mobile-only',
            weight: 2
        });


    }
})();