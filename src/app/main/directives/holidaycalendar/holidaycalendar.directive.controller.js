(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('HolidayCaledarDirectiveController', HolidayCaledarDirectiveController);

    /** @ngInject */

    function HolidayCaledarDirectiveController($scope, $timeout, utilService, CONSTANT_DATE_TIME_FORMATS, $mdDialog, $document) {
        var vm = this;

        vm.eventSources = [
            [

            ]
        ];
        vm.dayRender = dayRender;

        vm.calendarUiConfig = {
            calendar: {
                allDaySlot: true,
                editable: false,
                eventLimit: true,
                header: '',
                handleWindowResize: true,
                aspectRatio: 1,
                dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                eventDurationEditable: false,
                viewRender: function (view) {
                    vm.calendarView = view;
                    vm.calendar = vm.calendarView.calendar;
                    vm.currentMonthShort = vm.calendar.getDate().format('MMM');
                    vm.currentYearMonth = vm.calendar.getDate().format('YYYY-MM');
                    vm.currentYearMonthDate = vm.calendar.getDate();

                    addDayClickEvent(true);
                },
                columnFormat: {
                    month: 'ddd',
                    week: 'ddd D',
                    day: 'ddd M'
                },
                eventClick: eventDetail,
                selectable: true,
                selectHelper: true,
                select: select,
                dayRender: vm.dayRender
                // eventRender: function(event, element) {
                //         element.append( '<span class="remove-event"> <i class="icon-close-circle"></i> </span>');


                //         element.find(".remove-event").click(function() {

                //             var index = getEventIndex(event.id);
                //             if(index>=0){
                //                 vm.eventSources[0].splice(index, 1);
                //             }

                //         });
                //     }  
            }
        };

        //////////////////////////////

        vm.addDayClickEvent = addDayClickEvent;
        vm.showWeekEndDialog = showWeekEndDialog;
        vm.getEvents = getEvents;
        vm.formatDate = formatDate;
        vm.deleteEvent = deleteEvent;

        function formatDate(date, format, covertToDate) {
            if (covertToDate) {
                date = new Date(date);
            }

            return utilService.formatDateValue(date, format);
        }


        function getEvents(weekend) {

            var events = $.grep(vm.eventSources[0], function (event) {
                if (weekend) {
                    if (event.title === "Weekend") {
                        return true;
                    }
                } else {
                    if (event.title !== "Weekend") {
                        return true;
                    }
                }

            });

            return events;

        }

        function getEventIndex(eventId) {
            for (var i = 0; i < vm.eventSources[0].length; i++) {
                if (vm.eventSources[0][i].id === eventId) {
                    return i;
                }
            }

            return -1;
        }


        function addDayClickEvent(add) {

            $timeout(function () {
                var element = $('.holiday-calendar .fc-day-header').css("cursor", "pointer");
                if (add) {
                    element.off("click").on('click', function (ev) {
                        showWeekEndDialog($(ev.target).text(), ev);
                    });
                } else {
                    element.off('click');
                }

            }, 1000);

        }

        function showWeekEndDialog(dayName, ev) {

            var dialogData = {
                dayName: dayName,
                currentYearMonth: vm.currentYearMonth,
                eventSources: vm.eventSources,
                onSave: saveEvent
            };

            showDialog(dialogData, ev);
        }

        function select(start, end, e) {
            showEventFormDialog(start, end, e);
        }

        function showEventFormDialog(start, end, ev) {
            var dialogData = {
                start: start,
                end: end,
                currentYearMonth: vm.currentYearMonth,
                onSave: saveEvent
            };

            showDialog(dialogData, ev);
        }

        function showDialog(dialogData, ev) {
            dialogData.currentYearMonthDate = vm.currentYearMonthDate;

            $mdDialog.show({
                controller: 'WeekEndDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/directives/holidaycalendar/weekenddialog.html',
                parent: angular.element($document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    dialogData: dialogData
                }
            }).then(function (response) {

            });
        }


        function dayRender(date, cell) {


            var events = getEventsOfDay(date);

            if (events.length) {
                if (events[0].title === 'Weekend') {
                    cell.addClass("md-red-200-bg pos-absolute");
                } else {
                    cell.addClass("md-purple-100-bg");
                }
            }

        }

        function getEventsOfDay(currentDate) {

            var events = $.grep(vm.eventSources[0], function (event) {

                var start = new Date(event.start);
                var end = new Date(event.end);

                if (currentDate >= start && currentDate <= end) {
                    return true;
                }

            });

            return events;

        }

        function saveEvent(data) {
            var events = data.days;
            vm.show = false;
            for (var i = 0; i < events.length; i++) {
                if (!events[i].isNew) {
                    var index = getEventIndex(events[i].id);
                    if (index >= 0) {
                        vm.eventSources[0].splice(index, 1);
                    }
                }

                vm.eventSources[0].push(events[i]);
            }


            $timeout(function () {
                vm.show = true;
                if (events.length === 1 && events[0].title !== 'Weekend') {
                    $timeout(function () {
                        vm.calendar.gotoDate(data.selectedDate);
                    });
                }
            });

        }

        function deleteEvent(data) {

            var eventId = data.eventId;


            var confirm = $mdDialog.confirm()
                .title('Are you sure?')
                .content('The item will be deleted.')
                .ariaLabel('Delete Task')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(event);


            $mdDialog.show(confirm).then(function () {
                var index = getEventIndex(eventId);
                if (index >= 0) {
                    vm.eventSources[0].splice(index, 1);
                    if (!data.selectedDate) {
                        return;
                    }

                    vm.show = false;

                    $timeout(function () {
                        vm.show = true;
                        $timeout(function () {


                            vm.calendar.gotoDate(data.selectedDate);
                        });
                    });
                }

            }, function () {
                // Cancel Action
            });

        }


        function eventDetail(calendarEvent, ev) {

            var dialogData = {
                start: calendarEvent.start._d,
                end: calendarEvent.end._d,
                currentYearMonth: vm.currentYearMonth,
                calendarEvent: calendarEvent,
                onSave: saveEvent,
                onDelete: deleteEvent
            };

            showDialog(dialogData, ev);

        }


    }

})();
