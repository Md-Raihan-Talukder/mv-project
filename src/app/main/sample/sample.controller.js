(function () {
    'use strict';

    angular
        .module('app.sample')
        .controller('SampleController', SampleController);

    /** @ngInject */
    function SampleController(msbUtilService, dataSearchService, msbCommonApiService, roleManagerService, commonApiService, PRIMARY_COLUMN_NAME, $scope, $http, $rootScope, mainMenuService, SampleData, msUtils, utilService, CONSTANT_DATE_TIME_FORMATS, $mdDialog, $document) {
        var vm = this;



        var iii = msbUtilService.jsonManipulator({ "data": { "val": {} } }, [], "/data/", { "name": "A" }, false, null, null, null)
        console.log(iii)
        var header = [
            {
                "id": "item",
                "idRef": { "key": "TECHDISER_ID", "value": "project1" },
                "service": "PROJECT",
                "task": "",
                "info": [
                    { "show": true, "label": "Project", "key": "title", "path": "/basicInfo" },
                    { "key": "poId", "path": "/basicInfo" }
                ]
            },
            {
                "id": "po",
                "service": "PURCHASE_ORDER",
                "task": "",
                "idRef": { "key": "poId", "from": "item" },
                "path": "/basicInfo",
                "pathParams": [],
                "info": [
                    { "show": true, "label": "PO#", "key": "poNo" },
                    { "key": "styleId" }
                ]
            },
            {
                "id": "style",
                "service": "ENQUIRY_STYLE_ORDER",
                "task": "",
                "idRef": { "key": "styleId", "from": "po" },
                "path": "/basicInfo",
                "pathParams": [],
                "info": [
                    { "show": true, "label": "Style#", "key": "styleNo" },
                    { "key": "buyerId" }
                ]
            },
            {
                "id": "buyer",
                "service": "BUYER",
                "task": "",
                "idRef": { "key": "buyerId", "from": "style" },
                "path": "/",
                "pathParams": [],
                "info": [
                    { "show": true, "label": "Buyer Name", "key": "name" }
                ]
            }
        ];

        // dataSearchService.searchKeyValue(header, function (data) {
        //   console.log(data)
        // });

        vm.aceOption = {
            useWrapMode: true,
            showGutter: true,
            showLineNumbers: true,
            theme: 'TextMate',
            mode: 'json'
        };

        vm.jsonItem = JSON.stringify(header, null, '\t');

        vm.stripParameters = [{ "key": "bookingId", "value": "work-order1" }];
        vm.serviceInfo = {
            "serviceKey": "SUPPLIERS"
        }
        vm.listColumns = [
            { "label": "Name", "key": "name" },
            { "label": "Address", "key": "address" }
        ];
        vm.selItems = [
            { "key": "orgId", "value": "orgId" },
            { "key": "offFactId", "value": "dfgfdg1" },
            { "key": "deptId", "value": "card1" },
            { "key": "divId", "value": "card4" },
            { "key": "teamId", "value": "card8" },
            { "key": "levelId", "value": "3878.05c93b01dc782" },
            { "key": "desigId", "value": "ieManager_1" }
        ];
        vm.onSelect = function (items) {
            console.log(items)
        }

        vm.text = "aaa aa bb";
        vm.keyVals = [
            { "key": "poNo", "value": "po-0120", "label": "PO No" },
            { "key": "styleNo", "value": "style-987", "label": "Style No" }
        ];

        msbCommonApiService.interfaceManager(function (data) {
            $scope.types = data;
            $scope.selection = $scope.types[12];
        }, "barcodeService", "getBarcodeTypes");



        vm.setExternalFns = setExternalFns;
        vm.setExternalFns1 = setExternalFns1;

        // getOrgRoleTree
        var callBack = function (roles) {
            vm.roles = roles;
        }
        // permission test
        var orgId = "Organization_1";
        var roleId = "1"
        var getRoleAccess = function (rolePermissions) {
            vm.permissions = rolePermissions;
        }
        roleManagerService.getOrgRolePermissions(getRoleAccess, orgId, roleId);

        //


        var orgId = "Organization_1";
        roleManagerService.getOrgRoleTree(orgId, callBack);
        // roleManagerService.getOrgRoles(orgId)
        var empKeies = [
            { "key": "orgId", "value": orgId },
            { "key": "offFactId", "value": "dfgfdg1" },
            { "key": "deptId", "value": "card1" },
            { "key": "divId", "value": "card4" },
            { "key": "teamId", "value": "card8" },
            { "key": "levelId", "value": "3878.05c93b01dc782" },
            { "key": "desigId", "value": "ieManager_1" }
        ];
        var teamPath = "/[TECHDISER_ID=$teamId]";
        var levelPath = "/[TECHDISER_ID=$divId]/cHLevels[TECHDISER_ID=$levelId]";
        msbCommonApiService.getItems("ORG_DEPARTMENTS", null,
            function (data) {
                console.log(data);
            }, null, false, null, "clientUrl", levelPath, empKeies);

        //
        vm.viewStripObjects = function () {


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
                    Template: vm.template
                }
            }).then(function (answer) {
                if (!answer) {
                    return;
                }



            });
            //console.log(vm.stripObjects);
        }

        vm.viewStripObjects1 = function () {
            //console.log(vm.stripObjects1);
        }

        function setExternalFns(addFn) {
            vm.addNewStrip = addFn;
        }

        function setExternalFns1(addFn) {
            vm.addNewStrip1 = addFn;
        }
        vm.parameters = [
            {
                "key": "category",
                "value": {
                    "TECHDISER_ID": "Button",
                    "TECHDISER_CODE": "Button",
                    "title": "Button"
                }
            },
            {
                "key": "styleID",
                "value": "style1"
            }
        ];

        vm.formColumns = [
            {
                "title": "Name",
                "data": "name",
                "type": "text",
                "TECHDISER_ID": "1"
            },
            {
                "title": "Form ID",
                "data": "formId",
                "type": "text",
                "TECHDISER_ID": "2"
            },
            {
                "title": "Description",
                "data": "description",
                "type": "multilineText",
                "TECHDISER_ID": "3",
                "flex": 50
            }

        ];

        vm.msbGridTypeColumn = {};

        /*msbgrid*/
        vm.onAddButton = onAddButton;
        vm.setFns = setFns;
        vm.addToMsbGrid = addToMsbGrid;
        vm.editMsbGrid = editMsbGrid;
        vm.deleteMsbGrid = deleteMsbGrid;
        vm.selectMsbGrid = selectMsbGrid;

        vm.msbGridData = [];

        function onAddButton() {
            vm.callAddFunction();
        }

        function addToMsbGrid(helperItems, callBack) {
            //do add then call callBack
            var item = { Degree: "BSC", year: 2017, Result: "A+" };
            item[PRIMARY_COLUMN_NAME] = utilService.generateId();
            vm.msbGridData.push(item);
            callBack(item);
        }

        function editMsbGrid(helperItems, gridItem, callBack) {
            //do edit then call callBack
            gridItem.Degree = gridItem.Degree + " edited";
            callBack(gridItem);
        }

        function deleteMsbGrid(helperItems, gridItem, callBack) {
            //do delete then call callBack

            commonApiService.confirmAndDelete(null, function () {
                callBack(gridItem);
            });
        }

        function selectMsbGrid(helperItems, selectedItems, callBack) {
            //do tasks then call callBack

            callBack();
        }

        function setFns(addFn, selectedFn) {

            vm.callAddFunction = addFn;
            vm.callSelectedFunction = selectedFn;
        }

        /*end msbgrid*/



        vm.data = {};
        vm.formData = {
            employee: {},
            formInfo: "test data"
        };

        $scope.gridOptions = {
            exporterMenuPdf: false,
            enableGridMenu: true,
        };

        $scope.gridOptions.columnDefs = [
            { name: 'id', width: 50, enablePinning: false },
            { name: 'name', width: 100, pinnedLeft: true },
            { name: 'age', width: 100, pinnedRight: true },
            { name: 'address.street', width: 150 },
            { name: 'address.city', width: 150 },
            { name: 'address.state', width: 50 },
            { name: 'address.zip', width: 50 },
            { name: 'company', width: 100 },
            { name: 'email', width: 100 },
            { name: 'phone', width: 200 },
            { name: 'about', width: 300 },
            { name: 'friends[0].name', displayName: '1st friend', width: 150 },
            { name: 'friends[1].name', displayName: '2nd friend', width: 150 },
            { name: 'friends[2].name', displayName: '3rd friend', width: 150 },
        ];

        $http.get('app/data/ui-grid/500_complex.json')
            .success(function (data) {
                $scope.gridOptions.data = data;
            });

        vm.log = function (info) {
            console.log(vm.formData);
        }

        vm.onUpload = function (info) {
            console.log(info);
        }

        $scope.stepsModel = [];
        vm.showPdfLoadDialog = showPdfLoadDialog;

        function showPdfLoadDialog(ev) {
            // mainMenuService.addMainMenu($rootScope.selectedModule.mainMenus);

            $mdDialog.show({
                controller: 'PdfLoadDialogController',
                controllerAs: 'vm',
                locals: {


                },
                templateUrl: 'app/main/common/pdfloaddialog/pdfloaddialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });

        }


        // Data
        vm.helloText = SampleData.data.helloText;
        vm.cm = SampleData.data.cm;
        vm.formateDate = formateDate;
        function formateDate(date, format) {
            return utilService.formatDateValue(date, format);
        }

        vm.expandColupseChild = function (item) {
            item.expand = !item.expand;
        }

        vm.check = function () {
            evaluateExpressin(vm.cm);
            vm.cm.value = $scope.$eval(vm.cm.formula);
            //alert($scope.$eval('vm.cm.variables[0].value * 1 + vm.cm.variables[1].value *1 +100'));
        }

        function evaluateExpressin(node) {
            for (var i = node.variables.length - 1; i >= 0; i--) {
                if (!node.variables[i].nocalculation && node.variables[i].formula) {
                    if (node.variables[i].variables) {
                        evaluateExpressin(node.variables[i]);
                    }
                    node.variables[i].value = $scope.$eval(node.variables[i].formula);
                }
            }
        }

        /////////////////

        vm.gridDirective = {
            columns: [
                {
                    title: 'ID',
                    data: 'id',
                    type: 'numeric',
                    width: 40
                },
                {
                    title: 'Flag',
                    data: 'flag',
                    type: 'numeric',
                    formula: "(row.id + row.level)"
                },
                {
                    title: 'Currency Code',
                    data: 'currencyCode',
                    type: 'text'
                },
                {
                    title: 'Currency',
                    data: 'currency',
                    type: 'text'
                },
                {
                    title: 'Level',
                    data: 'level',
                    type: 'numeric',
                    format: '0.0000',
                    validator: /^[0-9]$/
                },
                {
                    title: 'Units',
                    data: 'units',
                    type: 'text'
                },
                {
                    title: 'Date',
                    data: 'asOf',
                    type: 'date',
                    dateFormat: 'dd.MM.yyyy',
                    correctFormat: true,
                    defaultDate: '01/01/1900'
                },
                {
                    title: 'Percentage',
                    data: 'onedChng',
                    type: 'numeric',
                    format: '0.00%'
                }
            ],
            rows: [
                { id: 1, flag: "id", currencyCode: 'EUR', currency: 'Euro', level: 0.9033, units: 'EUR / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0026 },
                { id: 2, flag: "id", currencyCode: 'JPY', currency: 'Japanese Yen', level: 124.3870, units: 'JPY / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0001 },
                { id: 3, flag: "id", currencyCode: 'GBP', currency: 'Pound Sterling', level: 0.6396, units: 'GBP / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.00 },
                { id: 4, flag: "id", currencyCode: 'CHF', currency: 'Swiss Franc', level: 0.9775, units: 'CHF / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0008 },
                { id: 5, flag: "id", currencyCode: 'CAD', currency: 'Canadian Dollar', level: 1.3097, units: 'CAD / USD', asOf: '2016-10-10 16:59:00', onedChng: -0.0005 },
                { id: 6, flag: "id", currencyCode: 'AUD', currency: 'Australian Dollar', level: 1.3589, units: 'AUD / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0020 },
                { id: 7, flag: "id", currencyCode: 'NZD', currency: 'New Zealand Dollar', level: 1.5218, units: 'NZD / USD', asOf: '2016-10-10 16:59:00', onedChng: -0.0036 },
                { id: 8, flag: "id", currencyCode: 'SEK', currency: 'Swedish Krona', level: 8.5280, units: 'SEK / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0016 },
                { id: 9, flag: "id", currencyCode: 'NOK', currency: 'Norwegian Krone', level: 8.2433, units: 'NOK / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0008 },
                { id: 10, flag: "id", currencyCode: 'BRL', currency: 'Brazilian Real', level: 3.4806, units: 'BRL / USD', asOf: '2016-10-10 16:59:00', onedChng: -0.0009 },
                { id: 11, flag: "id", currencyCode: 'CNY', currency: 'Chinese Yuan', level: 6.3961, units: 'CNY / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0004 },
                { id: 12, flag: "id", currencyCode: 'RUB', currency: 'Russian Rouble', level: 65.5980, units: 'RUB / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0059 },
                { id: 13, flag: "id", currencyCode: 'INR', currency: 'Indian Rupee', level: 65.3724, units: 'INR / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0026 },
                { id: 14, flag: "id", currencyCode: 'TRY', currency: 'New Turkish Lira', level: 2.8689, units: 'TRY / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0092 },
                { id: 15, flag: "id", currencyCode: 'THB', currency: 'Thai Baht', level: 35.5029, units: 'THB / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0044 },
                { id: 16, flag: "id", currencyCode: 'IDR', currency: 'Indonesian Rupiah', level: 13.83, units: 'IDR / USD', asOf: '2016-10-10 16:59:00', onedChng: -0.0009 },
                { id: 17, flag: "id", currencyCode: 'MYR', currency: 'Malaysian Ringgit', level: 4.0949, units: 'MYR / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0010 },
                { id: 18, flag: "id", currencyCode: 'MXN', currency: 'Mexican New Peso', level: 16.4309, units: 'MXN / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0017 },
                { id: 19, flag: "id", currencyCode: 'ARS', currency: 'Argentinian Peso', level: 9.2534, units: 'ARS / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0011 },
                { id: 20, flag: "id", currencyCode: 'DKK', currency: 'Danish Krone', level: 6.7417, units: 'DKK / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0025 },
                { id: 21, flag: "id", currencyCode: 'ILS', currency: 'Israeli New Sheqel', level: 3.8262, units: 'ILS / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0084 },
                { id: 22, flag: "id", currencyCode: 'PHP', currency: 'Philippine Peso', level: 46.3108, units: 'PHP / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0012 }
            ],
            onRowClick: function (item) {
                //item.id = 200;
                //vm.gridDirective.rows.splice(1, 1);
                //var aaa ={id: -1, flag: "id", currencyCode: 'EUR', currency: 'Euro', level: 0.9033, units: 'EUR / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0026};
                //vm.gridDirective.rows.push(aaa);
            },
            onAddClick: function () {
                // showDynamicFormDialog();
                //item.id = 200;
                //vm.gridDirective.rows.splice(1, 1);
                //var aaa ={id: -1, flag: "id", currencyCode: 'EUR', currency: 'Euro', level: 0.9033, units: 'EUR / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0026};
                //vm.gridDirective.rows.push(aaa);
            }

        };

        // function showDynamicFormDialog(item){

        //     $mdDialog.show({
        //         controller         : 'DynamicFormDialogController',
        //         controllerAs       : 'vm',
        //         templateUrl        : 'app/main/common/dynamicformdialog/dynamicformdialog.html',
        //         parent             : angular.element($document.body),
        //         clickOutsideToClose: true,
        //         locals             : {
        //             DialogTitle : "Add new item",
        //             Columns     : vm.registerDirective.gridData.columns,
        //             Item        : item,
        //             OnSave      : addNewItem,
        //             OnDelete    : deleteItem
        //         }
        //     });

        // }


        // function addNewItem(item, isNew){
        //   if(isNew){
        //     vm.registerDirective.gridData.rows.push(item);
        //   }else{
        //       var index = getItemIndex(item);
        //       if(index>=0){
        //         vm.registerDirective.gridData.rows[index]= item;
        //       }

        //   }
        // }

        // function deleteItem(item){
        //   var index = getItemIndex(item);
        //   if(index>=0){
        //     vm.registerDirective.gridData.rows.splice(index, 1);
        //   }
        // }

        // function getItemIndex(item){
        //   for (var i = 0; i < vm.registerDirective.gridData.rows.length; i++) {
        //      var row =vm.registerDirective.gridData.rows[i];
        //      if(item.uniqueId ===row.row){
        //        return i;
        //      }
        //   }
        //   return -1;
        // }




        //////////


        vm.registerDirective = {
            title: 'register-1',
            header: 'Employee Interview',
            description: '5 –10 minutes for each interviewees, the estimated time for whole interview process is about 40 minutes',
            footer: 'The questions should be asked in the interview will include but not limited to the above',
            gridData: {
                dtInstance: {},
                columns: [
                    {
                        id: 2,
                        title: 'SL#',
                        data: 'slNo',
                        type: 'index'
                    },
                    {
                        id: 1,
                        title: 'UniqueId',
                        data: 'uniqueId',
                        type: 'uniqueId'
                    },

                    {
                        id: 11,
                        title: 'ID',
                        data: 'id',
                        type: 'numeric',
                        width: 40
                    },
                    {

                        id: 22,
                        title: 'Flag',
                        data: 'flag',
                        type: 'numeric',
                        isRunning: true,
                        precision: 5,
                        formula: "(row.id * 100) + row.onedChng"
                    },
                    {

                        id: 3,
                        title: 'Currency Code',
                        data: 'currencyCode',
                        type: 'multilineText'
                    },
                    {

                        id: 4,
                        title: 'Currency',
                        data: 'currency',
                        type: 'text'
                    },
                    {

                        id: 5,
                        title: 'Level',
                        data: 'level',
                        type: 'html',
                        format: '0.0000',
                        validator: /^[0-9]$/
                    },
                    {

                        id: 6,
                        title: 'Units',
                        data: 'units',
                        refference: 'district',
                        refferenceMultiple: false,
                        type: 'text'
                    },

                    {

                        id: 7,
                        title: 'Current Date',
                        data: 'asOf',
                        type: 'date',
                        format: 'dd.MMMM.yyyy',
                        correctFormat: true,
                        defaultDate: '01/01/1900'
                    },
                    {

                        id: 8,
                        title: 'Percentage',
                        data: 'onedChng',
                        type: 'numeric'
                    }
                    // {
                    //     id: 9,
                    //     title: 'Register',
                    //     data: 'registerData',
                    //     type: 'register',
                    //     header:'Test Register',
                    //     description:'',
                    //     footer: ''

                    // }
                ],
                rows: [
                    // {uniqueId: msUtils.guidGenerator(), slNo: 1}
                    // {uniqueId: msUtils.guidGenerator(), id: 1, flag: "id", currencyCode: 'EUR', currency: 'Euro', level: 0.9033, units: 'EUR / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0026},
                    // {uniqueId: msUtils.guidGenerator(),id: 2, flag: "id", currencyCode: 'JPY', currency: 'Japanese Yen', level: 124.3870, units: 'JPY / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0001},
                    // {uniqueId: msUtils.guidGenerator(),id: 3, flag: "id", currencyCode: 'GBP', currency: 'Pound Sterling', level: 0.6396, units: 'GBP / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.00},
                    // {uniqueId: msUtils.guidGenerator(),id: 4, flag: "id", currencyCode: 'CHF', currency: 'Swiss Franc',  level: 0.9775, units: 'CHF / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0008},
                    // {uniqueId: msUtils.guidGenerator(),id: 5, flag: "id", currencyCode: 'CAD', currency: 'Canadian Dollar',  level: 1.3097, units: 'CAD / USD', asOf: '2016-10-10 16:59:00', onedChng: -0.0005},
                    // {uniqueId: msUtils.guidGenerator(),id: 6, flag: "id", currencyCode: 'AUD', currency: 'Australian Dollar',  level: 1.3589, units: 'AUD / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0020},
                    // {uniqueId: msUtils.guidGenerator(),id: 7, flag: "id", currencyCode: 'NZD', currency: 'New Zealand Dollar', level: 1.5218, units: 'NZD / USD', asOf: '2016-10-10 16:59:00', onedChng: -0.0036},
                    // {uniqueId: msUtils.guidGenerator(),id: 8, flag: "id", currencyCode: 'SEK', currency: 'Swedish Krona',  level: 8.5280, units: 'SEK / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0016},
                    // {uniqueId: msUtils.guidGenerator(),id: 9, flag: "id", currencyCode: 'NOK', currency: 'Norwegian Krone',  level: 8.2433, units: 'NOK / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0008},
                    // {uniqueId: msUtils.guidGenerator(),id: 10, flag: "id", currencyCode: 'BRL', currency: 'Brazilian Real',  level: 3.4806, units: 'BRL / USD', asOf: '2016-10-10 16:59:00', onedChng: -0.0009},
                    // {uniqueId: msUtils.guidGenerator(),id: 11, flag: "id", currencyCode: 'CNY', currency: 'Chinese Yuan',  level: 6.3961, units: 'CNY / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0004},
                    // {uniqueId: msUtils.guidGenerator(),id: 12, flag: "id", currencyCode: 'RUB', currency: 'Russian Rouble',  level: 65.5980, units: 'RUB / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0059},
                    // {uniqueId: msUtils.guidGenerator(),id: 13, flag: "id", currencyCode: 'INR', currency: 'Indian Rupee',  level: 65.3724, units: 'INR / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0026},
                    // {uniqueId: msUtils.guidGenerator(),id: 14, flag: "id", currencyCode: 'TRY', currency: 'New Turkish Lira',  level: 2.8689, units: 'TRY / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0092},
                    // {uniqueId: msUtils.guidGenerator(),id: 15, flag: "id", currencyCode: 'THB', currency: 'Thai Baht', level: 35.5029, units: 'THB / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0044},
                    // {uniqueId: msUtils.guidGenerator(),id: 16, flag: "id", currencyCode: 'IDR', currency: 'Indonesian Rupiah', level: 13.83, units: 'IDR / USD', asOf: '2016-10-10 16:59:00', onedChng: -0.0009},
                    // {uniqueId: msUtils.guidGenerator(),id: 17, flag: "id", currencyCode: 'MYR', currency: 'Malaysian Ringgit', level: 4.0949, units: 'MYR / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0010},
                    // {uniqueId: msUtils.guidGenerator(),id: 18, flag: "id", currencyCode: 'MXN', currency: 'Mexican New Peso',  level: 16.4309, units: 'MXN / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0017},
                    // {uniqueId: msUtils.guidGenerator(),id: 19, flag: "id", currencyCode: 'ARS', currency: 'Argentinian Peso',  level: 9.2534, units: 'ARS / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0011},
                    // {uniqueId: msUtils.guidGenerator(),id: 20, flag: "id", currencyCode: 'DKK', currency: 'Danish Krone',  level: 6.7417, units: 'DKK / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0025},
                    // {uniqueId: msUtils.guidGenerator(),id: 21, flag: "id", currencyCode: 'ILS', currency: 'Israeli New Sheqel',  level: 3.8262, units: 'ILS / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0084},
                    // {uniqueId: msUtils.guidGenerator(),id: 22, flag: "id", currencyCode: 'PHP', currency: 'Philippine Peso', level: 46.3108, units: 'PHP / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0012}
                ],
                onRowClick: function (item) {
                    // showDynamicFormDialog(item);
                    //item.id = 200;
                    //vm.gridDirective.rows.splice(1, 1);
                    //var aaa ={id: -1, flag: "id", currencyCode: 'EUR', currency: 'Euro', level: 0.9033, units: 'EUR / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0026};
                    //vm.gridDirective.rows.push(aaa);
                },
                onAddClick: function () {
                    // showDynamicFormDialog();
                    //item.id = 200;
                    //vm.gridDirective.rows.splice(1, 1);
                    //var aaa ={id: -1, flag: "id", currencyCode: 'EUR', currency: 'Euro', level: 0.9033, units: 'EUR / USD', asOf: '2016-10-10 16:59:00', onedChng: 0.0026};
                    //vm.gridDirective.rows.push(aaa);
                }
            }

        };



        ///////////////////////

        vm.checkListDirective = {
            itemList: [{
                "id": "63021cfdbe1x72wcf1fc451v",
                "name": "Checklist",
                "checkItemsChecked": 0,
                "checkItems": [
                    {
                        "name": "Implement a calendar library",
                        "checked": false
                    },
                    {
                        "name": "Replace event colors with Material Design colors",
                        "checked": true
                    },
                    {
                        "name": "Replace icons with Material Design icons",
                        "checked": false
                    },
                    {
                        "name": "Use moment.js",
                        "checked": false
                    }
                ]
            },
            {
                "name": "Checklist 2",
                "id": "74031cfdbe1x72wcz1dc166z",
                "checkItemsChecked": 1,
                "checkItems": [
                    {
                        "name": "Replace event colors with Material Design colors",
                        "checked": true
                    },
                    {
                        "name": "Replace icons with Material Design icons",
                        "checked": false
                    },
                    {
                        "name": "Use moment.js",
                        "checked": false
                    }
                ]
            }
            ],
            onAddItem: function (item) {
                var index = vm.checkListDirective.itemList.indexOf(item.checkList)

                if (index >= 0) {
                    vm.checkListDirective.itemList[index].checkItems.push(item.newCheckItem);
                    return true;
                }
            },
            onRemoveItem: function (item) {
                var index = vm.checkListDirective.itemList.indexOf(item.checkList)
                if (index >= 0) {
                    var itemIndex = vm.checkListDirective.itemList[index].checkItems.indexOf(item.newCheckItem);
                    if (itemIndex >= 0) {
                        vm.checkListDirective.itemList[index].checkItems.splice(itemIndex, 1);
                        return true;
                    }
                }

            },
            onRemoveCheckList: function (item) {
                var index = vm.checkListDirective.itemList.indexOf(item)
                if (index >= 0) {
                    vm.checkListDirective.itemList.splice(index, 1);
                    return true;
                }
            }
        }

        vm.commentsDirective = {
            itemList: [
                {
                    "id": "5725a680b3249760ea21de52",
                    "person": {
                        "id": "5725a680b3249760ea21de52",
                        "name": "Abbott",
                        "avatar": "assets/images/avatars/Abbott.jpg"
                    },
                    "message": "We should be able to add moment.js without any problems",
                    "time": "12 mins. ago"
                },
                {
                    "id": "5725a68031fdbb1db2c1af47",
                    "name": "Christy",
                    "avatar": "assets/images/avatars/Christy.jpg",
                    "message": "I added a link for a page that might help us deciding the colors",
                    "time": "30 mins. ago"
                }
            ],
            onAddItem: function (item) {
                vm.commentsDirective.itemList.unshift(item);
            },
            onRemoveItem: function (item) {
                var index = vm.commentsDirective.itemList.indexOf(item);
                if (index >= 0) {
                    vm.commentsDirective.itemList.splice(index, 1);
                    return true;
                }
            }
        };


        vm.attachmentsDirective = {
            itemList: [],
            onAddItem: function (item) {
                vm.attachmentsDirective.itemList.unshift(item);
            },
            onRemoveItem: function (item) {
                var index = vm.attachmentsDirective.itemList.indexOf(item);
                if (index >= 0) {
                    vm.attachmentsDirective.itemList.splice(index, 1);
                    return true;
                }
            }
        };

        vm.remindersDirective = {
            itemList: [],
            onAddItem: function (item) {
                vm.remindersDirective.itemList.unshift(item);
            },
            onRemoveItem: function (item) {
                var index = vm.remindersDirective.itemList.indexOf(item);
                if (index >= 0) {
                    vm.remindersDirective.itemList.splice(index, 1);
                    return true;
                }
            }
        };

        vm.scheduleDirective = {
            schedule: {
                startDateTime: "2016-10-15 16:59:00",
                endDateTime: "2016-10-15 16:59:00",
                timeRequired: true,
                recurringOptions: {
                    isRecurring: false,
                    recurringMode: "weekly",
                    repeatEvery: 1,
                    recurringValues: [1],
                    recurringDays: []
                },
                duePolicy: {
                    due: {
                        delayType: 'before',
                        delayAmount: 1,
                        timeType: 'day',
                        phase: 'startDate'
                    },
                    overDue: {
                        delayType: 'after',
                        delayAmount: 1,
                        timeType: 'day',
                        phase: 'endDate'
                    },
                    longPending: {
                        delayType: 'after',
                        delayAmount: 15,
                        timeType: 'day',
                        phase: 'endDate'
                    },
                }
            }
        };

        vm.getSchedule = function (end) {
            // return vm.scheduleDirective.schedule.startDateTime;

            if (end) {
                return utilService.formatDateValue(vm.scheduleDirective.schedule.endDateTime, CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_DATE_FORMAT + CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR + CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_TIME_FORMAT);
            }
            return utilService.formatDateValue(vm.scheduleDirective.schedule.startDateTime, CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_DATE_FORMAT + CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR + CONSTANT_DATE_TIME_FORMATS.CONSTANT_SYS_TIME_FORMAT);
        }

    }
})();
