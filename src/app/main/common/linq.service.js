(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('linqService', linqService);

    /** @ngInject */
    function linqService() {

        var service = {
            aggregate: aggregate,
            aggregateColumns: aggregateColumns,
            groupAndAggregate: groupAndAggregate,
        };

        function groupAndAggregate(data, groups, columns) {
            var result = Enumerable.From(data)
                .GroupBy(
                    createKeySelector(groups),
                    null,
                    createResultSelector(groups, columns),
                    createCompareSelector(groups)
                ).ToArray();

            return result;
        }

        function createCompareSelector(groups) {
            var keySelector = [];
            for (var i = 0; i < groups.length; i++) {
                keySelector.push("$.");
                keySelector.push(groups[i]);
                if (i < groups.length - 1) {
                    keySelector.push("+ ' ' +");
                }
            }

            return keySelector.join('');
        }


        function createResultSelector(groups, columns) {
            var resultSelector = createKeySelector(groups, true);
            resultSelector.push(", ");
            for (var i = 0; i < columns.length; i++) {
                resultSelector.push(columns[i].data);
                resultSelector.push(" : $$.");
                resultSelector.push(columns[i].type);
                resultSelector.push("('parseInt($.");
                resultSelector.push(columns[i].data);
                resultSelector.push(")')");

                if (i < columns.length - 1) {
                    resultSelector.push(", ");
                }
            }

            resultSelector.push('}');

            return resultSelector.join('');
        }

        function createKeySelector(groups, resultSelector) {
            var keySelector = ['{'];
            for (var i = 0; i < groups.length; i++) {
                keySelector.push(groups[i]);
                keySelector.push(' : $.');
                keySelector.push(groups[i]);

                if (i < groups.length - 1) {
                    keySelector.push(', ');
                }
            }

            if (resultSelector) {
                return keySelector;
            }

            keySelector.push('}');

            return keySelector.join('');
        }


        function aggregateColumns(data, columns) {
            var item = {};
            for (var i = 0; i < columns.length; i++) {
                item[columns[i].data] = aggregate(data, columns[i].data, columns[i].type);
            }

            return item;
        }


        function aggregate(data, columnName, type) {
            var expr = 'parseInt($.' + columnName + ')';
            return Enumerable.From(data)[type](expr);
        }

        return service;
    }
})();