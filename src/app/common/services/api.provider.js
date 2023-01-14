(function () {
    'use strict';

    angular
        .module('app.common')
        .provider('msbCommonApi', msbCommonApiProvider);

    /** @ngInject **/
    function msbCommonApiProvider() {
        var localItems = {};
        var jsonRead = {};
        var serialNo = {};

        function LocallyPreservedItem(key) {

            var item = localItems[key];

            if (!item) {
                localItems[key] = {
                    data: {
                        data: []
                    }
                };
            }

            return localItems[key];

        }

        this.$get = function ($http, SERVER_URL, $q, msbUtilService, CONSTANT_APP_MODE, CONSTANT_SERVICE_INFO, PRIMARY_COLUMN_NAME) {
            var service = {
                getSingleItem: getSingleItem,
                getListItem: getListItem,
                saveItem: saveItem,
                saveItems: saveItems,
                deleteItem: deleteItem,
                isExist: isExist,
                preserveLocally: preserveLocally,
                // filterByParams: filterByParams ,
                getServiceUrl: getServiceUrl,
                updateItem: updateItem,
                getSerialNo: getSerialNo,
                getIdFromServer: getIdFromServer,
                getItemsByKeys: getItemsByKeys,
                updateJsonReadKey: updateJsonReadKey,
                saveInnerItem: saveInnerItem,
                isJsonLoaded: isJsonLoaded,
                deleteItemFromAnArray: deleteItemFromAnArray
            };
            function deleteItemFromAnArray(myArray, itemTechdiserId) {

                var index = myArray.map(function (myArrayItem) {
                    return myArrayItem.TECHDISER_ID;
                }).indexOf(itemTechdiserId);

                delete myArray[index];

                var filteredArray = myArray.filter(function (el) {
                    return el != null;
                });

                myArray = filteredArray;

                return myArray;
            }

            function isJsonLoaded(serviceKey, taskKey) {
                return jsonRead[getCombinedKey(serviceKey, taskKey)];
            }

            function preserveLocally(serviceKey, item, taskKey) {
                var loclaItem = LocallyPreservedItem(getCombinedKey(serviceKey, taskKey));
                var index = msbUtilService.getIndex(loclaItem.data.data, PRIMARY_COLUMN_NAME, item[PRIMARY_COLUMN_NAME]);
                if (angular.isArray(loclaItem.data.data)) {
                    if (index >= 0) {
                        loclaItem.data.data[index] = item;
                    } else {
                        loclaItem.data.data.unshift(item);
                    }
                }

            }

            function getIdFromServer(serviceKey, taskKey, rootObjectId, path) {
                if (CONSTANT_APP_MODE === "1") {
                    if (rootObjectId) {
                        path = rootObjectId + path;
                    }
                    var data = {
                        id: msbUtilService.generateId(),
                        slNo: getSerialNo(getCombinedKey(serviceKey, taskKey, path)),
                        uniqueInfo: {}
                    }
                    var response = { data: { data: data } };
                    response.data.fromq = true;
                    return $q.resolve(response);
                }

                return $http.get(getServiceUrl('ID-GENERATOR'));
            }

            function getSerialNo(key) {
                var slNo = serialNo[key];
                if (slNo) {
                    slNo += 1;
                } else {
                    slNo = 1;
                }

                serialNo[key] = slNo;

                return slNo;
            }

            function isExist(serviceKey, property, propertyValue, id) {
                var loclaItem = LocallyPreservedItem(serviceKey);
                return msbUtilService.isExist(loclaItem.data.data, property, propertyValue, id);
            }

            function getServiceUrl(serviceKey, id, params, taskKey) {
                if (!taskKey) {
                    taskKey = "clientUrl";
                }

                var url = SERVER_URL + CONSTANT_SERVICE_INFO[serviceKey][taskKey];
                return makeUrl(url, id, params);
            }

            function makeUrl(url, id, params) {
                return url;
            }

            function saveInnerItem(itemId, newObj, serviceKey, taskKey, path, paramObj, isArray, toRemove,
                containerLinkPath, containerLinkData
            ) {
                if (CONSTANT_APP_MODE === "1") {
                    var loclaItem = LocallyPreservedItem(getCombinedKey(serviceKey, taskKey));
                    var index = msbUtilService.getIndex(loclaItem.data.data, PRIMARY_COLUMN_NAME, itemId);
                    // console.log(index);
                    if (index >= 0) {
                        var rootItem = loclaItem.data.data[index];
                        loclaItem.data.data[index] = angular.copy(msbUtilService.jsonManipulator(rootItem, paramObj, path, angular.copy(newObj), isArray, null, null, toRemove, false, containerLinkPath, containerLinkData));
                    } else if (containerLinkPath && containerLinkData) {
                        loclaItem.data.data.push(containerLinkData);
                        index = loclaItem.data.data.length - 1;
                        var rootItem = loclaItem.data.data[index];
                        loclaItem.data.data[index] = angular.copy(msbUtilService.jsonManipulator(rootItem, paramObj, path, angular.copy(newObj), isArray, null, null, toRemove, false, containerLinkPath, containerLinkData));
                    }
                    var response = { data: { data: angular.copy(loclaItem.data.data[index]) } };
                    return $q.resolve(response);
                }

                //  return addItems(serviceKey, items);
            }

            function saveItems(serviceKey, items, taskKey) {
                if (CONSTANT_APP_MODE === "1") {
                    // var response={data: {data: margeItems(items, serviceKey, taskKey)}};
                    var response = { data: { data: items } };
                    return $q.resolve(response);
                }

                return addItems(serviceKey, items);
            }

            function margeItems(newItems, serviceKey, taskKey) {
                var items = []
                for (var i = 0; i < newItems.length; i++) {
                    items.push(margeItem(newItems[i], serviceKey, taskKey));
                }
                return items;
            }

            function margeItem(newItem, serviceKey, taskKey) {
                var loclaItem = LocallyPreservedItem(getCombinedKey(serviceKey, taskKey));
                var index = msbUtilService.getIndex(loclaItem.data.data, PRIMARY_COLUMN_NAME, newItem[PRIMARY_COLUMN_NAME]);
                if (index >= 0) {
                    var oldItem = loclaItem.data.data[index];
                    // var item = angular.merge(oldItem, newItem);
                    var item = _.merge(oldItem, newItem);

                    return oldItem;
                }

                return newItem;
            }

            function addItems(serviceKey, items) {
                return $http({
                    url: getServiceUrl(serviceKey),
                    method: "POST",
                    data: items
                });
            }

            function saveItem(serviceKey, id, item, taskKey, doNotMerge) {
                if (CONSTANT_APP_MODE === "1") {
                    // if(!doNotMerge){
                    //    item = margeItem(item, serviceKey, taskKey);
                    // }
                    var response = { data: { data: item } };
                    return $q.resolve(response);
                }

                if (id) {
                    return updateItem(serviceKey, id, item);
                }

                return addItem(serviceKey, item);
            }

            function updateItem(serviceKey, id, item) {
                return $http({
                    url: getServiceUrl(serviceKey, id),
                    method: "PUT",
                    data: item
                });
            }

            function addItem(serviceKey, item) {
                return $http({
                    url: getServiceUrl(serviceKey),
                    method: "POST",
                    data: item
                });
            }

            function deleteItem(serviceKey, id) {
                return $http.delete(getServiceUrl(serviceKey, id));
            }

            function getSingleItem(serviceKey, id, itemKey, taskKey) {
                if (CONSTANT_APP_MODE === "1") {
                    var loclaItem = LocallyPreservedItem(getCombinedKey(serviceKey, taskKey));
                    loclaItem = angular.copy(loclaItem);
                    var item;
                    if (angular.isArray(id)) {
                        var items = msbUtilService.filterByParams(loclaItem.data.data, id);
                        if (!items || !items.length) {
                            // return $q.reject('Item not found with param:' + id);
                        } else if (items.length === 1) {
                            item = angular.copy(items[0]);
                        } else {
                            return $q.reject('Multiple items found with param:' + id);
                        }
                    } else {
                        var key = itemKey ? itemKey : PRIMARY_COLUMN_NAME;
                        var index = msbUtilService.getIndex(loclaItem.data.data, key, id);

                        if (index >= 0) {
                            item = angular.copy(loclaItem.data.data[index]);
                        } else {
                            // return $q.reject('Item not found with id:' + id);
                        }
                    }

                    var response = { data: { data: item } };
                    response.data.fromq = true;
                    return $q.resolve(response);
                }

                return $http.get(getServiceUrl(serviceKey, id));
            }

            function getItemsByKeys(serviceKey, itemKey, itemkeys, taskKey) {
                if (CONSTANT_APP_MODE === "1") {
                    var loclaItem = LocallyPreservedItem(getCombinedKey(serviceKey, taskKey));
                    loclaItem = angular.copy(loclaItem);
                    var items = [];
                    for (var i = 0; i < itemkeys.length; i++) {
                        var index = msbUtilService.getIndex(loclaItem.data.data, itemKey, itemkeys[i]);
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

                return $http.get(getServiceUrl(serviceKey, id, null, taskKey));
            }

            function updateJsonReadKey(serviceKey, taskKey) {
                jsonRead[getCombinedKey(serviceKey, taskKey)] = true;
            }

            function getCombinedKey(serviceKey, taskKey, path) {
                if (!taskKey) {
                    taskKey = "clientUrl";
                }

                return path ? serviceKey + "_" + taskKey + "_" + path : serviceKey + "_" + taskKey;
            }

            function getListItem(serviceKey, params, taskKey) {
                var combinedKey = getCombinedKey(serviceKey, taskKey);
                var rdKey = jsonRead[combinedKey];

                if (CONSTANT_APP_MODE === "1" && rdKey) {
                    var response = LocallyPreservedItem(combinedKey);
                    if (response) {
                        response = angular.copy(response);
                        if (response.data) {
                            response.data.fromq = true;
                            return $q.resolve(response);
                        }
                    }
                }

                return $http.get(getServiceUrl(serviceKey, undefined, params, taskKey));
            }

            return service;
        }


    }


})();
