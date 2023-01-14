
(function () {
    'use strict';

    angular
        .module('app.common')
        .filter('startFrom', startFrom)
        .filter('evaluateExpression', evaluateExpression)
        .filter('unsafeHtml', unsafeHtml);

    /** @ngInject */
    function unsafeHtml($sce) {
        return function (text) {
            return $sce.trustAsHtml(text.toString());
        };
    }

    /** @ngInject */
    function startFrom() {
        return function (input, start) {
            start = +start * 1;
            return input.slice(start);
        }
    }

    /** @ngInject */
    function evaluateExpression() {
        return function (cols, row, rowIndex, rows, evaluate) {
            // for (var i = 0; i < cols.length; i++) {
            //     if(cols[i].type==='numeric' || cols[i].type==='date'){   
            //         row[cols[i].data]= evaluate(row, cols[i], rowIndex, rows);                      
            //     }else if(cols[i].type ==='index' ){
            //         row[cols[i].data]= rowIndex + 1;
            //     }
            // }

            return cols;
        }
    }

})();