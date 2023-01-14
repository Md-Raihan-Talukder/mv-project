(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('SupplierRatingController', SupplierRatingController);

    /** @ngInject */
    function SupplierRatingController($scope, $mdDialog, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, commonApiService, utilService, systemUtils, systemSettingsValidation) {
        var vm = this;
        //vm.exists = systemUtils.exists;
        vm.isNumberKey = systemUtils.isNumberKey;

        // vm.toggleField = toggleField;
        //
        // vm.addIssueType = addIssueType;
        // vm.updateIssueType = updateIssueType;
        // vm.selectIssueType = selectIssueType;
        // vm.clearIssueType = clearIssueType;
        // vm.toggleSelectIssueType = toggleSelectIssueType;
        // vm.clearCheckedIssueTypes = clearCheckedIssueTypes;
        // vm.checkedAllIssueTypes = checkedAllIssueTypes;
        // vm.deleteCheckedIssueTypes = deleteCheckedIssueTypesDialog;
        //
        // vm.addIssue = addIssue;
        // vm.updateIssue = updateIssue;
        vm.selectIssue = selectIssue;
        // vm.clearIssue = clearIssue;
        // vm.toggleSelectIssue = toggleSelectIssue;
        // vm.clearCheckedIssues = clearCheckedIssues;
        // vm.checkedAllIssues = checkedAllIssues;
        // vm.deleteCheckedIssues = deleteCheckedIssuesDialog;

        vm.addRatingClass = addRatingClass;
        vm.deleteRatingClass = deleteRatingClass;
        //var declare by -mrj
        vm.openIssueDialog = openIssueDialog;
        vm.openDeptWeightDialog = openDeptWeightDialog;
        //var-mrj

        init();

        function init() {
            vm.selectedRatingType = 'Supplier';
            // extended by mrj
            // pinned left nav
            vm.leftNavPined = true;
            //ext-mrj
            $scope.Math = window.Math;
            vm.lessThan = " < ";
            vm.greaterThan = " > ";
            // clearIssueType(true);
            // clearIssue(true);
            // vm.checkedIssueTypes = [];
            // vm.checkedIssues = [];
            vm.readModeIssue = false;
            // toggleField("ISSUE", true);

            commonApiService.getItems(vm, "ISSUETYPES", "issuetypes", false, function () {
                // selectIssueType(vm.issuetypes[0]);
            });
            commonApiService.getItems(vm, "ISSUES", "issues", false, function () {
                selectIssue(vm.issues[0]);
                console.log(vm.issues);
            });
        }

        function openIssueDialog(issue) {
            if (vm.issuetypes && vm.issues) {
                $mdDialog.show({
                    controller: 'AddIssueDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/systemsettings/dialogs/add-issue-dialog.html',
                    clickOutsideToClose: true,
                    locals: {
                        IssueTypes: vm.issuetypes,
                        Issues: vm.issues,
                        Issue: issue
                    }
                })
                    .then(function (dataStr) {
                        if (dataStr) {
                            var data = JSON.parse(dataStr);
                            vm.issuetypes = data.issuetypes;
                            vm.issues = data.issues;
                            commonApiService.saveItems("ISSUETYPES", vm.issuetypes);
                            commonApiService.saveItems("ISSUES", vm.issues);
                        }
                    });
            }
        }

        function openDeptWeightDialog(ratingType) {
            if (ratingType) {
                $mdDialog.show({
                    controller: 'DeptWeightDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/systemsettings/dialogs/dept-weight-dialog.html',
                    clickOutsideToClose: true,
                    locals: {
                        // IssueTypes: vm.issuetypes,
                        // Issues: vm.issues,
                        // Issue: issue
                    }
                })
                    .then(function (dataStr) {
                        if (dataStr) {
                            var data = JSON.parse(dataStr);
                            vm.issuetypes = data.issuetypes;
                            vm.issues = data.issues;
                            commonApiService.saveItems("ISSUETYPES", vm.issuetypes);
                            commonApiService.saveItems("ISSUES", vm.issues);
                        }
                    });
            }
        }
        // function toggleField(fieldName, status) {
        //   if (fieldName === "ISSUE_TYPE") {
        //     vm.toggleIssueType = status;
        //     if (!status) {
        //       clearIssueType(true);
        //     }
        //   }
        //   if (fieldName === "ISSUE") {
        //     vm.toggleIssue = status;
        //   }
        // }
        //
        // function addIssueType(issueType) {
        //   if (!vm.issuetypes) {
        //     return;
        //   }
        //
        //   var objectLength = Object.keys(issueType).length;
        //   if (objectLength < 2) {
        //     return;
        //   }
        //
        //   if (issueType.title === "" || issueType.code === "") {
        //     return;
        //   }
        //
        //   var issueTypeIndex = utilService.getIndex(vm.issuetypes, PRIMARY_COLUMN_NAME, issueType[PRIMARY_COLUMN_NAME]);
        //   if (issueTypeIndex > -1) {
        //     vm.issuetypes[issueTypeIndex] = issueType;
        //   } else {
        //     issueType[PRIMARY_COLUMN_NAME] = utilService.generateId();
        //     issueType[SERIAL_COLUMN_NAME] = vm.issuetypes.length + 1;
        //     issueType.deleted = false;
        //     vm.issuetypes.push(issueType);
        //   }
        //   commonApiService.saveItems("ISSUETYPES", vm.issuetypes);
        //   clearIssueType(true);
        //   selectIssueType(issueType);
        // }
        //
        // function updateIssueType(issueType) {
        //   vm.isNewIssueType = false;
        //   vm.issueType[PRIMARY_COLUMN_NAME] = issueType[PRIMARY_COLUMN_NAME];
        //   vm.issueType[SERIAL_COLUMN_NAME] = issueType[SERIAL_COLUMN_NAME];
        //   vm.issueType.title = issueType.title;
        //   vm.issueType.code = issueType.code;
        //   vm.issueType.deleted = issueType.deleted;
        //
        //   vm.toggleField("ISSUE_TYPE", true);
        // }
        //
        // function deleteIssueType(issueType) {
        //   var issueTypeIndex = utilService.getIndex(vm.issuetypes, PRIMARY_COLUMN_NAME, issueType.id);
        //   if (issueTypeIndex > -1) {
        //
        //     var feedback = systemSettingsValidation.issueTypeCanBeOmitted(vm.issuetypes[issueTypeIndex], vm.issues);
        //     if (!feedback.isOmittable) {
        //       utilService.showToast(feedback.reason, 'error-toast', 5000);
        //       return;
        //     }
        //
        //     vm.issuetypes[issueTypeIndex].deleted = true;
        //     commonApiService.saveItems("ISSUETYPES", vm.issuetypes);
        //   }
        //   var undeletedIssueTypeIndex = utilService.getIndex(vm.issuetypes, "deleted", false);
        //   clearIssueType(true);
        //   selectIssueType(vm.issuetypes[undeletedIssueTypeIndex]);
        // }
        //
        // function selectIssueType(issueType) {
        //   if (!issueType) {
        //     vm.selectedIssueType = undefined;
        //     return;
        //   }
        //   vm.selectedIssueType = issueType;
        // }
        //
        // function clearIssueType(isNewIssueType) {
        //   vm.issueType = {};
        //   vm.isNewIssueType = isNewIssueType;
        // }
        //
        // function checkedAllIssueTypes() {
        //   clearCheckedIssueTypes();
        //   var undeletedIssueTypes = systemUtils.getIndexes(vm.issuetypes, "deleted", false);
        //   for (var i = 0; i < undeletedIssueTypes.length; i++) {
        //     var item = {
        //       id: vm.issuetypes[undeletedIssueTypes[i]][PRIMARY_COLUMN_NAME],
        //       title: vm.issuetypes[undeletedIssueTypes[i]].title
        //     };
        //     vm.checkedIssueTypes.push(item);
        //     if (item.id === vm.issueType[PRIMARY_COLUMN_NAME]) {
        //       clearIssueType(true);
        //     }
        //     item = undefined;
        //   }
        //   vm.readModeIssue = true;
        // }
        //
        // function toggleSelectIssueType(issueType) {
        //   var index = utilService.getIndex(vm.checkedIssueTypes, "id", issueType[PRIMARY_COLUMN_NAME]);
        //   if (index > -1) {
        //     vm.checkedIssueTypes.splice(index, 1);
        //   } else {
        //     var item = {
        //       id: issueType[PRIMARY_COLUMN_NAME],
        //       title: issueType.title
        //     };
        //     vm.checkedIssueTypes.push(item);
        //     if (item.id === vm.issueType[PRIMARY_COLUMN_NAME]) {
        //       clearIssueType(true);
        //     }
        //     item = undefined;
        //   }
        //   vm.readModeIssue = vm.checkedIssueTypes.length ? true : false;
        // }
        //
        // function clearCheckedIssueTypes() {
        //   vm.checkedIssueTypes = [];
        //   vm.readModeIssue = false;
        // }
        //
        // function deleteCheckedIssueTypesDialog(event, checkedIssueTypes) {
        //   $mdDialog.show({
        //     controller: 'CommonDeleteDialogController',
        //     controllerAs: 'vm',
        //     templateUrl: 'app/main/systemsettings/dialogs/commonDelete.dialog.html',
        //     clickOutsideToClose: true,
        //     locals: {
        //       SelectedItems: checkedIssueTypes,
        //       OnDelete: deleteIssueType,
        //       ClearSelectedItems: clearCheckedIssueTypes,
        //       ItemType: checkedIssueTypes.length === 1 ? "Issue Type" : "Issue Types",
        //       event: event
        //     }
        //   });
        // }
        //
        // function addIssue(issue) {
        //   if (!vm.issues) {
        //     return;
        //   }
        //
        //   var objectLength = Object.keys(issue).length;
        //   if (objectLength < 6) {
        //     return;
        //   }
        //
        //   if (issue.title === "" || issue.code === "" || issue.scale === "" || issue.numberOfConcerns === "" || issue.classTitle === "" || issue.comparisonType === "") {
        //     return;
        //   }
        //
        //   issue.issueTypeId = issue.issueTypeId === "None" ? null : issue.issueTypeId;
        //   issue.scale = Number(issue.scale);
        //   issue.numberOfConcerns = Number(issue.numberOfConcerns);
        //
        //   if ((issue.scale < 1) || (issue.numberOfConcerns < 1)) {
        //     return;
        //   }
        //
        //   var issueIndex = utilService.getIndex(vm.issues, PRIMARY_COLUMN_NAME, issue[PRIMARY_COLUMN_NAME]);
        //   if (issueIndex > -1) {
        //     vm.issues[issueIndex] = issue;
        //   } else {
        //     issue[PRIMARY_COLUMN_NAME] = utilService.generateId();
        //     issue[SERIAL_COLUMN_NAME] = vm.issues.length + 1;
        //     issue.classes = [];
        //     issue.deleted = false;
        //     vm.issues.push(issue);
        //   }
        //   commonApiService.saveItems("ISSUES", vm.issues);
        //   clearIssue(true);
        //   selectIssue(issue);
        // }
        //
        // function updateIssue(issue) {
        //   vm.isNewIssue = false;
        //   vm.issue[PRIMARY_COLUMN_NAME] = issue[PRIMARY_COLUMN_NAME];
        //   vm.issue[SERIAL_COLUMN_NAME] = issue[SERIAL_COLUMN_NAME];
        //   vm.issue.title = issue.title;
        //   vm.issue.code = issue.code;
        //   vm.issue.issueTypeId = issue.issueTypeId;
        //   vm.issue.scale = issue.scale;
        //   vm.issue.numberOfConcerns = issue.numberOfConcerns;
        //   vm.issue.classTitle = issue.classTitle;
        //   vm.issue.comparisonType = issue.comparisonType;
        //   vm.issue.classes = issue.classes;
        //   vm.issue.deleted = issue.deleted;
        //
        //   vm.toggleField("ISSUE", true);
        // }
        //
        // function deleteIssue(issue) {
        //   var issueIndex = utilService.getIndex(vm.issues, PRIMARY_COLUMN_NAME, issue.id);
        //   if (issueIndex > -1) {
        //
        //     if (vm.issues[issueIndex].classes.length) {
        //       utilService.showToast(vm.issues[issueIndex].title + " has some rating classes", 'error-toast', 5000);
        //       return;
        //     }
        //
        //     vm.issues[issueIndex].deleted = true;
        //     commonApiService.saveItems("ISSUES", vm.issues);
        //   }
        //   var undeletedIssueIndex = utilService.getIndex(vm.issues, "deleted", false);
        //   clearIssue(true);
        //   selectIssue(vm.issues[undeletedIssueIndex]);
        // }
        //
        function selectIssue(issue) {
            if (!issue) {
                vm.selectedIssue = undefined;
                return;
            }
            var issueTypeInd = utilService.getIndex(vm.issuetypes, "TECHDISER_ID", issue.issueTypeId);
            if (issueTypeInd > -1) {
                vm.selectedIssueType = vm.issuetypes[issueTypeInd];
            }
            vm.selectedIssue = issue;
            vm.ratingClass = {};
            vm.ratingClass.impact = "P";
        }
        //
        // function clearIssue(isNewIssue) {
        //   vm.issue = {};
        //   vm.issue.numberOfConcerns = 1;
        //   vm.issue.comparisonType = "RANGE";
        //   vm.isNewIssue = isNewIssue;
        // }
        //
        // function checkedAllIssues() {
        //   clearCheckedIssues();
        //   var undeletedIssues = systemUtils.getIndexes(vm.issues, "deleted", false);
        //   for (var i = 0; i < undeletedIssues.length; i++) {
        //     var item = {
        //       id: vm.issues[undeletedIssues[i]][PRIMARY_COLUMN_NAME],
        //       title: vm.issues[undeletedIssues[i]].title
        //     };
        //     vm.checkedIssues.push(item);
        //     if (item.id === vm.issue[PRIMARY_COLUMN_NAME]) {
        //       clearIssue(true);
        //     }
        //     item = undefined;
        //   }
        // }
        //
        // function toggleSelectIssue(issue) {
        //   var index = utilService.getIndex(vm.checkedIssues, "id", issue[PRIMARY_COLUMN_NAME]);
        //   if (index > -1) {
        //     vm.checkedIssues.splice(index, 1);
        //   } else {
        //     var item = {
        //       id: issue[PRIMARY_COLUMN_NAME],
        //       title: issue.title
        //     };
        //     vm.checkedIssues.push(item);
        //     if (item.id === vm.issue[PRIMARY_COLUMN_NAME]) {
        //       clearIssue(true);
        //     }
        //     item = undefined;
        //   }
        // }
        //
        // function clearCheckedIssues() {
        //   vm.checkedIssues = [];
        // }
        //
        // function deleteCheckedIssuesDialog(event, checkedIssues) {
        //   $mdDialog.show({
        //     controller: 'CommonDeleteDialogController',
        //     controllerAs: 'vm',
        //     templateUrl: 'app/main/systemsettings/dialogs/commonDelete.dialog.html',
        //     clickOutsideToClose: true,
        //     locals: {
        //       SelectedItems: checkedIssues,
        //       OnDelete: deleteIssue,
        //       ClearSelectedItems: clearCheckedIssues,
        //       ItemType: checkedIssues.length === 1 ? "Issue" : "Issues",
        //       event: event
        //     }
        //   });
        // }

        function addRatingClass(ratingClass) {
            if (!vm.issues || !vm.issues.length || !vm.selectedIssue || !vm.selectedIssue.classes) {
                return;
            }

            if (vm.selectedIssue.comparisonType !== "BOOLEAN") {
                var objectLength = Object.keys(ratingClass).length;
                if (objectLength < 2) {
                    return;
                }
                if (!ratingClass.rating || ratingClass.rating === "" || ratingClass.impact === "") {
                    return;
                }
                ratingClass.rating = Number(ratingClass.rating);
                if ((ratingClass.rating < 1) || (ratingClass.rating > vm.selectedIssue.scale)) {
                    return;
                }
            } else if (vm.selectedIssue.comparisonType === "BOOLEAN") {
                delete ratingClass.impact;
                var objectLength = Object.keys(ratingClass).length;
                if (objectLength < 3) {
                    return;
                }
                if (!ratingClass.value || ratingClass.value === "" || !ratingClass.ratingForTrue || ratingClass.ratingForTrue === "" || !ratingClass.ratingForFalse || ratingClass.ratingForFalse === "") {
                    return;
                }
                ratingClass.ratingForTrue = Number(ratingClass.ratingForTrue);
                ratingClass.ratingForFalse = Number(ratingClass.ratingForFalse);
                if ((ratingClass.ratingForTrue < 1) || (ratingClass.ratingForTrue > vm.selectedIssue.scale) || (ratingClass.ratingForFalse < 1) || (ratingClass.ratingForFalse > vm.selectedIssue.scale)) {
                    return;
                }
            }

            if (vm.selectedIssue.comparisonType === "RANGE") {
                if (!ratingClass.value || ratingClass.value === "" || ratingClass.value === "0") {
                    ratingClass.value = null;
                } else {
                    ratingClass.value = Number(ratingClass.value);
                }
            } else if (vm.selectedIssue.comparisonType === "EQUAL") {
                var objectLength = Object.keys(ratingClass).length;
                if (objectLength < 3) {
                    return;
                }
                if (ratingClass.value === "") {
                    return;
                }
            }

            ratingClass[PRIMARY_COLUMN_NAME] = utilService.generateId();

            if (vm.selectedIssue.comparisonType === "RANGE") {
                var exists = false;
                for (var i = 0; i < vm.selectedIssue.classes.length; i++) {
                    if ((!vm.selectedIssue.classes[i].value && !ratingClass.value) || (vm.selectedIssue.classes[i].value === ratingClass.value)) {
                        vm.selectedIssue.classes[i] = angular.copy(ratingClass);
                        exists = true;
                        break;
                    }
                }

                if (!exists) {
                    vm.selectedIssue.classes.push(ratingClass);
                }

                vm.selectedIssue.classes.sort(function (a, b) { return a.value - b.value });
                var firstItem = angular.copy(vm.selectedIssue.classes[0]);
                if (!firstItem.value) {
                    vm.selectedIssue.classes.shift();
                    vm.selectedIssue.classes.push(firstItem);
                }
            } else if (vm.selectedIssue.comparisonType === "EQUAL" || vm.selectedIssue.comparisonType === "BOOLEAN") {
                vm.selectedIssue.classes.push(ratingClass);
            }

            commonApiService.saveItems("ISSUES", vm.issues);
            // selectIssue(vm.selectedIssue);
        }

        function deleteRatingClass(ratingClass) {
            var ratingClassIndex = utilService.getIndex(vm.selectedIssue.classes, PRIMARY_COLUMN_NAME, ratingClass[PRIMARY_COLUMN_NAME]);
            if (ratingClassIndex > -1) {
                vm.selectedIssue.classes.splice(ratingClassIndex, 1);
                commonApiService.saveItems("ISSUES", vm.issues);
                // selectIssue(vm.selectedIssue);
            }
        }
    }
})();
