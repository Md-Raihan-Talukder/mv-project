(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('JobSourcingPolicyController', JobSourcingPolicyController);


    /** @ngInject */
    function JobSourcingPolicyController(JOB_SOURCING_GROUPS, JOB_SOURCING_ITEMS,
        msbCommonApiService, msbUtilService) {

        var vm = this;
        vm.jobSrcGrps = JOB_SOURCING_GROUPS;
        vm.jobSrcItems = JOB_SOURCING_ITEMS;
        vm.addNewJobCat = addNewJobCat;
        vm.editCat = editCat;
        vm.removeCat = removeCat;

        init();

        function init() {
            getAssociateData();
        }

        function editCat(cat, catDef) {
            addNewJobCat(cat, 0, catDef)
        }

        function removeCat(item) {
            if (!item) {
                return;
            }
            msbUtilService.confirmAndDelete(null, [{ item: item.title }], function () {
                msbUtilService.removeItems(vm.catDef, item.catDefId);
                makeDataForView();
            });
        }

        function addNewJobCat(cat, isNew, catDef) {
            console.log(cat, isNew, catDef);
            var catPar = [{ "key": "cat", "value": cat }];
            if (isNew == 0) {
                // making catDef && opDef to update
                var onUpCat = msbUtilService.getObjectByParams(vm.catDef, 'TECHDISER_ID', catDef.catDefId);
                catPar.push({ "key": "catDef", "value": onUpCat });

                var onUpOps = [];
                onUpCat.opIds.forEach(function (item) {
                    if (item) {
                        var opObj = msbUtilService.getObjectByParams(vm.opDef, 'TECHDISER_ID', item);
                        if (opObj) {
                            onUpOps.push(opObj);
                        }
                    }
                });
                catPar.push({ "key": "opDef", "value": onUpOps })
                //-----------------------------------------------
            }
            console.log(catPar);
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    if (isNew == 1) {
                        // validate if exist
                        vm.catDef.push(data.catDef);
                        vm.opDef = vm.opDef.concat(data.opDef);
                        // if (!checkIfExist(data.catDef)) {
                        // }
                        // else {
                        //   msbUtilService.showToast("This job group is already exists", "warning", 3000);
                        // }
                    }
                    else if (isNew == 0) {
                        // validate if exist
                        // checkIfExist(data.catDef);
                        updateData(data);
                    }
                    makeDataForView();
                }
            }, "jobSourcingService", "addNewJobCat", catPar);
        }

        function checkIfExist(catDef) {
            for (var i = 0; i < vm.catDef.length; i++) {
                if (vm.catDef[i]) {
                    var isExst = _.isEqual(vm.catDef[i].opIds, catDef.opIds);
                    if (isExst) {
                        return true;
                    }
                }
            }
            return false;
        }

        function updateData(data) {
            if (data) {
                var index = msbUtilService.getIndex(vm.catDef, 'TECHDISER_ID', data.catDef.TECHDISER_ID);
                if (index > -1) {
                    vm.catDef[index] = data.catDef;
                }
                data.opDef.forEach(function (item) {
                    if (item) {
                        var opObjInd = msbUtilService.getIndex(vm.opDef, 'TECHDISER_ID', item.TECHDISER_ID);
                        if (opObjInd == -1) {
                            vm.opDef.push(item);
                        }
                        else {
                            if (item.jobIds.length > 0) {
                                var testTwoArrEql = _.isEqual(item.jobIds, vm.opDef[opObjInd].jobIds);
                                if (!testTwoArrEql) {
                                    var newId = msbUtilService.generateId();
                                    var cdefId = vm.catDef[index].opIds.indexOf(item.TECHDISER_ID);
                                    if (cdefId > -1) {
                                        vm.catDef[index].opIds[cdefId] = newId;
                                    }
                                    else {
                                        vm.catDef[index].opIds.push(newId);
                                    }
                                    item.TECHDISER_ID = newId;
                                    vm.opDef.push(item);

                                }
                            }
                        }
                    }
                });
            }
        }

        function getAssociateData() {
            var catParam = [{ "key": "orgId", "value": msbUtilService.getOrganizationId() }];
            msbCommonApiService.interfaceManager(function (cats) {
                if (cats) {
                    vm.catalogs = cats;
                    msbCommonApiService.interfaceManager(function (cdef) {
                        if (cdef) {
                            vm.catDef = cdef;
                            msbCommonApiService.interfaceManager(function (opDef) {
                                if (opDef) {
                                    vm.opDef = opDef;
                                    makeDataForView();
                                }
                            }, "jobSourcingService", "getOpDef", []);
                        }
                    }, "jobSourcingService", "getCatDef", []);
                }
            }, "organizationsDataService", "getOrgProductCatalogs", catParam);
        }

        function makeDataForView() {
            var jobCatPar = [
                { "key": "catDef", "value": vm.catDef }, { "key": "opDef", "value": vm.opDef },
                { "key": "jobSrcGrps", "value": vm.jobSrcGrps }, { "key": "jobSrcItems", "value": vm.jobSrcItems },
                { "key": "catalogs", "value": vm.catalogs }
            ]
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.jobCats = data;
                }
            }, "jobSourcingService", "makeJobCatView", jobCatPar);
        }

        vm.save = function () {
            console.log(vm.catDef);
            console.log(vm.opDef);
        }

    }
})();
