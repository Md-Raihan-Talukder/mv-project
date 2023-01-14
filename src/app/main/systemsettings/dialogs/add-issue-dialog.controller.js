(function () {
    'use strict';

    angular
        .module('app.systemsettings')
        .controller('AddIssueDialogController', AddIssueDialogController);

    /** @ngInject */
    function AddIssueDialogController(commonApiService, utilService, systemUtils, $mdDialog, systemSettingsValidation, PRIMARY_COLUMN_NAME, SERIAL_COLUMN_NAME, IssueTypes, Issues,
        Issue) {
        var vm = this;
        vm.closeDialog = closeDialog;
        vm.exists = systemUtils.exists;
        vm.addIssueType = addIssueType;
        vm.updateIssueType = updateIssueType;
        vm.selectIssueType = selectIssueType;
        vm.clearIssueType = clearIssueType;
        vm.toggleSelectIssueType = toggleSelectIssueType;
        vm.clearCheckedIssueTypes = clearCheckedIssueTypes;
        vm.checkedAllIssueTypes = checkedAllIssueTypes;
        vm.deleteCheckedIssueTypes = deleteCheckedIssueTypesDialog;

        vm.addIssue = addIssue;
        vm.updateIssue = updateIssue;
        vm.selectIssue = selectIssue;
        vm.clearIssue = clearIssue;
        vm.toggleSelectIssue = toggleSelectIssue;
        vm.clearCheckedIssues = clearCheckedIssues;
        vm.checkedAllIssues = checkedAllIssues;
        vm.deleteCheckedIssues = deleteCheckedIssuesDialog;

        vm.isNewIssue = true;
        vm.issuetypes = angular.copy(IssueTypes);
        console.log(IssueTypes);
        vm.issues = angular.copy(Issues);
        vm.saveIssueAndType = saveIssueAndType;
        vm.selectApplicableDepts = selectApplicableDepts;
        vm.checkDeptExist = checkDeptExist;
        init();
        function init() {
            vm.sortableOptions = {
                handle: '.handle',
                forceFallback: true,
                ghostClass: 'td-item-placeholder',
                fallbackClass: 'td-item-ghost',
                fallbackOnBody: true,
                sort: true,
                onUpdate: function (ev) {
                    var ev = ev;
                }
            };
            if (Issue) {
                vm.isNewIssue = false;
                vm.issue = angular.copy(Issue);
            }
            clearIssueType(true);
            vm.checkedIssueTypes = [];
            vm.checkedIssues = [];
            vm.readModeIssue = false;
            commonApiService.getItems(vm, "ORG_DEPARTMENTS", "departments", false);
        }

        function selectApplicableDepts(iss, divId) {
            if (iss && divId) {
                if (!iss.ApplicableDepartments) {
                    iss.ApplicableDepartments = [];
                }
                var divInd = iss.ApplicableDepartments.indexOf(divId);
                if (divInd > -1) {
                    iss.ApplicableDepartments.splice(divInd, 1);
                }
                else {
                    iss.ApplicableDepartments.push(divId);
                }

            }
        }

        function checkDeptExist(iss, divId) {
            if (iss && divId) {
                if (!iss.ApplicableDepartments) {
                    return;
                }
                else {
                    var divInd = iss.ApplicableDepartments.indexOf(divId);
                    if (divInd > -1) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
        }

        function addIssueType(issueType) {
            if (!vm.issuetypes) {
                return;
            }

            var objectLength = Object.keys(issueType).length;
            if (objectLength < 2) {
                return;
            }

            if (issueType.title === "" || issueType.code === "") {
                return;
            }

            var issueTypeIndex = utilService.getIndex(vm.issuetypes, PRIMARY_COLUMN_NAME, issueType[PRIMARY_COLUMN_NAME]);
            if (issueTypeIndex > -1) {
                vm.issuetypes[issueTypeIndex] = issueType;
            } else {
                issueType[PRIMARY_COLUMN_NAME] = utilService.generateId();
                issueType[SERIAL_COLUMN_NAME] = vm.issuetypes.length + 1;
                issueType.deleted = false;
                vm.issuetypes.push(issueType);
            }
            commonApiService.saveItems("ISSUETYPES", vm.issuetypes);
            clearIssueType(true);
            selectIssueType(issueType);
            vm.issueType = {};
        }

        function updateIssueType(issueType) {
            if (issueType) {
                vm.isNewIssueType = false;
                vm.issueType[PRIMARY_COLUMN_NAME] = issueType[PRIMARY_COLUMN_NAME];
                vm.issueType[SERIAL_COLUMN_NAME] = issueType[SERIAL_COLUMN_NAME];
                vm.issueType.title = issueType.title;
                vm.issueType.code = issueType.code;
                vm.issueType.deleted = issueType.deleted;

                vm.toggleField("ISSUE_TYPE", true);
            }
        }

        function deleteIssueType(issueType) {
            if (issueType) {
                var issueTypeIndex = utilService.getIndex(vm.issuetypes, PRIMARY_COLUMN_NAME, issueType.id);
                if (issueTypeIndex > -1) {

                    var feedback = systemSettingsValidation.issueTypeCanBeOmitted(vm.issuetypes[issueTypeIndex], vm.issues);
                    if (!feedback.isOmittable) {
                        utilService.showToast(feedback.reason, 'error-toast', 5000);
                        return;
                    }

                    vm.issuetypes[issueTypeIndex].deleted = true;
                    commonApiService.saveItems("ISSUETYPES", vm.issuetypes);
                }
                var undeletedIssueTypeIndex = utilService.getIndex(vm.issuetypes, "deleted", false);
                clearIssueType(true);
                selectIssueType(vm.issuetypes[undeletedIssueTypeIndex]);
            }
        }

        function selectIssueType(issueType) {
            if (!issueType) {
                vm.selectedIssueType = undefined;
                vm.issueType = {};
                return;
            }
            vm.isNewIssueType = false;
            vm.issueType = angular.copy(issueType);
            vm.selectedIssueType = issueType;
        }

        function clearIssueType(isNewIssueType) {
            vm.issueType = {};
            vm.isNewIssueType = isNewIssueType;
        }

        function checkedAllIssueTypes() {
            clearCheckedIssueTypes();
            var undeletedIssueTypes = systemUtils.getIndexes(vm.issuetypes, "deleted", false);
            for (var i = 0; i < undeletedIssueTypes.length; i++) {
                var item = {
                    id: vm.issuetypes[undeletedIssueTypes[i]][PRIMARY_COLUMN_NAME],
                    title: vm.issuetypes[undeletedIssueTypes[i]].title
                };
                vm.checkedIssueTypes.push(item);
                if (item.id === vm.issueType[PRIMARY_COLUMN_NAME]) {
                    clearIssueType(true);
                }
                item = undefined;
            }
            vm.readModeIssue = true;
        }

        function toggleSelectIssueType(issueType) {
            if (issueType) {
                var index = utilService.getIndex(vm.checkedIssueTypes, "id", issueType[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    vm.checkedIssueTypes.splice(index, 1);
                } else {
                    var item = {
                        id: issueType[PRIMARY_COLUMN_NAME],
                        title: issueType.title
                    };
                    vm.checkedIssueTypes.push(item);
                    if (item.id === vm.issueType[PRIMARY_COLUMN_NAME]) {
                        clearIssueType(true);
                    }
                    item = undefined;
                }
                vm.readModeIssue = vm.checkedIssueTypes.length ? true : false;
            }
        }

        function clearCheckedIssueTypes() {
            vm.checkedIssueTypes = [];
            vm.readModeIssue = false;
        }

        function deleteCheckedIssueTypesDialog(event, checkedIssueTypes) {
            if (checkedIssueTypes) {
                $mdDialog.show({
                    controller: 'CommonDeleteDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/systemsettings/dialogs/commonDelete.dialog.html',
                    clickOutsideToClose: true,
                    locals: {
                        SelectedItems: checkedIssueTypes,
                        OnDelete: deleteIssueType,
                        ClearSelectedItems: clearCheckedIssueTypes,
                        ItemType: checkedIssueTypes.length === 1 ? "Issue Type" : "Issue Types",
                        event: event
                    }
                });
            }
        }

        //ISSUE
        function addIssue(issue) {
            if (!vm.issues) {
                return;
            }

            var objectLength = Object.keys(issue).length;
            if (objectLength < 6) {
                return;
            }

            if (issue.title === "" || issue.code === "" || issue.scale === "" || issue.numberOfConcerns === "" || issue.classTitle === "" || issue.comparisonType === "") {
                return;
            }

            issue.issueTypeId = issue.issueTypeId === "None" ? null : issue.issueTypeId;
            issue.scale = Number(issue.scale);
            issue.numberOfConcerns = Number(issue.numberOfConcerns);

            if ((issue.scale < 1) || (issue.numberOfConcerns < 1)) {
                return;
            }

            var issueIndex = utilService.getIndex(vm.issues, PRIMARY_COLUMN_NAME, issue[PRIMARY_COLUMN_NAME]);
            if (issueIndex > -1) {
                vm.issues[issueIndex] = issue;
            } else {
                issue[PRIMARY_COLUMN_NAME] = utilService.generateId();
                issue[SERIAL_COLUMN_NAME] = vm.issues.length + 1;
                issue.classes = [];
                issue.deleted = false;
                vm.issues.push(issue);
            }
            commonApiService.saveItems("ISSUES", vm.issues);
            clearIssue(true);
            selectIssue(issue);
            vm.issue = {};
        }

        function updateIssue(issue) {
            if (issue && vm.issues.length > 0) {
                var issueIndex = utilService.getIndex(vm.issues, PRIMARY_COLUMN_NAME, issue.TECHDISER_ID);
                if (issueIndex > -1) {
                    vm.issues[issueIndex] = issue;
                }
                // vm.isNewIssue = false;
                // vm.issue[PRIMARY_COLUMN_NAME] = issue[PRIMARY_COLUMN_NAME];
                // vm.issue[SERIAL_COLUMN_NAME] = issue[SERIAL_COLUMN_NAME];
                // vm.issue.title = issue.title;
                // vm.issue.code = issue.code;
                // vm.issue.issueTypeId = issue.issueTypeId;
                // vm.issue.scale = issue.scale;
                // vm.issue.numberOfConcerns = issue.numberOfConcerns;
                // vm.issue.classTitle = issue.classTitle;
                // vm.issue.comparisonType = issue.comparisonType;
                // vm.issue.classes = issue.classes;
                // vm.issue.deleted = issue.deleted;
            }
        }

        function deleteIssue(issue) {
            if (issue) {
                var issueIndex = utilService.getIndex(vm.issues, PRIMARY_COLUMN_NAME, issue.id);
                if (issueIndex > -1) {

                    if (vm.issues[issueIndex].classes.length) {
                        utilService.showToast(vm.issues[issueIndex].title + " has some rating classes", 'error-toast', 5000);
                        return;
                    }

                    vm.issues[issueIndex].deleted = true;
                    commonApiService.saveItems("ISSUES", vm.issues);
                }
                var undeletedIssueIndex = utilService.getIndex(vm.issues, "deleted", false);
                clearIssue(true);
                selectIssue(vm.issues[undeletedIssueIndex]);
            }
        }

        function selectIssue(issue) {
            if (!issue) {
                vm.selectedIssue = undefined;
                return;
            }
            vm.selectedIssue = issue;

            vm.issue = angular.copy(issue);
            vm.ratingClass = {};
            vm.ratingClass.impact = "P";
        }

        function clearIssue(isNewIssue) {
            vm.issue = {};
            vm.issue.numberOfConcerns = 1;
            vm.issue.comparisonType = "RANGE";
            vm.isNewIssue = isNewIssue;
        }

        function checkedAllIssues() {
            clearCheckedIssues();
            var undeletedIssues = systemUtils.getIndexes(vm.issues, "deleted", false);
            for (var i = 0; i < undeletedIssues.length; i++) {
                var item = {
                    id: vm.issues[undeletedIssues[i]][PRIMARY_COLUMN_NAME],
                    title: vm.issues[undeletedIssues[i]].title
                };
                vm.checkedIssues.push(item);
                if (item.id === vm.issue[PRIMARY_COLUMN_NAME]) {
                    clearIssue(true);
                }
                item = undefined;
            }
        }

        function toggleSelectIssue(issue) {
            if (issue) {
                var index = utilService.getIndex(vm.checkedIssues, "id", issue[PRIMARY_COLUMN_NAME]);
                if (index > -1) {
                    vm.checkedIssues.splice(index, 1);
                } else {
                    var item = {
                        id: issue[PRIMARY_COLUMN_NAME],
                        title: issue.title
                    };
                    vm.checkedIssues.push(item);
                    if (item.id === vm.issue[PRIMARY_COLUMN_NAME]) {
                        clearIssue(true);
                    }
                    item = undefined;
                }
            }
        }

        function clearCheckedIssues() {
            vm.checkedIssues = [];
        }

        function deleteCheckedIssuesDialog(event, checkedIssues) {
            if (checkedIssues) {
                $mdDialog.show({
                    controller: 'CommonDeleteDialogController',
                    controllerAs: 'vm',
                    templateUrl: 'app/main/systemsettings/dialogs/commonDelete.dialog.html',
                    clickOutsideToClose: true,
                    locals: {
                        SelectedItems: checkedIssues,
                        OnDelete: deleteIssue,
                        ClearSelectedItems: clearCheckedIssues,
                        ItemType: checkedIssues.length === 1 ? "Issue" : "Issues",
                        event: event
                    }
                });
            }

        }

        function saveIssueAndType(type) {
            if (vm.issue && type === 'A') {
                addIssue(vm.issue);
            }
            else if (vm.issue && type === 'U') {
                updateIssue(vm.issue);
            }
            var data = {
                "issuetypes": vm.issuetypes,
                "issues": vm.issues
            }
            var dataStr = JSON.stringify(data);
            $mdDialog.hide(dataStr);
        }

        function closeDialog() {
            $mdDialog.hide();
        }
    }
})();
