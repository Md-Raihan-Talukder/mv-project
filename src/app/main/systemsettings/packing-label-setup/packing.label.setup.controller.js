(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('LabelSetupController', LabelSetupController);

    function LabelSetupController(msbUtilService, msbCommonApiService, $mdDialog,
        $document, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;
        vm.selectBuyer = selectBuyer;
        // vm.addAssortLabel = addAssortLabel;
        vm.viewLabel = viewLabel;
        vm.createTemplete = createTemplete;
        vm.editLabel = editLabel;
        vm.removeBarcode = removeBarcode;
        vm.deleteLabel = deleteLabel;
        vm.getStripDef = getStripDef;
        vm.addLabel = addLabel;
        vm.save = save;
        vm.selectProduct = selectProduct;
        vm.getBarcodes = getBarcodes;
        vm.getLabel = getLabel;
        vm.addBarcode = addBarcode;

        init();

        function init() {
            // getList();s
            getBuyers();

        }

        function getList() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.labelAttributes = data;
                renderData();
            }, "packing-service", "getAttributeList", null);
        }

        function renderData() {
            //    var param = vm.label.attributes;
            var param = vm.labelAttributes;
            msbCommonApiService.interfaceManager(function (data) {
                vm.attributes = data;
                getLabelObj(data);
            }, "packing-service", "getAttributeData", param);
        }

        function getLabelObj(attributes) {
            var obj = {
                "TECHDISER_ID": msbUtilService.generateId()
            };
            for (var i = 0; i < attributes.length; i++) {
                obj[attributes[i].key] = attributes[i].value;
            }
            //    vm.labelColumns = vm.label.attributes;
            vm.labelColumns = vm.labelAttributes;
            vm.strips = [];
            vm.stripObject = obj;
            // vm.stripDef = {
            //     "parameters":[],
            //     "formTemplate": vm.label.template
            // };
        }


        function getStripDef(label) {
            return {
                "parameters": [],
                "formTemplate": label.template
            }
        }

        function save() {
            // msbUtilService.downLoadJson(vm.packingLabels);
            var param = {
                "packingLabels": vm.packingLabels
            }
            msbCommonApiService.interfaceManager(function (data) {

            }, "packingLabelService", "savePackingLabels", param);
        }

        function getBuyers() {
            var orgId = msbUtilService.getOrganizationId()
            var param = [{ "key": "orgId", "value": orgId }];
            msbCommonApiService.interfaceManager(function (data) {
                vm.buyers = data;
                console.log(data);
                getAllCatalogProducts();

            }, "organizationsDataService", "getOrgBuyers", param);
        }

        function getAllCatalogProducts() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.products = data;

                getPackingLabels();
                console.log(data);
            }, "organizationsDataService", "getAllCatalogProducts", []);
        }

        function getPackingLabels() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.packingLabels = data;
                if (vm.buyers && angular.isArray(vm.buyers) && vm.buyers.length > 0) {
                    for (var i = 0; i < vm.buyers.length; i++) {
                        if (vm.buyers[i].title) {
                            selectBuyer(vm.buyers[i]);
                            break;
                        }
                    }

                }
            }, "packingLabelService", "getPackingLabels", null);
        }

        function selectBuyer(buyer) {
            vm.selectedBuyer = buyer;
            if (vm.products) {
                for (var i = 0; i < vm.products.length; i++) {
                    if (vm.products[i].refStyle && vm.products[i].refStyle.buyerId == buyer[PRIMARY_COLUMN_NAME]) {
                        selectProduct(vm.products[i]);
                        break;
                    }
                }
            }
        }

        function selectProduct(product) {
            vm.selectedProduct = product;
        }

        function addBarcode(type) {
            $mdDialog.show({
                controller: 'AssortLabelDialogController',
                controllerAs: 'vm',
                clickOutsideToClose: false,
                preserveScope: true,
                templateUrl: 'app/main/purchaseorders/po/details/packing-label/assort-label/assort-label-dialog.html',
                locals: {
                    Type: type,
                    Barcode: [],
                    Label: null
                }
            }).then(function (answer) {
                if (answer) {
                    answer.TECHDISER_ID = msbUtilService.generateId();
                    if (type == 'barcode') {
                        if (vm.packingLabels && vm.selectedBuyer && vm.selectedProduct) {
                            var param = [{ "key": "buyerId", "value": vm.selectedBuyer[PRIMARY_COLUMN_NAME] },
                            { "key": "productId", "value": vm.selectedProduct[PRIMARY_COLUMN_NAME] }];
                            var index = msbUtilService.getIndexByValues(vm.packingLabels, param);
                            if (index > -1) {
                                if (vm.packingLabels[index].barcodes) {
                                    vm.packingLabels[index].barcodes.push(answer);
                                } else {
                                    vm.packingLabels[index].barcodes = [];
                                    vm.packingLabels[index].barcodes.push(answer);
                                }
                            } else {
                                var packingLabelObj = {
                                    "buyerId": vm.selectedBuyer[PRIMARY_COLUMN_NAME],
                                    "productId": vm.selectedProduct[PRIMARY_COLUMN_NAME],
                                    "barcodes": [],
                                    "labels": []
                                };
                                packingLabelObj[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();
                                packingLabelObj.barcodes.unshift(answer);
                                vm.packingLabels.push(packingLabelObj);
                            }
                        }
                    }
                    // if(type == 'label'){
                    //     vm.selectedBuyer.labels.unshift(answer);
                    // }
                }
            });


        }

        function addLabel() {
            var newLabel = {
                "TECHDISER_ID": msbUtilService.generateId()
            };
            if (vm.packingLabels && vm.selectedBuyer && vm.selectedProduct) {
                var param = [{ "key": "buyerId", "value": vm.selectedBuyer[PRIMARY_COLUMN_NAME] },
                { "key": "productId", "value": vm.selectedProduct[PRIMARY_COLUMN_NAME] }];
                var index = msbUtilService.getIndexByValues(vm.packingLabels, param);
                if (index > -1) {
                    if (vm.packingLabels[index].labels) {
                        newLabel.title = "Label " + vm.packingLabels[index].labels.length
                        vm.packingLabels[index].labels.unshift(newLabel);
                    } else {
                        vm.packingLabels[index].labels = [];
                        newLabel.title = "Label 1";
                        vm.packingLabels[index].labels.unshift(newLabel);
                    }
                } else {
                    var packingLabelObj = {
                        "buyerId": vm.selectedBuyer[PRIMARY_COLUMN_NAME],
                        "productId": vm.selectedProduct[PRIMARY_COLUMN_NAME],
                        "barcodes": [],
                        "labels": []
                    };
                    packingLabelObj[PRIMARY_COLUMN_NAME] = msbUtilService.generateId();
                    newLabel.title = "Label 1";
                    packingLabelObj.labels.unshift(newLabel);
                    vm.packingLabels.push(packingLabelObj);
                }
            }
            // vm.selectedBuyer.labels.unshift(newLabel);
        }

        function viewLabel(label) {
            $mdDialog.show({
                controller: 'LabelViewDialogController',
                controllerAs: 'vm',
                clickOutsideToClose: false,
                preserveScope: true,
                templateUrl: 'app/main/purchaseorders/po/details/packing-label/dialogs/label-view/label-view.html',
                locals: {
                    Label: label
                }
            });

        }

        function createTemplete(label) {
            $mdDialog.show({
                controller: 'LayoutDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/common/dialogs/layout/layout.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                skipHide: true,
                locals: {
                    Label: label,
                    Barcodes: vm.getBarcodes(),
                    Images: [],
                    FromWhere: 'setup'
                }
            }).then(function (answer) {
                label.template = answer.template;
            });
        }

        function editLabel(label, type) {
            $mdDialog.show({
                controller: 'AssortLabelDialogController',
                controllerAs: 'vm',
                clickOutsideToClose: false,
                preserveScope: true,
                templateUrl: 'app/main/purchaseorders/po/details/packing-label/assort-label/assort-label-dialog.html',
                locals: {
                    Type: type,
                    Barcode: vm.selectedBuyer.barcodes,
                    Label: label
                }
            }).then(function (answer) {
                if (answer) {
                    if (type == 'barcode') {
                        vm.barcodes.push(answer);
                    }
                    if (type == 'assort') {
                        vm.assortLabels.push(answer);
                    }
                }
            });
        }

        function removeBarcode(barcode) {
            if (barcode) {
                var index = msbUtilService.getIndex(vm.selectedBuyer.barcodes, PRIMARY_COLUMN_NAME, barcode[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    vm.selectedBuyer.barcodes.splice(index, 1);
                }
            }
        }

        function deleteLabel(label) {
            if (label) {
                var index = msbUtilService.getIndex(vm.selectedBuyer.labels, PRIMARY_COLUMN_NAME, label[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    vm.selectedBuyer.labels.splice(index, 1);
                }
            }
        }

        function getBarcodes() {
            if (vm.packingLabels && vm.selectedBuyer && vm.selectedProduct) {
                var param = [{ "key": "buyerId", "value": vm.selectedBuyer[PRIMARY_COLUMN_NAME] },
                { "key": "productId", "value": vm.selectedProduct[PRIMARY_COLUMN_NAME] }];
                var index = msbUtilService.getIndexByValues(vm.packingLabels, param);
                if (index > -1) {
                    return vm.packingLabels[index].barcodes;
                }
            }
        }

        function getLabel() {
            if (vm.packingLabels && vm.selectedBuyer && vm.selectedProduct) {
                var param = [{ "key": "buyerId", "value": vm.selectedBuyer[PRIMARY_COLUMN_NAME] },
                { "key": "productId", "value": vm.selectedProduct[PRIMARY_COLUMN_NAME] }];
                var index = msbUtilService.getIndexByValues(vm.packingLabels, param);
                if (index > -1) {
                    return vm.packingLabels[index].labels;
                }
            }
        }
    }
})();
