
(function () {
    'use strict';

    angular
        .module('app.common')
        .filter('startFrom', startFrom)
        .filter('evaluateExpression', evaluateExpression)
        .filter('picker', picker)
        .filter('unsafeHtml', unsafeHtml)
        .filter('toArray', toArray);


    /** @ngInject */

    function toArray() {
        return function (obj) {
            if (!(obj instanceof Object)) {
                return obj;
            }

            return Object.keys(obj).map(function (key) {
                return Object.defineProperty(obj[key], '$key', { __proto__: null, value: key });
            });
        }
    }


    /** @ngInject */
    function unsafeHtml($sce) {
        return function (text) {
            if (text) {
                return $sce.trustAsHtml(text.toString());
            }
        };
    }

    /** @ngInject */
    function picker($filter) {
        return function (value, filterName) {
            return $filter(filterName)(value);
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