(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('tdSingleContainerInvoice', tdSingleContainerInvoice)
        .controller('SingleContainerInvoiceDirectiveController', SingleContainerInvoiceDirectiveController);

    /** @ngInject */
    function tdSingleContainerInvoice() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                packingpolicy: '=',
                changedPacks: '=',
                referenceNoInfo: '=',
                sizeDef: '=',
                colorDef: '=',
                onUpdate: '&'
            },
            controller: "SingleContainerInvoiceDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/main/directives/single-container/single-container-diective.html'
        };
    }

    /** @ngInject */
    function SingleContainerInvoiceDirectiveController($scope, msbUtilService, msbCommonApiService,
        PRIMARY_COLUMN_NAME, INVOICE_ASSORT_TYPES, commercialInvoiceService) {

        var vm = this;
        vm.assortTypes = INVOICE_ASSORT_TYPES;
        vm.packingpolicy = $scope.packingpolicy;
        vm.changedPacks = $scope.changedPacks;
        // vm.packingTypes = $scope.packingTypes;
        vm.referenceNoInfo = $scope.referenceNoInfo;
        vm.sizeDef = $scope.sizeDef;
        vm.colorDef = $scope.colorDef;
        vm.onUpdate = onUpdate;
        vm.selectPackingType = selectPackingType;
        vm.selectContainerGroup = selectContainerGroup;
        vm.selectShippingPacket = selectShippingPacket;
        vm.changeContainerGroup = changeContainerGroup;
        vm.setLotNo = setLotNo;
        vm.setNetWeight = setNetWeight;
        vm.setGrossWeight = setGrossWeight;
        vm.setLength = setLength;
        vm.setWidth = setWidth;
        vm.setHeight = setHeight;
        vm.calculateRoll = calculateRoll;
        vm.generateSingleContainerCommInvoice = generateSingleContainerCommInvoice;
        vm.addAssort = addAssort;
        vm.getColorById = getColorById;
        vm.getSizeById = getSizeById;
        vm.addToChangedPacks = addToChangedPacks;
        vm.updateChangedPacks = updateChangedPacks;
        vm.setLotNoForAssortPack = setLotNoForAssortPack;
        vm.selectThousandRange = selectThousandRange;

        vm.isChange = 0;

        init();

        function init() {
            console.log(vm.packingpolicy);
            console.log(vm.changedPacks);
            generateSingleContainerCommInvoice();
            setData();
            onUpdate();
            commercialInvoiceService.addChangedPacks(vm.changedPacks, vm.packingTypes);
            commercialInvoiceService.setLotFromChangedPacksForAssort(vm.changedPacks, vm.packingTypes);
            generateThousandRange();
        }

        function setData() {
            setLotNo(vm.packingpolicy.startingLot);
            changeContainerGroup(vm.packingpolicy.startingBoxNo);
            setNetWeight(vm.packingpolicy.nw);
            setGrossWeight(vm.packingpolicy.gw);
            setLength(vm.packingpolicy.measurement.measLength);
            setWidth(vm.packingpolicy.measurement.measWidth);
            setHeight(vm.packingpolicy.measurement.measHeight);
        }

        // function setRefNoToMerchandisePack(packingTypes) {
        //   commercialInvoiceService.setRefNoToMerchandisePack(packingTypes, vm.referenceNoInfo);
        // }

        function generateSingleContainerCommInvoice(isNewPackingPolicy) {
            // commercialInvoiceService.calculateRoll(vm.packingpolicy);
            var param = {
                "packingPolicy": vm.packingpolicy,
                "directiveType": "singleContainer"
            }
            commercialInvoiceService.generateSingleContainerCommInvoice(function (data) {
                vm.packingTypes = data;
                if (isNewPackingPolicy) {
                    vm.changedPacks = [];
                    setData();
                }
                // msbUtilService.downLoadJson(vm.packingTypes, "packingTypes");
                console.log(data);
                if (vm.packingTypes && angular.isArray(vm.packingTypes) && vm.packingTypes.length > 0) {
                    selectPackingType(vm.packingTypes[0]);
                }
            }, param)
        }

        function changeContainerGroup(startingNo) {
            commercialInvoiceService.changeContainerGroup(vm.packingTypes, startingNo);
            generateThousandRange();
        }

        function selectPackingType(packingType) {
            vm.selectedPackingType = packingType;
            generateThousandRange();
            if (vm.selectedPackingType.containerGroups && angular.isArray(vm.selectedPackingType.containerGroups) &&
                vm.selectedPackingType.containerGroups.length > 0) {
                selectContainerGroup(vm.selectedPackingType.containerGroups[0]);
            }
        }

        function generateThousandRange() {
            var param = [{ "key": "containerGroups", "value": vm.selectedPackingType.containerGroups }];
            msbCommonApiService.interfaceManager(function (data) {
                if (data) {
                    vm.thousandRanges = data;
                    if (data.length > 0) {
                        selectThousandRange(data[0]);
                    }
                }
            }, "commercialInvoiceService", "generateThousandRange", param);
        }

        function selectContainerGroup(containerGroup) {
            vm.selectedContainerGroup = containerGroup;
            if (vm.selectedContainerGroup.shippingPackets &&
                angular.isArray(vm.selectedContainerGroup.shippingPackets) && vm.selectedContainerGroup.shippingPackets.length > 0) {
                selectShippingPacket(vm.selectedContainerGroup.shippingPackets[0]);
            }
        }

        function selectShippingPacket(shippingPack) {
            vm.selectedShippingPacket = shippingPack;
        }

        function setLotNo(lotNo) {
            commercialInvoiceService.setLotNo(lotNo, vm.packingTypes);
        }

        function setNetWeight(netWeight) {
            for (var i = 0; i < vm.packingTypes.length; i++) {
                commercialInvoiceService.setNetWeight(netWeight, vm.packingTypes[i]);
                onUpdate();
            }
        }

        function setGrossWeight(grossWeight) {
            for (var i = 0; i < vm.packingTypes.length; i++) {
                commercialInvoiceService.setGrossWeight(grossWeight, vm.packingTypes[i]);
                onUpdate();
            }
        }

        function setLength(length) {
            for (var i = 0; i < vm.packingTypes.length; i++) {
                commercialInvoiceService.setLength(length, vm.packingTypes[i]);
                onUpdate();
            }
        }

        function setWidth(width) {
            for (var i = 0; i < vm.packingTypes.length; i++) {
                commercialInvoiceService.setWidth(width, vm.packingTypes[i]);
                onUpdate();
            }
        }

        function setHeight(height) {
            for (var i = 0; i < vm.packingTypes.length; i++) {
                commercialInvoiceService.setHeight(height, vm.packingTypes[i]);
                onUpdate();
            }
        }

        function calculateRoll(packingPolicy) {
            commercialInvoiceService.calculateRoll(packingPolicy);
        }

        function addAssort() {
            console.log(vm.packingpolicy.assort);
            var param = {
                "colorIds": ["White", "Black"],
                "sizeIds": ["7 mm", "9 mm"],
                "assort": vm.packingpolicy.assort
            }
            commercialInvoiceService.assortDialog(function (assort) {
                vm.packingpolicy.assort = assort;
                console.log(assort);
            }, param);
        }

        function onUpdate() {
            var responseData = {
                "packingpolicy": vm.packingpolicy,
                "changedPacks": vm.changedPacks,
                "packingTypes": vm.packingTypes,
                "isChange": vm.isChange
            }
            $scope.onUpdate({
                item: responseData
            });
        }

        function getColorById(colorId) {
            return commercialInvoiceService.getColorById(vm.colorDef, colorId);
        }

        function getSizeById(sizeId) {
            return commercialInvoiceService.getSizeById(vm.sizeDef, sizeId);
        }

        function addToChangedPacks(packet) {
            commercialInvoiceService.addToChangedPacks(packet, vm.changedPacks);
            console.log(vm.changedPacks);
        }

        function updateChangedPacks(property, value) {
            commercialInvoiceService.updateChangedPacks(property, value, vm.changedPacks);
        }

        function setLotNoForAssortPack(lot, packNo) {
            commercialInvoiceService.setLotNoForAssortPack(lot, packNo, vm.packingTypes);
        }

        function selectThousandRange(thousandRange) {
            vm.selectedThousandRange = thousandRange;
            var index = msbUtilService.getIndex(vm.selectedPackingType.containerGroups, "startNo", vm.selectedThousandRange.startNo);
            if (index > -1) {
                selectContainerGroup(vm.selectedPackingType.containerGroups[index]);
            }
        }
    }

})();
