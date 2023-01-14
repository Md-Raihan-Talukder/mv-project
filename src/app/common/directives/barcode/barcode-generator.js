(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbBarcodeGen', msbBarcodeGenDirective)
        .controller('msbBarcodeGenDirectiveController', msbBarcodeGenDirectiveController);

    /** @ngInject */
    function msbBarcodeGenDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                loadId: '=',
                keyVals: '=?',
                labSep: '=',
                itemSep: '=',
                includeLabel: '=',
                itemSepTab: '=',
                itemSepNewLine: '=',
                barcodeType: '=',
                linearDefault: '=',
                twoDimDefault: '=',
                plainText: '=',
                text: '=',
                onComplete: '&'
            },
            controller: "msbBarcodeGenDirectiveController",
            controllerAs: 'vm',
            templateUrl: 'app/common/directives/barcode/barcode-generator.html'
        };
    }

    /** @ngInject */
    function msbBarcodeGenDirectiveController($mdDialog, $document, msbCommonApiService, $scope, msbUtilService) {
        var vm = this;

        vm.onChangeValue = onChangeValue;
        vm.preventDefault = preventDefault;
        vm.onChangeType = onChangeType;
        vm.onComplete = onComplete;
        vm.onSetingsChange = onSetingsChange;
        vm.updateItemSep = updateItemSep;
        vm.onSepChange = onSepChange;
        vm.updateIncludeLabel = updateIncludeLabel;
        vm.selecteType = selecteType;



        init();

        function init() {
            msbCommonApiService.interfaceManager(function (data) {
                vm.barcodeTypes = data;
                setInfo();
            }, "barcodeService", "getBarcodeTypes");

            $scope.$watch("loadId", function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    createText();
                    createBarcodeSelection();
                }
            }, true);
        }

        function selecteType() {

            $mdDialog.show({
                controller: 'BarcodeTypeDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/common/directives/barcode/barcode-selector-dialog.html',
                parent: angular.element($document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                skipHide: true,
                locals: {
                    Barcode: vm.selectedBarcode
                }
            }).then(function (answer) {
                if (!answer) {
                    return;
                }

                $scope.linearDefault = false;
                $scope.twoDimDefault = false;

                vm.selectedBarcode = angular.copy(answer);
                createBarcodeSelection();

            });

        }



        function setInfo() {
            vm.scaleX = 2;
            vm.scaleY = 2;
            vm.rotation = "N";
            vm.rendering = "1";
            vm.bgColor = "#ffffff";
            vm.altText = "";
            vm.options = "";

            if (!$scope.barcodeType && !$scope.twoDimDefault) {
                $scope.linearDefault = true;
            }

            if (!$scope.plainText) {

                if (!$scope.labSep) {
                    $scope.labSep = " : ";
                }
                if (!$scope.itemSep && !$scope.itemSepTab) {
                    $scope.itemSepNewLine = true;
                }

                createText();
            }

            vm.labSep = $scope.labSep;
            vm.itemSep = $scope.itemSep;

            selectBarcodeType();
        }

        function createText() {
            var textArr = [];
            for (var i = 0; i < $scope.keyVals.length; i++) {
                var item = $scope.keyVals[i];
                if ($scope.includeLabel) {
                    textArr.push(item.label);
                    textArr.push($scope.labSep);
                }

                textArr.push(item.value);
                if (i < $scope.keyVals.length - 1) {
                    textArr.push(getItemSep());
                }
            }

            $scope.text = textArr.join('');
        }

        function getItemSep() {
            if ($scope.itemSepTab) {
                return "\t";
            }
            if ($scope.itemSepNewLine) {
                return "\n";
            }

            return $scope.itemSep;
        }

        function onChangeValue() {
            createText();
            createBarcodeSelection();
        }

        function onChangeType() {
            selectBarcodeType()
        }

        function selectBarcodeType() {
            if ($scope.linearDefault) {
                vm.selectedBarcode = vm.barcodeTypes[12];
            } else if ($scope.twoDimDefault) {
                vm.selectedBarcode = vm.barcodeTypes[80];
            } else if ($scope.barcodeType) {
                var index = msbUtilService.getIndex(vm.barcodeTypes, "type", $scope.barcodeType);
                if (index > -1) {
                    vm.selectedBarcode = vm.barcodeTypes[index];
                }
            }

            if (!vm.selectedBarcode) {
                $scope.linearDefault = true;
                vm.selectedBarcode = vm.barcodeTypes[12];
            }

            vm.options = vm.selectedBarcode.options;

            createBarcodeSelection();
        }

        function createBarcodeSelection() {
            if (typeof ($scope.text) === 'undefined' || $scope.text === null) {
                $scope.text = "";
            }

            var selection = { name: vm.selectedBarcode.name, type: vm.selectedBarcode.type };
            selection.text = $scope.text;
            selection.altText = vm.altText;
            selection.scale = { x: vm.scaleX, y: vm.scaleY };
            selection.options = vm.options;
            selection.rotation = vm.rotation;
            selection.rendering = vm.rendering;
            selection.bgColor = vm.bgColor;

            vm.selection = selection;

        }

        function onSetingsChange() {
            createBarcodeSelection();
        }

        function onSepChange(type) {
            if (type === 'label') {
                $scope.labSep = vm.labSep;
            } else if (type === 'item') {
                $scope.itemSep = vm.itemSep;
            }

            onChangeValue();
        }

        function updateIncludeLabel() {
            $scope.includeLabel = !$scope.includeLabel;
            onChangeValue();
        }

        function updateItemSep(type) {
            if (type === 'tab') {
                $scope.itemSepNewLine = false;
                $scope.itemSepTab = !$scope.itemSepTab;
                onChangeValue();
            }

            if (type === 'new-line') {
                $scope.itemSepTab = false;
                $scope.itemSepNewLine = !$scope.itemSepNewLine;
                onChangeValue();
            }
        }


        function onComplete(imageData) {
            $scope.onComplete({ imageData: imageData });
        }

        function preventDefault(e) {
            e.preventDefault();
            e.stopPropagation();
        }

    }

})();