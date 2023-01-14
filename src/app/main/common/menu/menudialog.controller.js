(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('RegisterMenuDialogController', RegisterMenuDialogController);

    /** @ngInject */
    function RegisterMenuDialogController($mdMenu, $mdDialog, commonApi, msUtils, Menu,
        Reports, Forms, OnSave, ViewMode, PRIMARY_COLUMN_NAME, LandingViews) {
        var vm = this;
        vm.isNew = false;
        vm.menu = Menu;
        vm.forms = Forms;
        vm.reports = Reports;
        vm.landingViews = LandingViews;
        vm.viewMode = ViewMode;
        vm.primaryColumnName = PRIMARY_COLUMN_NAME;

        ////////
        vm.closeDialog = closeDialog;
        vm.closeMenu = closeMenu;
        vm.saveMenu = saveMenu;

        init()


        function init() {
            // if(ViewMode){
            //  if(vm.menu.reportId){
            //      commonApi.getSingleItem('REPORT', vm.menu.reportId).then(function(response) {
            //            vm.reports.push(response.data.data);               
            //          }, function(response) {

            //      });
            //    }

            //    if(vm.menu.formId){
            //      commonApi.getSingleItem('DATA-CAPTURE', vm.menu.formId).then(function(response) {
            //            vm.forms.push(response.data.data);               
            //          }, function(response) {

            //      });
            //   }

            // }

            if (!vm.menu) {
                createNewMenu();
            }
        }


        function createNewMenu() {
            vm.isNew = true;
            vm.menu = {
                title: "",
                type: "state"
            }
        }

        function saveMenu() {
            closeDialog();
            OnSave(vm.menu, vm.isNew);
        }


        function closeMenu() {
            $mdMenu.hide();
        }

        function closeDialog() {
            $mdDialog.hide();
        }


    }

})();