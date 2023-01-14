(function () {
    'use strict';

    angular
        .module('app.common')
        .directive('msbExpandCollapse', msbExpandCollapse);

    /** @ngInject */
    function msbExpandCollapse() {
        return {
            restrict: 'EA',
            scope: { isInActive: '=' },
            link: function (scope, element, attrs) {

                $(element).find('.msb-collapse-header').click(function (e) {

                    e.preventDefault();
                    e.stopPropagation();

                    if (scope.isInActive) {
                        return;
                    }

                    $(element).find(" > .msb-collapse-content").slideToggle('200', function () {
                        $(element).find(' > .msb-collapse-header').find(".icon").toggleClass('icon-chevron-right icon-chevron-down');
                    });

                    // if(attrs.type === "collapse-other"){
                    //   if($(element).find(".msb-collapse-content:visible").length>1) { 
                    //       // You may toggle + - icon           		    //$(this).parent().find("span.faqMinus").removeClass('faqMinus').addClass('faqPlus');
                    //      $(element).siblings().find(".msb-collapse-content").slideUp('slow');	
                    //   }
                    // }

                });

            }

        }
    }

})();