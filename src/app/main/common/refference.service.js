(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('referenceGroups', referenceGroups);

    /** @ngInject */
    function referenceGroups($http, serverUrl, CONSTANT_REFERENCE_GROUPS, utilService) {
        var serviceName = 'reference/';

        var service = {
            getAllReferenceGroups: getAllReferenceGroups,
            addReferenceGroup: addReferenceGroup,
            removeReferenceGroup: removeReferenceGroup,
            populationRequired: true,
            data: {}
        };

        function getAllReferenceGroups() {
            if (!service.populationRequired) {
                return;
            }
            for (var i = 0; i < CONSTANT_REFERENCE_GROUPS.length; i++) {
                getReferenceGroup(CONSTANT_REFERENCE_GROUPS[i].id);
            }

            service.populationRequired = false;

        }

        function getReferenceGroup(group) {
            return $http.get(serverUrl + serviceName + group + '.json').success(function (response) {
                service.data[group] = response.data;
            })
                .error(function (err) {

                });
        }

        function addReferenceGroup(refferenceTo, val) {
            var item = { id: utilService.replaceSpaces(val), name: val };
            var index = getIndex(service.data[refferenceTo], item);
            if (index === -1) {
                service.data[refferenceTo].push(item);
            }
        }

        function getIndex(items, item) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].id === item.id) {
                    return i;
                }
            }

            return -1;
        }

        function removeReferenceGroup(refferenceTo, val) {
            var item = { id: utilService.replaceSpaces(val), name: val };
            var index = getIndex(service.data[refferenceTo], item);
            if (index >= 0) {
                service.data[refferenceTo].splice(index, 1);
            }
        }

        return service;
    }
})();