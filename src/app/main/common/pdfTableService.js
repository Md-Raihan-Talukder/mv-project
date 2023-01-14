(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('pdfTableService', pdfTableService);

    /** @ngInject */
    function pdfTableService(utilService, banglaFontService, PRIMARY_COLUMN_NAME) {

        var service = {
            createTableDef: createTableDef
        };

        function createTableDef(col, dataSet) {
            var hasGroup = hasGroupColumn(col);

            var headerCols = hasGroup ? createGroupHeaderCols(col) : createHeaderCols(col);

            var tableBody = [];
            tableBody.push(headerCols);


            if (hasGroup) {
                tableBody.push(createGroupSubHeaderCols(col));
            }

            var data = getRegisterData(dataSet, col);

            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    //for (var j = 0; j < 50; j++) {
                    var val = hasGroup ? getGroupColumnTableData(col, data[i], dataSet) : getTableData(col, data[i]);
                    tableBody.push(val);
                    // }

                }
            }

            // tableBody = [
            //    [{image: writeRotatedText('I am rotated'), fit:[7,53], alignment: 'center'}]
            //   ];

            var table = {
                headerRows: hasGroup ? 2 : 1,
                widths: hasGroup ? getGroupColumnTableColumnWidth(col) : getTableColumnWidth(col),
                body: tableBody
            }

            return table;
        }

        function hasGroupColumn(col) {
            for (var i = 0; i < col.columns.length; i++) {
                if (col.columns[i].type === 'group') {
                    return true;
                }
                if (col.columns[i].type === 'register' && col.columns[i].displayType === 'all') {
                    return true;
                }
            }
        }

        function createHeaderCols(col) {
            var headerCols = [];

            for (var i = 0; i < col.columns.length; i++) {
                if (col.columns[i].show) {
                    // headerCols.push({ text:  col.columns[i].title, style: 'tableHeader', 
                    // fillColor : '#ddd' });
                    var alignment = col.columns[i].allignment ? col.columns[i].allignment : 'left';
                    headerCols.push({
                        text: banglaFontService.arrangeText(getTitle(col.columns[i])), alignment: alignment,
                        margin: [2, 0]
                    });

                }
            }

            return headerCols;
        }

        function createGroupHeaderCols(col) {

            var headerCols = [];

            for (var i = 0; i < col.columns.length; i++) {
                if (col.columns[i].show) {
                    if (col.columns[i].type === 'group') {
                        if (col.columns[i].columns && col.columns[i].columns.length) {

                            headerCols.push({
                                text: banglaFontService.arrangeText(getTitle(col.columns[i])),
                                colSpan: col.columns[i].columns.length,
                                alignment: 'center'
                            });

                            for (var j = 0; j < col.columns[i].columns.length - 1; j++) {
                                headerCols.push({});
                            }

                        }

                    } else {//nongroup

                        if (!hasColumnInGroup(col.columns, col.columns[i])) {

                            if (col.columns[i].type === 'register' && col.columns[i].displayType === 'all') {

                                var alignment = col.columns[i].allignment ? col.columns[i].allignment : 'center';
                                headerCols.push({
                                    text: banglaFontService.arrangeText(getTitle(col.columns[i])), alignment: alignment,
                                    margin: [2, 0]
                                });

                            } else {

                                var alignment = col.columns[i].allignment ? col.columns[i].allignment : 'center';
                                headerCols.push({
                                    text: banglaFontService.arrangeText(getTitle(col.columns[i])), rowSpan: 2,
                                    margin: [2, 10, 2, 0], alignment: alignment
                                });
                            }

                        }

                    }
                }
            }


            return headerCols;
        }

        function getTitle(column) {
            var title = column.displayTitle && column.displayTitle.length ?
                column.displayTitle : column.title;
            return title;
        }

        function createGroupSubHeaderCols(col) {

            var headerCols = [];

            for (var i = 0; i < col.columns.length; i++) {
                if (col.columns[i].show) {
                    if (col.columns[i].type === 'group') {
                        if (col.columns[i].columns && col.columns[i].columns.length) {

                            for (var j = 0; j < col.columns[i].columns.length; j++) {
                                var columnOfGroup = getColumnOfGroup(col.columns, col.columns[i].columns[j]);
                                if (columnOfGroup) {
                                    headerCols.push({ text: banglaFontService.arrangeText(getTitle(columnOfGroup)), margin: [5, 0] });
                                }
                            }

                        }

                    } else {//nongroup

                        if (!hasColumnInGroup(col.columns, col.columns[i])) {
                            if (col.columns[i].type === 'register' && col.columns[i].displayType === 'all') {

                                var body = [], cols = [], widths = [];
                                var visibleColumns = $.grep(col.columns[i].columns, function (col) {
                                    return col.show;
                                })

                                for (var j = 0; j < visibleColumns.length; j++) {
                                    var alignment = visibleColumns[j].allignment ? visibleColumns[j].allignment : 'center';
                                    var rightBorder = j < visibleColumns.length - 1;
                                    cols.push({
                                        text: banglaFontService.arrangeText(getTitle(visibleColumns[j])),
                                        alignment: alignment,
                                        border: [false, false, rightBorder, false]
                                    });
                                }

                                body.push(cols);

                                for (var j = 0; j < visibleColumns.length; j++) {
                                    var width = (visibleColumns[j].width) ? visibleColumns[j].width * 1 : "*";
                                    widths.push(width);
                                }


                                var table = {
                                    widths: widths,
                                    body: body
                                }

                                headerCols.push({ table: table });

                            } else {
                                headerCols.push({ text: '' });
                            }

                        }

                    }
                }
            }


            return headerCols;
        }

        function getColumnOfGroup(columns, dataProp) {
            var index = utilService.getIndex(columns, 'data', dataProp);
            if (index >= 0) {
                return columns[index];
            }
        }

        function hasColumnInGroup(columns, column) {
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].type === 'group' && columns[i].columns && columns[i].columns.length) {
                    return columns[i].columns.indexOf(column.data) > -1;
                }
            }

        }

        function getRegisterData(dataSet, col, keyProp) {
            var prop = keyProp || 'selectedTableId';
            if (dataSet && dataSet.length) {
                var index = utilService.getIndex(dataSet, 'key', col[prop]);
                if (index >= 0) {
                    return dataSet[index].value;
                }
            }
        }

        function getGroupColumnTableColumnWidth(col) {
            var widths = [];

            for (var i = 0; i < col.columns.length; i++) {
                if (col.columns[i].show) {
                    if (col.columns[i].type === 'group') {
                        if (col.columns[i].columns && col.columns[i].columns.length) {
                            for (var j = 0; j < col.columns[i].columns.length; j++) {
                                var columnOfGroup = getColumnOfGroup(col.columns, col.columns[i].columns[j]);
                                if (columnOfGroup) {
                                    var width = (columnOfGroup.width) ? columnOfGroup.width * 1 : "*";
                                    widths.push(width);
                                }
                            }

                        }

                    } else {//nongroup                            

                        if (!hasColumnInGroup(col.columns, col.columns[i])) {
                            var width = (col.columns[i].width) ? col.columns[i].width * 1 : "*";
                            widths.push(width);
                        }

                    }
                }
            }

            return widths;
        }

        function getTableColumnWidth(col) {
            var widths = [];
            for (var i = 0; i < col.columns.length; i++) {
                if (col.columns[i].show) {
                    var width = (col.columns[i].width) ? col.columns[i].width * 1 : "*";
                    widths.push(width);
                }
            }

            return widths;
        }

        function getTableData(col, data, forList, border) {
            var bodyCols = [];

            for (var i = 0; i < col.columns.length; i++) {
                if (col.columns[i].show) {
                    var val = data[col.columns[i].data] ? data[col.columns[i].data] : '';
                    if (forList) {
                        bodyCols.push(banglaFontService.arrangeText(val));
                    } else {
                        var alignment = col.columns[i].allignment ? col.columns[i].allignment : 'left';

                        var cel = { text: banglaFontService.arrangeText(val), margin: [2, 0], alignment: alignment };
                        if (border) {
                            cel.border = border;
                        }

                        bodyCols.push(cel);
                    }
                }
            }

            return bodyCols;
        }

        function getGroupColumnTableData(col, data, dataSet) {
            var bodyCols = [];

            for (var i = 0; i < col.columns.length; i++) {
                if (col.columns[i].show) {
                    if (col.columns[i].type === 'group') {
                        if (col.columns[i].columns && col.columns[i].columns.length) {
                            for (var j = 0; j < col.columns[i].columns.length; j++) {
                                var columnOfGroup = getColumnOfGroup(col.columns, col.columns[i].columns[j]);
                                if (columnOfGroup) {
                                    var alignment = columnOfGroup.allignment ? columnOfGroup.allignment : 'left';
                                    var val = data[columnOfGroup.data] ? data[columnOfGroup.data] : '';
                                    bodyCols.push({ text: banglaFontService.arrangeText(val), margin: [2, 0], alignment: alignment });
                                }
                            }

                        }

                    } else {//nongroup                            

                        if (!hasColumnInGroup(col.columns, col.columns[i])) {
                            if (col.columns[i].type === 'register' && col.columns[i].displayType === 'all') {
                                var table = getInnerTableData(col.columns[i], dataSet, data[PRIMARY_COLUMN_NAME]);
                                if (table) {
                                    bodyCols.push({ table: table });
                                } else {
                                    bodyCols.push({ text: '' });
                                }


                            } else {
                                var alignment = col.columns[i].allignment ? col.columns[i].allignment : 'left';
                                var val = data[col.columns[i].data] ? data[col.columns[i].data] : '';
                                bodyCols.push({ text: banglaFontService.arrangeText(val), margin: [2, 0], alignment: alignment });
                            }
                        }

                    }
                }
            }


            return bodyCols;
        }

        function getInnerTableData(col, dataSet, rowId) {
            var body = [], widths = [];
            var data = getRegisterData(dataSet, col, 'registerId');
            if (!data || !data.length) { return; }

            data = $.grep(data, function (dt) {
                return dt.parentId === rowId;
            })

            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    // [false, false, false, true]         
                    var val = getTableData(col, data[i], false);
                    body.push(val);
                }
            } else {
                return;
            }

            var visibleColumns = $.grep(col.columns, function (col) {
                return col.show;
            });


            for (var j = 0; j < visibleColumns.length; j++) {
                var width = (visibleColumns[j].width) ? visibleColumns[j].width * 1 : "*";
                widths.push(width);
            }

            var table = {
                widths: widths,
                body: body
            }

            return table;
        }


        function writeRotatedText(text) {
            var ctx, canvas = document.createElement('canvas');
            // I am using predefined dimensions so either make this part of the arguments or change at will 
            canvas.width = 36;
            canvas.height = 270;
            ctx = canvas.getContext('2d');
            ctx.font = '36pt Arial';
            ctx.save();
            ctx.translate(36, 270);
            ctx.rotate(-0.5 * Math.PI);
            ctx.fillStyle = '#000';
            ctx.fillText(text, 0, 0);
            ctx.restore();
            return canvas.toDataURL();
        };


        return service;
    }
})();