(function () {
    'use strict';

    angular
        .module('app.common')
        .provider('commonApi', commonApiProvider);

    /** @ngInject **/
    function commonApiProvider() {


        function getMethodName(listType) {
            switch (listType) {
                case 'category':
                    return 'category.json';
                case 'tag':
                    return 'tags.json';
                case 'status':
                    return 'status.json';
                default:
                    break;
            }
        }

        function getServiceName(paramType) {
            switch (paramType) {
                case 'task':
                    return 'todo';
                case 'event':
                    return 'event';
                case 'meeting':
                    return 'meeting';
                case 'issue':
                    return 'issue';
                case 'risk':
                    return 'risk';
                case 'troubleshooting':
                    return 'troubleshooting';


                default:
                    break;
            }
        }

        var localItems = {};
        var jsonRead = {};
        var serialNo = {};

        function LocallyPreservedItem(serviceKey, serviceUrl) {

            var item = null;

            if (!serviceUrl) {
                item = localItems[serviceKey];
                if (!item) {
                    localItems[serviceKey] = {
                        data: {
                            data: []
                        }
                    };
                }

                return localItems[serviceKey];
            }


            if (!localItems[serviceKey]) {
                localItems[serviceKey] = {};
            }
            if (!localItems[serviceKey][serviceUrl]) {
                localItems[serviceKey][serviceUrl] = {};
            }

            item = localItems[serviceKey][serviceUrl];

            if (!item) {
                localItems[serviceKey][serviceUrl] = {
                    data: {
                        data: []
                    }
                };
            }
            return localItems[serviceKey][serviceUrl];
        }

        this.$get = function ($http, serverUrl, $q, utilService, CONSTANT_APP_MODE, CONSTANT_SERVICE_INFO, PRIMARY_COLUMN_NAME) {
            // Data

            // Methods
            var service = {
                getListItems: function (paramType, listType) {
                    return $http.get(serverUrl + getServiceName(paramType) + "/" + getMethodName(listType));
                },
                getSingleItem: getSingleItem,
                getListItem: getListItem,
                saveItem: saveItem,
                saveItems: saveItems,
                deleteItem: deleteItem,
                isExist: isExist,
                preserveLocally: preserveLocally,
                filterByParams: filterByParams,
                getServiceUrl: getServiceUrl,
                updateItem: updateItem,
                getSerialNo: getSerialNo,
                getIdFromServer: getIdFromServer,
                getItemsByKeys: getItemsByKeys
            };


            function preserveLocally(serviceKey, item, serviceUrl) {
                var loclaItem = LocallyPreservedItem(serviceKey, serviceUrl);
                var index = utilService.getIndex(loclaItem.data.data, PRIMARY_COLUMN_NAME, item[PRIMARY_COLUMN_NAME]);
                if (angular.isArray(loclaItem.data.data)) {
                    if (index >= 0) {
                        loclaItem.data.data[index] = item;
                    } else {
                        loclaItem.data.data.unshift(item);
                    }
                }

            }

            function getIdFromServer(serviceKey) {
                if (CONSTANT_APP_MODE === "1") {
                    var data = {
                        id: utilService.generateId(),
                        slNo: getSerialNo(serviceKey),
                        uniqueInfo: {}
                    }
                    var response = { data: { data: data } };
                    response.data.fromq = true;
                    return $q.resolve(response);
                }

                return $http.get(getServiceUrl('ID-GENERATOR'));
            }

            function getSerialNo(serviceKey) {
                var slNo = serialNo[serviceKey];
                if (slNo) {
                    slNo += 1;
                } else {
                    slNo = 1;
                }

                serialNo[serviceKey] = slNo;

                return slNo;
            }

            function isExist(serviceKey, property, propertyValue, id) {
                var loclaItem = LocallyPreservedItem(serviceKey);
                return utilService.isExist(loclaItem.data.data, property, propertyValue, id);
            }

            function getServiceUrl(serviceKey, id, params, serviceUrl) {
                var url = '';
                if (!serviceUrl) {
                    url = serverUrl + CONSTANT_SERVICE_INFO[serviceKey].clientUrl;
                }
                else {
                    url = serverUrl + CONSTANT_SERVICE_INFO[serviceKey][serviceUrl];
                }
                return makeUrl(url, id, params);
            }


            function makeUrl(url, id, params) {
                return url;
            }

            function saveItems(serviceKey, items) {
                if (CONSTANT_APP_MODE === "1") {
                    var response = { data: { data: items } };
                    return $q.resolve(response);
                }

                return addItem(serviceKey, items);
            }

            function addItems(serviceKey, items) {
                return $http({
                    url: getServiceUrl(serviceKey),
                    method: "POST",
                    data: items
                });
            }

            function saveItem(serviceKey, id, item, serviceUrl) {
                if (CONSTANT_APP_MODE === "1") {
                    var response = { data: { data: item } };
                    return $q.resolve(response);
                }

                if (id) {
                    return updateItem(serviceKey, id, item);
                }

                return addItem(serviceKey, item);
            }

            function updateItem(serviceKey, id, item, serviceUrl) {
                return $http({
                    url: getServiceUrl(serviceKey, id, serviceUrl),
                    method: "PUT",
                    data: item
                });
            }

            function addItem(serviceKey, item, serviceUrl) {
                return $http({
                    url: getServiceUrl(serviceKey),
                    method: "POST",
                    data: item
                });
            }

            function deleteItem(serviceKey, id) {
                return $http.delete(getServiceUrl(serviceKey, id));
            }

            function getSingleItem(serviceKey, id, itemKey) {
                if (CONSTANT_APP_MODE === "1") {
                    var loclaItem = LocallyPreservedItem(serviceKey);
                    loclaItem = angular.copy(loclaItem);
                    var item;
                    var key = itemKey ? itemKey : PRIMARY_COLUMN_NAME;
                    var index = utilService.getIndex(loclaItem.data.data, key, id);

                    if (index >= 0) {
                        item = angular.copy(loclaItem.data.data[index]);
                    } else {
                        return $q.reject('Item not found with id:' + id);
                    }

                    var response = { data: { data: item } };
                    response.data.fromq = true;
                    return $q.resolve(response);
                }

                return $http.get(getServiceUrl(serviceKey, id));
            }

            function getItemsByKeys(serviceKey, itemKey, itemkeys) {
                if (CONSTANT_APP_MODE === "1") {
                    var loclaItem = LocallyPreservedItem(serviceKey);
                    loclaItem = angular.copy(loclaItem);
                    var items = [];
                    for (var i = 0; i < itemkeys.length; i++) {
                        var index = utilService.getIndex(loclaItem.data.data, itemKey, itemkeys[i]);
                        if (index >= 0) {
                            items.push(angular.copy(loclaItem.data.data[index]))
                        }
                    }

                    if (!items.length) {
                        return $q.reject('No item found with keys');
                    }

                    var response = { data: { data: items } };
                    response.data.fromq = true;
                    return $q.resolve(response);
                }

                return $http.get(getServiceUrl(serviceKey, id));
            }

            function filterByParam(data, param) {
                var dts = $.grep(data, function (datum) {
                    return datum[param.key] === param.value;
                });
                return dts;
            }

            function filterByParams(data, params) {
                if (params && params.length) {
                    for (var i = 0; i < params.length; i++) {
                        data = filterByParam(data, params[i]);
                    }
                }
                return data;
            }


            function getListItem(serviceKey, params, serviceUrl) {

                var rdKey = null;

                if (!serviceUrl) {
                    rdKey = jsonRead[serviceKey];
                }
                else {
                    if (jsonRead[serviceKey] == undefined) {
                        jsonRead[serviceKey] = {};
                    }
                    rdKey = jsonRead[serviceKey][serviceUrl];
                }

                if (CONSTANT_APP_MODE === "1" && rdKey) {
                    var response = LocallyPreservedItem(serviceKey, serviceUrl);
                    if (response) {
                        response = angular.copy(response);
                        if (response.data) {
                            response.data.fromq = true;
                            response.data.data = filterByParams(response.data.data, params);
                            response.data.data = utilService.sortItems(response.data.data);
                            return $q.resolve(response);
                        }
                    }
                }

                if (!serviceUrl) {
                    jsonRead[serviceKey] = true;
                }
                else {
                    jsonRead[serviceKey][serviceUrl] = true;
                }

                return $http.get(getServiceUrl(serviceKey, undefined, params, serviceUrl));
            }

            return service;
        }


    }


})();