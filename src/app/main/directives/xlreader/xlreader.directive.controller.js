(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('XlReaderDirectiveController', XlReaderDirectiveController);

    /** @ngInject */
    function XlReaderDirectiveController($scope, $timeout) {
        var vm = this;

        init();

        function init() {
            $timeout(function () {
                var xlf = document.getElementById('xlf');
                xlf.addEventListener('change', handleFile, false);
            });
        }

        function handleFile(e) {
            vm.data = [[]];
            var files = e.target.files;
            var i, f;


            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                var name = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;

                    var workbook = XLSX.read(data, { type: 'binary' });
                    var first_sheet_name = workbook.SheetNames[0];
                    var worksheet = workbook.Sheets[first_sheet_name];

                    //var json = XLSX.utils.sheet_to_json(worksheet);
                    //var json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                    //var json = XLSX.utils.sheet_to_json(worksheet, {raw: true});

                    //console.log(json);

                    vm.data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    creatHtmlTable();

                };

                reader.readAsBinaryString(f);
            }
        }

        function creatHtmlTable() {
            $scope.xlData = vm.data;

            var txt = "<table>";
            txt += "<thead>";
            for (var i = 0; i < 1; i++) {
                txt += "<tr>";
                for (var j = 0; j < vm.data[i].length; j++) {
                    txt += "<th>" + vm.data[i][j] + "</th>";
                }
                txt += "</tr>";
            }

            txt += "</thead>";

            txt += "<tbody>";

            for (var i = 1; i < vm.data.length; i++) {
                txt += "<tr>";
                for (var j = 0; j < vm.data[i].length; j++) {
                    txt += "<td>" + vm.data[i][j] + "</td>";
                }
                txt += "</tr>";
            }

            txt += "<tbody>";

            txt += "</table>";

            document.getElementById("xl-table-container").innerHTML = txt;


        }


    }

})();