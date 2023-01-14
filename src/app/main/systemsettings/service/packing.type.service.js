(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('packingTypeService', packingTypeService);

    /** @ngInject */
    function packingTypeService(msbUtilService, msbCommonApiService,
        UNIT, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME) {


        var services = {
            interfaceDef: interfaceDef,
            getPackingType: getPackingType,
            savePackingType: savePackingType,
            getPackingConsInfo: getPackingConsInfo
        };


        //------------ previous object structure ----------------------

        // "TECHDISER_ID":"97d6.73f3013da9800.a27f1c59d3a49.a06b3eec59b1c.b272abc29c192.66c18e48adf51.010bbff19",
        // "categoryId":"SupplyDefinitionMaterialCategory17",
        // "materialId":"SupplyDefinitionMaterialCategory9",
        // "matUnitId":"inch",
        // "sizeInfo":[]

        //--------------------------------------------------------------

        //------------ previous object structure: SizeInfo Item ----------------------

        // "TECHDISER_ID":"8799.3332b4b757967.44435eb476cc7.a524735a69955.0319ebd16398a.8d9830a29fc2b.0eb9e9a0b",
        // "sizeItem":"18 X 9 X 12",
        // "matQty":"12",
        // "matUnitId":"meter",
        // "packageUnitId":"inch",
        // "forItems":"4",
        // "isDefault":1

        //--------------------------------------------------------------

        var oldJsonStructure = {
            "TECHDISER_ID": "packmattype1",
            "TECHDISER_SERIAL_NO": 1,
            "categoryId": "SupplyDefinitionMaterialCategory17",
            "materials": [
                {
                    "TECHDISER_ID": "mat1",
                    "materialId": "SupplyDefinitionMaterialCategory9",
                    "matConsumption": 2,
                    "containerMatConsumption": 1
                },
                {
                    "TECHDISER_ID": "mat2",
                    "materialId": "SupplyDefinitionMaterialCategory10",
                    "matConsumption": 3,
                    "containerMatConsumption": 1
                }
            ]
        };


        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                services[taskCode](callBack, param);
            }
        }

        function getPackingConsInfo(callBack, param) {
            msbCommonApiService.getItems("PACKING_TYPE", null, function (data) {
                callBack(data);
            });
        }

        function getPackingType(callBack, param) {
            msbCommonApiService.getItems("PACKING_TYPE", null, function (data) {
                var packingInfo = []
                if (data) {
                    data.forEach(function (item) {
                        if (item && item.containerId && item.materialId) {
                            var catId = "PackingTypeSetup" + item.containerId;
                            var catIndex = msbUtilService.getIndex(packingInfo, "TECHDISER_ID", catId);
                            if (catIndex < 0) {
                                var info = {};
                                info.TECHDISER_ID = catId;
                                info.TECHDISER_SERIAL_NO = packingInfo.length + 1;
                                info.categoryId = item.containerId;
                                info.materials = [];
                                packingInfo.push(info);
                                catIndex = packingInfo.length - 1;
                            }
                            if (!packingInfo[catIndex].materials) {
                                packingInfo[catIndex].materials = [];
                            }
                            var matId = catId + item.materialId;
                            var matIndex = msbUtilService.getIndex(packingInfo[catIndex].materials, "TECHDISER_ID", matId);
                            if (matIndex < 0) {
                                var matInfo = {};
                                matInfo.TECHDISER_ID = matId;
                                matInfo.materialId = item.materialId;
                                matInfo.matConsumption = 1;
                                matInfo.containerMatConsumption = 1;
                                matInfo.sizeInfo = item.sizeInfo;
                                packingInfo[catIndex].materials.push(matInfo);
                            }
                        }
                    });
                }
                callBack(packingInfo);
            });
        }



        function savePackingType(callBack, param) {
            msbCommonApiService.saveItems("PACKING_TYPE", param.costInfo, function (data) {
                callBack(data);

            }, null);
        }

        return services;
    }
})();
