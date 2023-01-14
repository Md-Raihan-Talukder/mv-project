(function () {
    'use strict';

    angular
        .module('app.tasks.todo')
        .controller('TodoController', TodoController);

    /** @ngInject */
    function TodoController($scope, $mdMenu, CONSTANT_DATE_TIME_FORMATS, utilService, $document, $mdDialog, $mdSidenav, listItemService, Tags, Categories, $state, Status) {
        var vm = this;
        vm.taskType = $state.params.type;

        // Data

        vm.allTasks = [];
        vm.tags = Tags.data.data;
        vm.categories = Categories.data.data;
        vm.status = Status.data.data;

        vm.completed = [];
        vm.pos = [];
        vm.buyers = [];
        vm.styles = [];

        vm.selectedFilter = {
            filter: 'Start Date',
            dueDate: 'Next 3 days'
        };

        // Tasks will be filtered against these models
        vm.taskFilters = {
            search: '',
            tags: [],
            completed: '',
            deleted: false,
            important: '',
            starred: '',
            startDate: '',
            dueDate: ''
        };
        vm.taskFiltersDefaults = angular.copy(vm.taskFilters);
        vm.showAllTasks = true;

        vm.taskOrder = '';
        vm.taskOrderDescending = false;

        vm.sortableOptions = {
            handle: '.handle',
            forceFallback: true,
            ghostClass: 'todo-item-placeholder',
            fallbackClass: 'todo-item-ghost',
            fallbackOnBody: true,
            sort: true,
            onUpdate: function (ev) {
                var ev = ev;
            }
        };
        vm.msScrollOptions = {
            suppressScrollX: true
        };

        vm.po = {};
        vm.style = {};
        vm.buyer = {};
        vm.category = {};
        vm.filter = {};
        vm.tag = {};
        vm.showOptions = {
            status: true,
            location: false
        }

        vm.currentPage = 0;
        vm.pageSize = 5;

        // Methods
        vm.preventDefault = preventDefault;
        vm.openTaskDialog = openTaskDialog;
        vm.toggleCompleted = toggleCompleted;
        vm.toggleSidenav = toggleSidenav;
        vm.toggleFilter = toggleFilter;
        vm.toggleFilterWithEmpty = toggleFilterWithEmpty;
        vm.filterByStartDate = filterByStartDate;
        vm.filterByDueDate = filterByDueDate;
        vm.resetFilters = resetFilters;
        vm.toggleTagFilter = toggleTagFilter;
        vm.isTagFilterExists = isTagFilterExists;
        vm.toggleCategory = toggleCategory;
        vm.getAllItems = getAllItems;
        vm.formateDate = formateDate;
        vm.expandColupseDetail = expandColupseDetail;
        vm.addNewTag = addNewTag;
        vm.getPoRelatedInfos = getPoRelatedInfos;
        vm.togglePorelatedInfo = togglePorelatedInfo;
        vm.isSameDate = isSameDate;
        vm.poQuerySearch = poQuerySearch;
        vm.styleQuerySearch = styleQuerySearch;
        vm.buyerQuerySearch = buyerQuerySearch;
        vm.onSave = onSave;
        vm.onDelete = onDelete;
        vm.closeMenu = closeMenu;

        vm.getAllItems();
        vm.getPoRelatedInfos();
        showHideOptions();
        //////////

        function closeMenu() {
            $mdMenu.hide();
        }

        function onSave(task, isNew) {
            if (isNew) {
                vm.allTasks.push(task);
                return;
            }

            var index = getTaskIndex(task);
            if (index >= 0) {
                vm.allTasks[index] = task;
                addPropertyForFilter(vm.allTasks[index]);
            }
        }

        function getTaskIndex(task) {
            for (var i = 0; i < vm.allTasks.length; i++) {
                if (vm.allTasks[i].id === task.id) {
                    return i;
                }
            }

            return -1;
        }

        function onDelete(task) {
            var index = getTaskIndex(task);
            if (task.deleted) {
                if (index >= 0) {
                    vm.allTasks[index].deleted = false;
                    addPropertyForFilter(vm.allTasks[index]);
                }
                return;
            }

            var confirm = $mdDialog.confirm()
                .title('Are you sure?')
                .content('The item will be deleted.')
                .ariaLabel('Delete Task')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(event);


            $mdDialog.show(confirm).then(function () {
                if (index >= 0) {
                    vm.allTasks[index].deleted = true;
                    addPropertyForFilter(vm.allTasks[index]);
                    //vm.allTasks.splice(index, 1);
                }

            }, function () {
                // Cancel Action
            });


        }

        function buyerQuerySearch(query) {

            return query ? vm.buyers.filter(createFilterFor(query, "name")) : [];
        }

        function styleQuerySearch(query) {

            return query ? vm.styles.filter(createFilterFor(query, "styleNo")) : [];
        }

        function poQuerySearch(query) {

            return query ? vm.pos.filter(createFilterFor(query, "poNo")) : [];
        }

        function memberQuerySearch(query) {
            return query ? vm.members.filter(createFilterFor(query)) : [];
        }

        function labelQuerySearch(query) {
            return query ? vm.labels.filter(createFilterFor(query)) : [];
        }

        function createFilterFor(query, property) {
            var lowercaseQuery = angular.lowercase(query);
            var prp = property;
            return function filterFn(item) {
                return angular.lowercase(item[prp]).indexOf(lowercaseQuery) >= 0;
            };
        }


        function showHideOptions() {
            switch (vm.taskType) {
                case 'task':
                    vm.showOptions = {
                        status: true,
                        dateTime: true,
                        showDuePolicy: true,
                        showRepeat: true,
                        category: true
                    }
                    break;
                case 'event':
                case 'meeting':
                    vm.showOptions = {
                        location: true,
                        allDaySchedue: true,
                        showRepeat: true,
                        showDuePolicy: true,
                        dateTime: true,
                        attendees: true,
                    }
                    break;
                case 'issue':
                    vm.showOptions = {
                        status: true,
                        reason: true,
                        dateTime: true,
                        resolutionplan: true,
                        tasks: true
                    }
                    break;

                case 'troubleshooting':
                    vm.showOptions = {
                        reason: true,
                        resolutionplan: true
                    }
                    break;

                default:
                    break;
            }
        }


        function isSameDate(task) {
            if (!task.schedule.startDateTime || !task.schedule.endDateTime) {
                return false;
            }

            var startDate = task.schedule.startDateTime.split(CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR)[0];
            var endDate = task.schedule.endDateTime.split(CONSTANT_DATE_TIME_FORMATS.CONSTANT_DATE_TIME_SEPARATOR)[0];

            return startDate === endDate;

        }

        function togglePorelatedInfo(type, item) {
            getAllTask();

            if (vm.selectedstatus === item.id) {
                vm.selectedstatus = false;
                return;
            }

            vm.tasks = $.grep(vm.tasks, function (task) {
                return task[type].id === item.id;
            });

            vm.selectedstatus = item.id;
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

        vm.members = [
            {
                "id": "56027c1930450d8bf7b10758",
                "name": "Alice Freeman",
                "avatar": "assets/images/avatars/alice.jpg",
                "company": "Saois",
                "jobTitle": "Digital Archivist"
            },
            {
                "id": "26027s1930450d8bf7b10828",
                "name": "Danielle Obrien",
                "avatar": "assets/images/avatars/danielle.jpg",
                "company": "Saois",
                "jobTitle": "Digital Archivist"
            },
            {
                "id": "76027g1930450d8bf7b10958",
                "name": "James Lewis",
                "avatar": "assets/images/avatars/james.jpg",
                "company": "Saois",
                "jobTitle": "Digital Archivist"
            },
            {
                "id": "36027j1930450d8bf7b10158",
                "name": "Vincent Munoz",
                "avatar": "assets/images/avatars/vincent.jpg",
                "company": "Saois",
                "jobTitle": "Digital Archivist"
            }
        ];


        function addNewTag(name) {
            var folder = {
                "id": vm.tags.length + 1,
                "name": name,
                "label": name,
                "color": "md-blue-grey-600-bg"
            }

            vm.tags.push(folder);

        }

        function expandColupseDetail(type) {
            vm[type].expandDetail = !vm[type].expandDetail;
        }

        function formateDate(date, timeRequired) {
            var dateTime = utilService.convertToDateTime(date);
            var format;
            if (timeRequired) {
                format = "dd.MM.yyyy hh:mm tt";
            }

            return utilService.formatDateValue(dateTime, format);
        }

        /**
         * Initialize the controller
         */
        function init() {
            getAllTask();

            angular.forEach(vm.tasks, function (task) {
                addPropertyForFilter(task);

            });

            switch (vm.taskType) {
                case 'task':
                    vm.allTaskTitle = "All Tasks";
                    vm.pageTitle = "Tasks";
                    break;
                case 'event':
                    vm.allTaskTitle = "All Events";
                    vm.pageTitle = "Events";
                    break;
                case 'meeting':
                    vm.allTaskTitle = "All Meetings";
                    vm.pageTitle = "Meetings";
                    break;
                case 'issue':
                    vm.allTaskTitle = "All Issues";
                    vm.pageTitle = "Issues";
                    break;
                case 'risk':
                    vm.allTaskTitle = "All Risks";
                    vm.pageTitle = "Risks";
                    break;
                case 'troubleshooting':
                    vm.allTaskTitle = "All Troubleshooting";
                    vm.pageTitle = "Troubleshooting";
                    break;
                default:
                    break;
            }
        }

        function addPropertyForFilter(task) {

            task.startDate = task.schedule.startDateTime ? utilService.convertToDateTime(task.schedule.startDateTime) : "";
            task.endDate = task.schedule.endDateTime ? utilService.convertToDateTime(task.schedule.endDateTime) : "";

            if (task.startDate) {
                task.startDateStr = utilService.formatDateValue(task.startDate);
                task.startTimeStr = utilService.formatDateValue(task.startDate, 'hh:mm tt');
            }

            if (task.endDate) {
                task.endDateStr = utilService.formatDateValue(task.endDate);
                task.endTimeStr = utilService.formatDateValue(task.endDate, 'hh:mm tt');
            }


        }

        function getMethodName() {
            switch (vm.taskType) {
                case 'task':
                case 'event':
                case 'meeting':
                case 'issue':
                case 'risk':
                case 'troubleshooting':
                    return 'tasks.json';
                default:
                    break;
            }
        }

        function getServiceName() {
            switch (vm.taskType) {
                case 'task':
                    return 'todo';
                case 'event':
                    return 'event';
                case 'meeting':
                    return 'meeting';
                case 'issue':
                    return 'issue';
                case 'risk':
                    return 'risk';
                case 'troubleshooting':
                    return 'troubleshooting';

                default:
                    break;
            }
        }

        function getAllItems() {
            listItemService.getListItems(getServiceName(), getMethodName())
                .success(function (response) {
                    vm.allTasks = response.data;
                    init();
                })
                .error(function (err) {

                });
        }

        function toggleCategory(category) {
            getAllTask(true);
            if (vm.selectedCategory === category.id) {
                vm.selectedCategory = false;
                return;
            }
            vm.tasks = $.grep(vm.tasks, function (task) {
                if (category.id === 6) {
                    return !task.category || task.category.id === category.id;
                }

                return task.category.id === category.id;
            });
            vm.selectedCategory = category.id;
        }

        function filterBySelectedCategory() {

            if (!vm.selectedCategory) {
                return;
            }

            vm.tasks = $.grep(vm.tasks, function (task) {
                if (vm.selectedCategory === 6) {
                    return !task.category || task.category.id === vm.selectedCategory;
                }
                return task.category.id === vm.selectedCategory;
            });

        }



        /**
         * Prevent default
         *
         * @param e
         */
        function preventDefault(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        /**
         * Open new task dialog
         *
         * @param ev
         * @param task
         */
        function openTaskDialog(ev, task) {
            $mdDialog.show({
                controller: 'TaskDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/tasks/todo/dialogs/task/task-dialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Task: task,
                    TaskType: vm.taskType,
                    Tags: vm.tags,
                    Members: vm.members,
                    Categories: vm.categories,
                    ShowOptions: vm.showOptions,
                    Status: vm.status,
                    OnSave: vm.onSave,
                    OnDelete: vm.onDelete,
                    event: ev
                }
            });
        }

        /**
         * Toggle completed status of the task
         *
         * @param task
         * @param event
         */
        function toggleCompleted(task, event) {
            event.stopPropagation();
            task.completed = !task.completed;
        }

        /**
         * Toggle sidenav
         *
         * @param sidenavId
         */
        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

        /**
         * Toggles filter with true or false
         *
         * @param filter
         */
        function toggleFilter(filter) {
            vm.taskFilters[filter] = !vm.taskFilters[filter];

            checkFilters();
        }

        /**
         * Toggles filter with true or empty string
         * @param filter
         */
        function toggleFilterWithEmpty(filter) {
            if (vm.taskFilters[filter] === '') {
                vm.taskFilters[filter] = true;
            }
            else {
                vm.taskFilters[filter] = '';
            }

            checkFilters();
        }

        /**
         * Reset filters
         */
        function resetFilters() {
            getAllTask();
            vm.selectedCategory = false;
            vm.selectedstatus = false;
            vm.showAllTasks = true;
            vm.taskFilters = angular.copy(vm.taskFiltersDefaults);
        }

        function getAllTask(donotFilter) {

            vm.eventSelected = false;
            vm.meetingSelected = false;
            vm.tasks = vm.allTasks;
            if (!donotFilter) {
                filterBySelectedCategory();
            }
        }

        /**
         * Check filters and mark showAllTasks
         * as true if no filters selected
         */
        function checkFilters() {
            vm.showAllTasks = !!angular.equals(vm.taskFiltersDefaults, vm.taskFilters);
        }

        /**
         * Filter by startDate
         *
         * @param item
         * @returns {boolean}
         */
        function filterByStartDate(item) {
            if (vm.taskFilters.startDate === true) {
                var startDate = utilService.convertToDateTime(item.schedule.startDateTime);
                if (!startDate) {
                    return false;
                }

                var day = startDate.getDate(),
                    month = startDate.getMonth() + 1,
                    year = startDate.getYear();

                var currentDate = new Date(),
                    currentDay = currentDate.getDate(),
                    currentMonth = currentDate.getMonth() + 1,
                    currentYear = currentDate.getYear();

                return (day === currentDay && month === currentMonth && year === currentYear);
            }

            return true;
        }

        /**
         * Filter Due Date
         *
         * @param item
         * @returns {boolean}
         */
        function filterByDueDate(item) {
            if (vm.taskFilters.dueDate === true) {
                return !(item.schedule.startDateTime === null || item.schedule.startDateTime === 0);
            }

            return true;
        }

        /**
         * Toggles tag filter
         *
         * @param tag
         */
        function toggleTagFilter(tag) {
            var i = vm.taskFilters.tags.indexOf(tag);

            if (i > -1) {
                vm.taskFilters.tags.splice(i, 1);
            }
            else {
                vm.taskFilters.tags.push(tag);
            }

            checkFilters();
        }

        /**
         * Returns if tag exists in the tagsFilter
         *
         * @param tag
         * @returns {boolean}
         */
        function isTagFilterExists(tag) {
            return vm.taskFilters.tags.indexOf(tag) > -1;
        }
    }
})();