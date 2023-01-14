(function () {
    'use strict';

    angular
        .module('app.tasks.todo', [])
        .config(config);

    /** @ngInject */
    function config(commonApiProvider, $stateProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.to-do', {
            url: '/listitem/:type',
            views: {
                'content@app': {
                    templateUrl: 'app/main/tasks/todo/todo.html',
                    controller: 'TodoController as vm'
                }
            },
            resolve: {
                Categories: function (commonApi, $stateParams) {
                    if ($stateParams.type === 'event' ||
                        $stateParams.type === 'meeting' ||
                        $stateParams.type === 'issue' ||
                        $stateParams.type === 'troubleshooting') {
                        return { data: [] };
                    }

                    return commonApi.getListItems($stateParams.type, 'category');
                },
                Tags: function (commonApi, $stateParams) {
                    return commonApi.getListItems($stateParams.type, 'tag');
                },
                Status: function (commonApi, $stateParams) {
                    if ($stateParams.type === 'event' ||
                        $stateParams.type === 'meeting' ||
                        $stateParams.type === 'troubleshooting') {
                        return { data: [] };
                    }
                    return commonApi.getListItems($stateParams.type, 'status');
                }
            },
            bodyClass: 'todo'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('tasks.todo', {
            title: 'Tasks',
            state: 'app.to-do',
            stateParams: {
                type: 'task'
            },
            icon: 'icon-calendar-check',
            weight: 1
        });
    }

})();