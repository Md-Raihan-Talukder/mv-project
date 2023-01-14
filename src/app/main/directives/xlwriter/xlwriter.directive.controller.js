(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('XlWriterDirectiveController', XlWriterDirectiveController);

    /** @ngInject */
    function XlWriterDirectiveController($scope) {
        var vm = this;
        vm.downLoad = downLoad;
        init();

        function init() {

        }

        function datenum(v, date1904) {
            if (date1904) v += 1462;
            var epoch = Date.parse(v);
            return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
        }

        function sheet_from_array_of_arrays(data, opts) {
            //example of merge {s:{r:0,c:0},e:{r:1,c:0}} /* A1:A2 */

            var ws = {
                "!merges": [
                    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
                    { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } },
                    { s: { r: 0, c: 4 }, e: { r: 0, c: 5 } }
                ]
            };

            var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
            for (var R = 0; R != data.length; ++R) {
                for (var C = 0; C != data[R].length; ++C) {
                    if (range.s.r > R) range.s.r = R;
                    if (range.s.c > C) range.s.c = C;
                    if (range.e.r < R) range.e.r = R;
                    if (range.e.c < C) range.e.c = C;
                    var cell = { v: data[R][C] };
                    if (cell.v == null) continue;
                    var cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

                    if (typeof cell.v === 'number') cell.t = 'n';
                    else if (typeof cell.v === 'boolean') cell.t = 'b';
                    else if (cell.v instanceof Date) {
                        cell.t = 'n'; cell.z = XLSX.SSF._table[14];
                        cell.v = datenum(cell.v);
                    }
                    else cell.t = 's';

                    ws[cell_ref] = cell;
                }
            }
            if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);

            return ws;
        }

        function Workbook() {
            if (!(this instanceof Workbook)) return new Workbook();
            this.SheetNames = [];
            this.Sheets = {};
        }

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        function downLoad() {
            if (!$scope.xlData) {
                return;
            }

            //var data = $scope.xlData;

            //var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]];
            var data = [
                ["H1", "H11", "H2", "H22", "H3", "H33"],
                ["Sh1", "Sh2", "Sh3", "Sh4", "Sh5", "Sh6"],
                ["v1", "v2", "v3", "v4", "v5", 5],
                ["v11", "v12", "v13", "v14", "v15", 7]
            ];
            var ws_name = "SheetJS";
            var wb = new Workbook();


            var ws = sheet_from_array_of_arrays(data);

            wb.SheetNames.push(ws_name);
            wb.Sheets[ws_name] = ws;

            /******** How to merge***************/
            // https://github.com/SheetJS/js-xlsx/issues/416#issuecomment-286932882
            /***********************/

            var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

            saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), "test.xlsx")

        }


        function saveText() {
            var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
            saveAs(blob, "hello world.txt");
        }

    }

})();