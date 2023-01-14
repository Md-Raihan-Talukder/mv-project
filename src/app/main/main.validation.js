(function () {
    'use strict';

    angular
        .module('tech-diser')
        .directive('compareTo', compareTo)
        .directive('validateDate', validateDate)
        .directive('ngRightClick', rightClick)
        .directive('myScroller', myScroller);

    /** @ngInject */
    function rightClick($parse) {
        return function (scope, element, attrs) {
            var fn = $parse(attrs.ngRightClick);
            element.bind('contextmenu', function (event) {
                scope.$apply(function () {
                    event.preventDefault();
                    fn(scope, { $event: event });
                });
            });
        };
    }

    function myScroller() {
        return {
            restrict: 'A',
            scope: {
                callback: '&onScroll',
            },
            link: function (scope, elem, attrs) {
                $(elem).on('scroll', function (evt) {
                    if (scope.callback) {
                        scope.callback({ evt: evt });
                    }
                });
            }
        }
    }

    /** @ngInject */
    function compareTo() {
        return {
            require: "ngModel",
            scope: {
                otherModelValue: "=compareTo"
            },
            link: function (scope, element, attributes, ngModel) {

                ngModel.$validators.compareTo = function (modelValue) {
                    return modelValue == scope.otherModelValue;
                };
                scope.$watch("otherModelValue", function () {
                    ngModel.$validate();
                });

            }
        };
    }

    /** @ngInject */
    function validateDate(dateTimeService) {
        return {
            scope: {
                ngModel: "="
            },
            link: function (scope, element, attributes, ngModel) {
                scope.$watch("ngModel", function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        var dateTime = new Date(dateTimeService.convertToDateTime(scope.ngModel, true, true));
                        if (!dateTimeService.isDateObj(dateTime)) {
                            scope.ngModel = oldValue ? oldValue : dateTimeService.formatDateValue(new Date());
                        }
                    }
                });
            }
        };
    }



})();