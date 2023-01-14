(function () {
    'use strict';

    angular
        .module('app.tasks.todo')
        .controller('TaskDialogController', TaskDialogController);

    /** @ngInject */
    function TaskDialogController($mdMenu, utilService, $document, $mdDialog,
        fuseTheming, fuseGenerator, msUtils, Task, TaskType, Tags,
        Members, Categories, ShowOptions, Status, OnSave, OnDelete) {
        var vm = this;
        vm.isNew = false;
        vm.task = angular.copy(Task);
        vm.onSave = OnSave;
        vm.onDelete = OnDelete;
        vm.taskType = TaskType;
        vm.tags = Tags;
        vm.members = Members;
        vm.categories = Categories;
        vm.showOptions = ShowOptions;
        vm.statuses = Status;

        if (!vm.task) {

            switch (vm.taskType) {
                case 'task':
                    vm.task = createNewTask();
                    break;
                case 'issue':
                    vm.task = createNewIssue();
                    break;
                case 'event':
                case 'meeting':
                    vm.task = createNewEvent();
                    break;
                default:
                    break;
            }
        }

        vm.checkListDirective = {

            onAddItem: function (item) {
                var index = vm.task.checklist.indexOf(item.checkList)
                if (index >= 0) {
                    vm.task.checklist[index].checkItems.push(item.newCheckItem);
                    return true;
                }
            },
            onRemoveItem: function (item) {
                var index = vm.task.checklist.indexOf(item.checkList)
                if (index >= 0) {
                    var itemIndex = vm.task.checklist[index].checkItems.indexOf(item.newCheckItem);
                    if (itemIndex >= 0) {
                        vm.task.checklist[index].checkItems.splice(itemIndex, 1);
                        return true;
                    }
                }

            },
            onRemoveCheckList: function (item) {
                var index = vm.task.checklist.indexOf(item)
                if (index >= 0) {
                    vm.task.checklist.splice(index, 1);
                    return true;
                }
            }
        }

        vm.notesDirective = {
            onAddItem: function (item) {
                vm.task.notes.unshift(item);
            },
            onRemoveItem: function (item) {
                var index = vm.task.notes.indexOf(item);
                if (index >= 0) {
                    vm.task.notes.splice(index, 1);
                    return true;
                }
            }
        };

        vm.commentsDirective = {
            onAddItem: function (item) {
                vm.task.comments.unshift(item);
            },
            onRemoveItem: function (item) {
                var index = vm.task.comments.indexOf(item);
                if (index >= 0) {
                    vm.task.comments.splice(index, 1);
                    return true;
                }
            }
        };

        vm.remindersDirective = {
            onAddItem: function (item) {
                vm.task.reminders.unshift(item);
            },
            onRemoveItem: function (item) {
                var index = vm.task.reminders.indexOf(item);
                if (index >= 0) {
                    vm.task.reminders.splice(index, 1);
                    return true;
                }
            }
        };

        vm.attachmentsDirective = {
            onAddItem: function (item) {
                vm.task.attachments.unshift(item);
            },
            onRemoveItem: function (item) {
                var index = vm.task.attachments.indexOf(item);
                if (index >= 0) {
                    vm.task.attachments.splice(index, 1);
                    return true;
                }
            }
        };

        vm.activityDirective = {
            onAddItem: function (item) {
                vm.task.activities.unshift(item);
            },
            onRemoveItem: function (item) {
                var index = vm.task.activities.indexOf(item);
                if (index >= 0) {
                    vm.task.activities.splice(index, 1);
                    return true;
                }
            }
        };

        vm.subTaskDirective = {
            onAddItem: function (item) {
                if (!vm.task.tasks) {
                    vm.task.tasks = []
                }
                vm.task.tasks.unshift(item);
            },
            onRemoveItem: function (item) {
                if (!vm.task.tasks) {
                    vm.task.tasks = []
                }
                var index = vm.task.tasks.indexOf(item);
                if (index >= 0) {
                    vm.task.tasks.splice(index, 1);
                    return true;
                }
            }
        };

        ////////
        vm.closeMenu = closeMenu;
        vm.closeDialog = closeDialog;
        vm.filterLabel = filterLabel;
        vm.filterMember = filterMember;
        vm.hasTag = hasTag;
        vm.hasMember = hasMember;
        vm.hasAttendees = hasAttendees;
        vm.toggleTag = toggleTag;
        vm.labelQuerySearch = labelQuerySearch;
        vm.toggleMember = toggleMember;
        vm.toggleAttendees = toggleAttendees;
        vm.memberQuerySearch = memberQuerySearch;
        vm.createCheckList = createCheckList;
        vm.markAsDone = markAsDone;
        vm.setTaskStatus = setTaskStatus

        vm.poQuerySearch = poQuerySearch;
        vm.styleQuerySearch = styleQuerySearch;
        vm.buyerQuerySearch = buyerQuerySearch;
        vm.saveTask = saveTask;
        vm.deleteTask = deleteTask;
        vm.getMeberTitle = getMeberTitle;

        getPoRelatedInfos();

        ////////


        function getMeberTitle() {
            switch (vm.taskType) {
                case 'task':
                case 'issue':
                case 'task':
                    return "Responsible Person"
                case 'event':
                case 'meeting':
                    return "Participants"
                    break;
                default:
                    break;
            }
        }

        function deleteTask() {
            $mdDialog.hide();
            vm.onDelete(vm.task);
        }

        function saveTask() {
            $mdDialog.hide();
            vm.onSave(vm.task, vm.isNew);
        }

        function getPoRelatedInfos() {
            vm.pos = [
                {
                    id: 'po-1',
                    poNo: 'P-01235',
                    styleNo: 'S-46895',
                    buyer: 'M&H'
                },
                {
                    id: 'po-2',
                    poNo: 'P-4589',
                    styleNo: 'S-8765',
                    buyer: 'Addidas'
                },
                {
                    id: 'po-3',
                    poNo: 'P-18545',
                    styleNo: 'S-93215',
                    buyer: 'Li&Fung'
                }
            ];

            vm.styles = [
                {
                    id: 's-1',
                    styleNo: 'S-46895',
                    buyer: 'M&H'
                },
                {
                    id: 's-2',
                    styleNo: 'S-8765',
                    buyer: 'Addidas'
                },
                {
                    id: 's-3',
                    styleNo: 'S-93215',
                    buyer: 'Li&Fung'
                }
            ];

            vm.buyers = [
                {
                    id: "5725a680b3249760ea21de5",
                    name: "Abbott",
                    avatar: "assets/images/avatars/Abbott.jpg",
                    company: "Saois",
                    jobTitle: "Digital Archivist"
                },
                {
                    id: "5725a680b3249760ea21de52",
                    name: "Abbott",
                    avatar: "assets/images/avatars/Arnold.jpg",
                    company: "Saois",
                    jobTitle: "Digital Archivist"
                },
                {
                    id: "5725a680b3249760ea21de53",
                    name: "Abbott",
                    avatar: "assets/images/avatars/Barrera.jpg",
                    company: "Saois",
                    jobTitle: "Digital Archivist"
                },

            ];
        }

        function buyerQuerySearch(query) {

            return query ? vm.buyers.filter(createFilterForPo(query, "name")) : [];
        }

        function styleQuerySearch(query) {

            return query ? vm.styles.filter(createFilterForPo(query, "styleNo")) : [];
        }

        function poQuerySearch(query) {

            return query ? vm.pos.filter(createFilterForPo(query, "poNo")) : [];
        }

        function createFilterForPo(query, property) {
            var lowercaseQuery = angular.lowercase(query);
            var prp = property;
            return function filterFn(item) {
                return angular.lowercase(item[prp]).indexOf(lowercaseQuery) >= 0;
            };
        }



        function setTaskStatus(status) {
            vm.task.status = status;
        }
        function markAsDone() {
            vm.task.completed = !vm.task.completed;
            vm.task.completed ? vm.task.status = 'done' : vm.task.status = 'pending';
        }

        function createCheckList(name) {
            var chkList = {
                "name": name,
                "id": msUtils.guidGenerator(),
                "checkItemsChecked": 0,
                "checkItems": [
                ]

            }

            vm.task.checklist.push(chkList);
        }

        function createNewIssue() {
            vm.isNew = true;
            return {
                "id": msUtils.guidGenerator(),
                "title": "",
                "description": "",
                "location": "",
                "completed": false,
                "starred": false,
                "important": false,
                "deleted": false,
                "tags": [],
                "members": [],
                "attendees": [],
                "tasks": [],
                "checklist": [
                    {
                        "id": msUtils.guidGenerator(),
                        "name": "Learnings",
                        "checkItemsChecked": 0,
                        "readOnly": true,
                        "checkItems": [
                        ]
                    }
                ],
                "attachments": [],
                "notes": [],
                "comments": [],
                "activities": [],
                "reminders": [],
                "schedule": {
                    "startDateTime": "",
                    "endDateTime": "",
                    "timeRequired": false,
                    "recurringOptions": {
                        "isRecurring": false,
                        "recurringMode": "weekly",
                        "repeatEvery": 1,
                        "recurringValues": [1],
                        "recurringDays": [],
                        "isAllDay": false
                    },
                    "duePolicy": {
                        "due": {
                            "delayType": "before",
                            "delayAmount": 1,
                            "timeType": "day",
                            "phase": "startDate"
                        },
                        "overDue": {
                            "delayType": "after",
                            "delayAmount": 1,
                            "timeType": "day",
                            "phase": "endDate"
                        },
                        "longPending": {
                            "delayType": "after",
                            "delayAmount": 15,
                            "timeType": "day",
                            "phase": "endDate"
                        }
                    }
                }
            };
        }

        function createNewEvent() {
            vm.isNew = true;
            return {
                "id": msUtils.guidGenerator(),
                "title": "",
                "description": "",
                "location": "",
                "completed": false,
                "starred": false,
                "important": false,
                "deleted": false,
                "tags": [],
                "members": [],
                "attendees": [],
                "checklist": vm.taskType === "event" ? [] : [
                    {
                        "id": msUtils.guidGenerator(),
                        "name": "Agendas",
                        "checkItemsChecked": 0,
                        "readOnly": true,
                        "checkItems": [
                        ]
                    },
                    {
                        "id": msUtils.guidGenerator(),
                        "name": "Decisions",
                        "checkItemsChecked": 0,
                        "readOnly": true,
                        "checkItems": [
                        ]
                    }
                ],
                "attachments": [],
                "notes": [],
                "comments": [],
                "activities": [],
                "reminders": [],
                "schedule": {
                    "startDateTime": "",
                    "endDateTime": "",
                    "timeRequired": true,
                    "recurringOptions": {
                        "isRecurring": false,
                        "recurringMode": "weekly",
                        "repeatEvery": 1,
                        "recurringValues": [1],
                        "recurringDays": [],
                        "isAllDay": false
                    },
                    "duePolicy": {
                        "due": {
                            "delayType": "before",
                            "delayAmount": 1,
                            "timeType": "day",
                            "phase": "startDate"
                        },
                        "overDue": {
                            "delayType": "after",
                            "delayAmount": 1,
                            "timeType": "day",
                            "phase": "endDate"
                        },
                        "longPending": {
                            "delayType": "after",
                            "delayAmount": 15,
                            "timeType": "day",
                            "phase": "endDate"
                        }
                    }
                }
            };
        }

        function createNewTask() {
            vm.isNew = true;
            return {
                "id": msUtils.guidGenerator(),
                "title": "",
                "description": "",
                "status": {
                    "id": 1,
                    "name": "Not Due",
                    "color": ""
                },
                "poNo": "",
                "styleNo": "",
                "buyer": "",
                "completed": false,
                "starred": false,
                "important": false,
                "category": 6,
                "deleted": false,
                "tags": [],
                "members": [],
                "checklist": [
                    {
                        "id": msUtils.guidGenerator(),
                        "name": "Checklist",
                        "checkItemsChecked": 0,
                        "checkItems": [
                        ]
                    }
                ],
                "attachments": [],
                "notes": [],
                "comments": [],
                "activities": [],
                "reminders": [],
                "schedule": {
                    "startDateTime": "",
                    "endDateTime": "",
                    "timeRequired": true,
                    "recurringOptions": {
                        "isRecurring": false,
                        "recurringMode": "weekly",
                        "repeatEvery": 1,
                        "recurringValues": [1],
                        "recurringDays": []
                    },
                    "duePolicy": {
                        "due": {
                            "delayType": "before",
                            "delayAmount": 1,
                            "timeType": "day",
                            "phase": "startDate"
                        },
                        "overDue": {
                            "delayType": "after",
                            "delayAmount": 1,
                            "timeType": "day",
                            "phase": "endDate"
                        },
                        "longPending": {
                            "delayType": "after",
                            "delayAmount": 15,
                            "timeType": "day",
                            "phase": "endDate"
                        }
                    }
                }
            };
        }

        function memberQuerySearch(query) {
            return query ? vm.members.filter(createFilterFor(query)) : [];
        }

        function labelQuerySearch(query) {
            return query ? vm.tags.filter(createFilterFor(query)) : [];
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return angular.lowercase(item.name).indexOf(lowercaseQuery) >= 0;
            };
        }

        function toggleTag(tag) {
            var index = getTagIndex(tag);
            if (index >= 0) {
                vm.task.tags.splice(index, 1);
            } else {
                vm.task.tags.push(tag);
            }

        }

        function toggleMember(member) {
            var index = getMemberIndex(member);
            if (index >= 0) {
                vm.task.members.splice(index, 1);
            } else {
                vm.task.members.push(member);
            }
        }

        function toggleAttendees(member) {
            var index = getMemberIndex(member, true);
            if (index >= 0) {
                vm.task.attendees.splice(index, 1);
            } else {
                vm.task.attendees.push(member);
            }
        }



        function getMemberIndex(member, attendees) {
            var members = vm.task.members;
            if (attendees) {
                members = vm.task.attendees;
            }
            for (var i = 0; i < members.length; i++) {
                if (member.id === members[i].id) {
                    return i;
                }
            }
            return -1;
        }

        function getTagIndex(tag) {
            for (var i = 0; i < vm.task.tags.length; i++) {
                if (tag.id === vm.task.tags[i].id) {
                    return i;
                }
            }
            return -1;
        }

        function hasMember(member) {
            var items = $.grep(vm.task.members, function (item) {
                return item.id === member.id;
            })
            return items.length > 0;
        }

        function hasAttendees(member) {
            var items = $.grep(vm.task.attendees, function (item) {
                return item.id === member.id;
            })
            return items.length > 0;
        }

        function hasTag(tag) {
            var tags = $.grep(vm.task.tags, function (item) {
                return item.id === tag.id;
            })
            return tags.length > 0;
        }

        function filterMember(member) {
            if (!vm.memberSearchText || vm.memberSearchText === '') {
                return true;
            }

            return angular.lowercase(member.name).indexOf(angular.lowercase(vm.memberSearchText)) >= 0;
        }

        function filterLabel(label) {
            if (!vm.labelSearchText || vm.labelSearchText === '') {
                return true;
            }

            return angular.lowercase(label.name).indexOf(angular.lowercase(vm.labelSearchText)) >= 0;
        }

        function closeMenu() {
            $mdMenu.hide();
        }

        function closeDialog() {
            $mdDialog.hide();
        }


    }
})();