(function () {
    'use strict';

    angular
        .module('app.dashboards.project', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider) {
        // State
        $stateProvider.state('app.dashboards_project', {
            url: '/home',
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/dashboards/project/dashboard-project.html',
                    controller: 'DashboardProjectController as vm'
                }
            },
            resolve: {
                DashboardData: function (msApi) {
                    return msApi.resolve('dashboard.project@get');
                }
            },
            bodyClass: 'dashboard-project'
        });

        // Api
        msApiProvider.register('dashboard.project', ['app/data/dashboard/project/data.json']);
    }

})();