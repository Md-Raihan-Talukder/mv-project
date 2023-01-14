(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('pdfService', pdfService);

    /** @ngInject */
    function pdfService(utilService, pdfPageSetupService, pdfTableService, banglaFontService) {

        var service = {
            createDefinition: createDefinition
        };

        function createDefinition(data, dataObject, dataSet) {
            var definition = {};
            definition = pdfPageSetupService.createPageSetup(definition, data);
            definition = setPageContent(definition, data, dataObject, dataSet);

            return definition;

        }

        function setPageContent(definition, data, dataObject, dataSet) {
            var content = getContent(data, dataObject, dataSet);
            definition.content = content ? content : [];
            return definition;
        }

        function getContent(data, dataObject, dataSet) {

            var contents = [];
            //contents.push(getTopBorder()); example of line/border

            for (var i = 0; i < data.rows.length; i++) {
                contents.push(createRowDef(data.rows[i], dataObject, dataSet));
            }

            return contents;
        }

        function getTopBorder() {
            return { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 1 }] };
        }

        function createRowDef(row, dataObject, dataSet, currentPage, pageCount, rowMargin, rowLayout) {
            var widths = [], body = [], columns = [];
            for (var i = 0; i < row.columns.length; i++) {
                if (row.columns[i].style && row.columns[i].style.width) {
                    widths.push(row.columns[i].style.width);
                } else {
                    widths.push('*');
                }

                columns.push(createColDef(row.columns[i], dataObject, dataSet, currentPage, pageCount));
            }

            body.push(columns);

            var rowDef = {
                table: {
                    widths: widths,
                    body: body,
                },
                layout: 'noBorders'
            };

            if (rowMargin) {
                rowDef.margin = rowMargin;
            }

            if (rowLayout) {
                rowDef.layout = rowLayout;
            }
            return rowDef;
        }

        function createColDef(col, dataObject, dataSet, currentPage, pageCount) {
            var cols = [];
            if (col.hSegments.length > 1) {
                return createHSegments(col, dataObject, dataSet, currentPage, pageCount);
            }

            var segment = col.hSegments[0].vSegments[0];
            return createContentDef(angular.copy(segment), dataObject, dataSet, currentPage, pageCount);
        }

        function createHSegments(col, dataObject, dataSet, currentPage, pageCount) {
            var hSegments = [];

            for (var i = 0; i < col.hSegments.length; i++) {
                var hSegment = {};
                if (col.style) {
                    setStyle(hSegment, col.style)
                }
                hSegment.columns = [];
                for (var j = 0; j < col.hSegments[i].vSegments.length; j++) {
                    var content = createContentDef(angular.copy(col.hSegments[i].vSegments[j]),
                        dataObject, dataSet, currentPage, pageCount);
                    hSegment.columns.push(content);
                }

                hSegments.push(hSegment);
            }

            var colDef = [];
            colDef.push(hSegments);
            return colDef;
        }

        function createContentDef(item, dataObject, dataSet, currentPage, pageCount) {
            var col = {};

            switch (item.type) {
                case "text":
                    col.text = getTextValue(item, dataObject);
                    // var vvv = getTextValue(item, dataObject);  
                    // col= [{image: getTextAsImage("শুরুর ধাক্কা সামলে দারুণভাবে ঘুরে দাঁড়িয়েছিল বাংলাদেশ। তামিম ইকবাল তুলে নিলেন নিজের ২২তম টেস্ট-ফিফটি"), fit:[7,53], alignment: 'center'}]
                    //col.image =  getTextAsImage("শুরুর ধাক্কা সামলে দারুণভাবে ঘুরে দাঁড়িয়েছিল বাংলাদেশ। তামিম ইকবাল তুলে নিলেন নিজের ২২তম টেস্ট-ফিফটি");
                    //col.fit = [500,500];
                    // col.canvas = [
                    //            {
                    //                type: 'rect',
                    //                x: 198,
                    //                y: -186,
                    //                w: 198,
                    //                h: 188,
                    //                r: 8,
                    //                lineWidth: 4,
                    //                lineColor: '#276fb8',

                    //            }

                    //         ];

                    break;
                case "image":
                    if (item.dataSource === 'static') {
                        col[item.type] = item.dataValue[0].data;
                    } else {
                        col[item.type] = dataObject[item.dataProperty];
                    }

                    break;

                case "table":
                    if (item.tableViewType === 'topdown') {
                        col.text = getListValue(item, dataSet);
                    } else if (item.tableViewType === 'ol') {
                        col.ol = getListValue(item, dataSet);
                    } else if (item.tableViewType === 'ul') {
                        col.ul = getListValue(item, dataSet);
                    } else {
                        col.table = pdfTableService.createTableDef(item, dataSet);
                        //col.style = 'zeropadding';
                        //col.layout = 'headerLineOnly';
                        col.layout = {
                            paddingLeft: function (i) { return 0; },
                            paddingRight: function (i, node) { return 0; },
                            paddingTop: function (i, node) { return 0; },
                            paddingBottom: function (i, node) { return 0; }
                        };
                    }
                    break;
                case "pageNo":
                    col.text = currentPage.toString() + ' of ' + pageCount;
                    break;
                case "date":
                    col.text = utilService.formatDateValue(new Date(), 'dd.MM.yyyy');
                    break;
                case "dateTime":
                    col.text = utilService.formatDateValue(new Date(), 'dd.MM.yyyy hh:mm tt');
                    break;
                default:
                    break;
            }

            if (!item.style) {
                return col;
            }

            return setStyle(col, item.style);
        }

        function getTextAsImage(text) {
            var ctx, canvas = document.createElement('canvas');
            // I am using predefined dimensions so either make this part of the arguments or change at will 
            // canvas.width = 36;
            //  canvas.height = 270;
            // ctx = canvas.getContext('2d');
            // ctx.font = '36pt Arial';
            // ctx.save();
            //  ctx.translate(36,270);
            // ctx.rotate(-0.5*Math.PI);
            // ctx.fillStyle = '#000';
            // ctx.fillText(text , 0, 0);
            // ctx.restore();


            ctx = canvas.getContext("2d");
            ctx.font = "30px Arial";
            ctx.fillText(text, 10, 50);
            return canvas.toDataURL();
        };

        function getListValue(item, dataSet) {
            var data = getRegisterData(dataSet, item);
            var values = [];

            if (data && data.length) {
                for (var i = 0; i < data.length; i++) {
                    var rowVal = getTableData(item, data[i], true);
                    var val = rowVal.join();
                    if (item.tableViewType !== 'topdown') {
                        val = { text: rowVal.join() };
                    }
                    values.push(val);
                }
            }

            if (item.tableViewType === 'topdown') {
                return values.join('\n');
            }

            return values;

        }

        function getTextValue(item, dataObject) {
            var texts = [];

            if (!item.texts) return [];

            for (var i = 0; i < item.texts.length; i++) {
                var txt = {};
                if (item.texts[i].dataSource === 'static') {
                    txt.text = banglaFontService.arrangeText(item.texts[i].dataValue);
                } else {
                    txt.text = banglaFontService.arrangeText(dataObject[item.texts[i].dataProperty]);
                }

                if (item.texts[i].fontSize) {
                    txt.fontSize = item.texts[i].fontSize * 1;
                }

                if (item.texts[i].isBold) {
                    txt.bold = item.texts[i].isBold;
                }

                if (item.texts[i].isItalic) {
                    txt.italics = item.texts[i].isItalic;
                }

                if (item.texts[i].color) {
                    txt.color = item.texts[i].color;
                }
                if (item.texts[i].backgroundColor) {
                    txt.background = item.texts[i].backgroundColor;
                }

                if (item.texts[i].decoration) {
                    txt.decoration = item.texts[i].decoration;
                }

                texts.push(txt);
            }

            return texts;
        }


        function setStyle(col, item) {
            // ['font',
            //   'fontSize',
            //   'bold',
            //   'italics',
            //   'alignment',
            //   'color',
            //   'columnGap',
            //   'fillColor',
            //   'decoration',
            //   'decorationStyle',
            //   'decorationColor',
            //   'background',
            //   'lineHeight'          
            //   ]

            if (item.width) {
                col.width = item.width * 1;
            }

            if (item.height) {
                col.height = item.height * 1;
            }

            // if(item.lineHeight){
            //   col.lineHeight = item.lineHeight * 1;
            // }

            if (item.fontSize) {
                col.fontSize = item.fontSize * 1;
            }

            if (item.isBold) {
                col.bold = item.isBold;
            }

            if (item.isItalic) {
                col.italics = item.isItalic;
            }

            if (item.color) {
                col.color = item.color;
            }
            if (item.backgroundColor) {
                col.background = item.backgroundColor;
            }

            if (item.allignment) {
                col.alignment = item.allignment;
            }

            if (item.decoration) {
                col.decoration = item.decoration;
            }

            if (item.margins) {
                col.margin = item.margins;
            }

            if (item.pageBreak) {
                col.pageBreak = item.pageBreak;
            }

            return col;
        }

        return service;

    }
})();