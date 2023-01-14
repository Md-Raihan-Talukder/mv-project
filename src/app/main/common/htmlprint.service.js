(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('htmlPrintService', htmlPrintService);

    /** @ngInject */
    function htmlPrintService(utilService) {
        var printPageTemplate;

        var service = {
            createDefinition: createDefinition
        };

        function createDefinition(data, dataObject, dataSet) {

            printPageTemplate = $('<div id="print-template"></div>');

            createContentsHtml(data, dataObject, dataSet);
            return printPageTemplate;
        }

        function addPage(pageNo, settings) {

            printPageTemplate.append(getPrintTemplateHtml(pageNo));

            var currentPage = $('#page-' + pageNo, printPageTemplate);
            var itemsContainer = $('.print-page-content-items', currentPage);

            return itemsContainer;
        }

        function createContentsHtml(data, dataObject, dataSet) {
            var pageNo = 1;
            var itemsContainer = addPage(pageNo);
            var header = $('.print-page-header-items', itemsContainer);
            var body = $('.print-page-body-items', itemsContainer);
            var footer = $('.print-page-footer-items', itemsContainer);

            var contentItem = createRows(data, dataObject, dataSet);
            body.append(contentItem);
        }

        function createRows(data, dataObject, dataSet) {
            var rowsHtml = '<table cellpadding="0" cellspacing="0" style="width: 100%; table-layout: fixed;">';

            for (var i = 0; i < data.rows.length; i++) {
                rowsHtml += createRow(data.rows[i], dataObject, dataSet);
            }

            rowsHtml += '</table>';

            return rowsHtml;
        }

        function createHSegments(column, dataObject, dataSet) {
            var html = '';
            for (var i = 0; i < column.hSegments.length; i++) {
                html += createHSegment(column.hSegments[i], dataObject, dataSet);
            }
            return html;
        }

        function createHSegment(hSegment, dataObject, dataSet) {
            var html = '<table cellpadding="0" cellspacing="0" style="width: 100%; table-layout: fixed;">';
            html += createRow(hSegment, dataObject, dataSet, true);
            html += '</table>';

            return html;
        }


        function createRow(row, dataObject, dataSet, isVSegments) {
            var prop = isVSegments ? 'vSegments' : 'columns';
            var rowHtml = '<tr>';
            for (var i = 0; i < row[prop].length; i++) {
                var style = '';
                var colSpan = '';
                if (row[prop][i].style && !$.isEmptyObject(row[prop][i].style)) {
                    style = createStyle(row[prop][i].style);
                    if (row[prop][i].style.colSpan) {
                        colSpan = 'colspan="' + row[prop][i].style.colSpan + '"';
                    }
                }
                var colHtml = '<td ' + colSpan + ' ' + style + ' >';
                colHtml += createColumn(row[prop][i], dataObject, dataSet, isVSegments);
                colHtml += '</td>';

                rowHtml += colHtml;
            }

            rowHtml += '</tr>';

            return rowHtml;
        }

        function createColumn(column, dataObject, dataSet, isVSegments) {
            if (isVSegments) {
                return createContent(column, dataObject, dataSet);
            } else {
                if (column.hSegments.length > 1) {
                    return createHSegments(column, dataObject, dataSet);
                } else {
                    return createContent(column.hSegments[0].vSegments[0], dataObject, dataSet);
                }
            }
        }

        function createStyle(styleDef) {
            var style = 'style = "';

            if (styleDef.width) {
                style += 'width:' + styleDef.width * 1 + 'px;';
            }

            if (styleDef.height) {
                style += 'height:' + styleDef.height * 1 + 'px;';
            }

            if (styleDef.fontSize) {
                style += 'font-size:' + styleDef.fontSize * 1 + 'px;';
            }

            if (styleDef.isBold) {
                style += 'font-weight: bold;';
            }

            if (styleDef.isItalic) {
                style += 'font-style: italic;';
            }

            if (styleDef.color) {
                style += 'color:' + styleDef.color + ';';
            }
            if (styleDef.backgroundColor) {
                style += 'background-color:' + styleDef.backgroundColor + ';';
            }

            if (styleDef.allignment) {
                style += 'text-align:' + styleDef.allignment + ';';
            }

            if (styleDef.decoration) {
                style += 'text-decoration:' + styleDef.decoration + ';';
            }

            if (styleDef.margins) {
                style += 'margin-left:' + styleDef.margins[0] + 'px;';
                style += 'margin-top:' + styleDef.margins[1] + 'px;';
                style += 'margin-right:' + styleDef.margins[2] + 'px;';
                style += 'margin-bottom:' + styleDef.margins[3] + 'px;';
            }
            style += '"';
            return style;
        }

        function createContent(column, dataObject, dataSet) {
            var style = '';
            if (column.style && !$.isEmptyObject(column.style)) {
                style = createStyle(column.style);
            }

            var contentHtml = '<span ' + style + ' >';

            switch (column.type) {
                case "text":
                    contentHtml += getTextValue(column, dataObject);
                    break;
                case "image":
                    contentHtml += '';
                    break;
                case "table":
                    contentHtml += getTableValue(column, dataObject, dataSet);
                    break;
                default:
                    contentHtml += '';
                    break;
            }

            contentHtml += '</span>';

            return contentHtml;
        }

        function getTableValue(column, dataObject, dataSet) {
            var tableHtml = '<table cellpadding="0" cellspacing="0" style="width: 100%; table-layout: fixed;">';
            tableHtml += getTableHeader(column);

            var data = getRegisterData(dataSet, column);

            if (data && data.length) {
                tableHtml += '<tbody>';
                for (var i = 0; i < data.length; i++) {
                    tableHtml += getTableBody(column, data[i]);
                }
                tableHtml += '</tbody>';
            }

            tableHtml += '</table>';
            return tableHtml;
        }


        function getTableBody(column, data) {
            var bodyHtml = '<tr>';
            for (var i = 0; i < column.columns.length; i++) {
                if (column.columns[i].show) {
                    var val = data[column.columns[i].data] ? data[column.columns[i].data] : '';

                    bodyHtml += '<td>';
                    bodyHtml += val;
                    bodyHtml += '</td>';
                }
            }

            bodyHtml += '</tr>';

            return bodyHtml;

        }

        function getRegisterData(dataSet, col) {
            if (dataSet && dataSet.length) {
                var index = utilService.getIndex(dataSet, 'key', col.selectedTableId);
                if (index >= 0) {
                    return dataSet[index].value;
                }
            }
        }

        function getTableHeader(column) {
            var headerHtml = '<thead><tr>';
            for (var i = 0; i < column.columns.length; i++) {
                if (column.columns[i].show) {
                    var title = column.columns[i].displayTitle && column.columns[i].displayTitle.length ?
                        column.columns[i].displayTitle : column.columns[i].title;
                    headerHtml += '<th>';
                    headerHtml += title;
                    headerHtml += '</th>';
                }
            }

            headerHtml += '</tr></thead>';

            return headerHtml;

        }

        function getTextValue(column, dataObject) {
            var html = '';
            if (!column.texts) return '';

            for (var i = 0; i < column.texts.length; i++) {
                html += '<span ' + createStyle(column.texts[i]) + ' >';
                if (column.texts[i].dataSource === 'static') {
                    html += column.texts[i].dataValue.replace(/\n/g, "<br />");
                } else {
                    html += dataObject[column.texts[i].dataProperty].replace(/\n/g, "<br />");
                }

                html += '</span>';
            }

            return html;
        }

        function getPrintTemplateHtml(pageNo) {
            var html = '<div class="print-page" id="page-' + pageNo + '">';
            html += '<div class="a4-portrait-page">';
            html += '<div class="print-page-content">';
            html += '<div class="print-page-content-items border">';
            html += '<div class="print-page-header-items"></div>';
            html += '<div class="print-page-body-items"></div>';
            html += '<div class="print-page-footer-items"></div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            return html
        }


        return service;
    }
})();