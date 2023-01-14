(function () {
    'use strict';

    angular
        .module('app.feedback', [
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider) {

        msNavigationServiceProvider.saveItem('feedback', {
            title: 'Buyers Feedback',
            icon: 'icon-thumb-up',
            weight: 10
        });

    }
})();