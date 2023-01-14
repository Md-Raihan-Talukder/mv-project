(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .directive('tdContentEditable', ContentEditable);

    /** @ngInject */
    function ContentEditable() {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, element, attrs, ngModel) {

                function read() {
                    // view -> model
                    var html = element.html();
                    html = html.replace(/&nbsp;/g, "\u00a0");
                    ngModel.$setViewValue(html);
                }
                // model -> view
                ngModel.$render = function () {
                    element.html(ngModel.$viewValue || "");
                };

                element.bind("blur", function () {
                    scope.$apply(read);
                });
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        this.blur();
                        event.preventDefault();
                    }
                });
            }
        };
    }
})();
