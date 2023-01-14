(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('makePdfService', makePdfService);

    /** @ngInject */
    function makePdfService() {

        var service = {
            buildPdf: buildPdf,
            createDefinition: createDefinition,
        };

        function createDefinition(data, dataObject) {
            var definition = {
                pageSize: data.pageSetup.pageSize ? data.pageSetup.pageSize : 'A4',
                pageOrientation: data.pageSetup.pageOrientation ? data.pageSetup.pageOrientation : 'portrait',
                pageMargins: data.pageSetup.pageMargins ? data.pageSetup.pageMargins : '0'
            };

            var header = getHeaderFooter('isHeader', data, dataObject);
            if (header) {
                definition.header = header;
            }
            var footer = getHeaderFooter('isFooter', data, dataObject);
            if (footer) {
                definition.footer = footer;
            }

            var content = getContent(data, dataObject);
            definition.content = content ? content : [];

            return definition;

        }

        function getContent(data, dataObject) {
            var items = $.grep(data.rows, function (item) {
                return !item.isHeader || !item.isFooter;
            });

            var contents = [];

            for (var i = 0; i < items.length; i++) {
                contents.push(createRow(items[i], dataObject));
            }

            return contents;
        }

        function createRow(item, dataObject) {
            var row = {};
            if (item.columns.length > 1) {
                row.columns = [];
                for (var i = 0; i < item.columns.length; i++) {
                    row.columns.push(createColumn(item.columns[i], dataObject));
                }
            } else {
                row = createColumn(item.columns[0], dataObject);
            }

            return row;
        }

        function createColumn(item, dataObject) {
            var col = {};

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

            switch (item.type) {
                case "text":
                    if (item.dataSource === 'static') {
                        col[item.type] = item.dataValue;
                        alignment: 'justify';
                        // col.lineHeight= 10;
                        // col.color = '#FFFFFF';
                        // col.fillColor = '#2361AE';
                        // col.table= {
                        //       widths: ['*'],
                        //       body: [
                        //           [item.dataValue ],                                
                        //       ]
                        //   }
                    } else {
                        col[item.type] = dataObject[item.dataProperty];
                    }
                    break;

                case "image":
                    if (item.dataSource === 'static') {
                        col[item.type] = item.dataValue[0].data;
                    } else {
                        col[item.type] = dataObject[item.dataProperty];
                    }
                    break;

                case "table":
                    col[item.type] = createTable();
                    break;
                default:
                    break;
            }

            if (!item.style) {
                return col;
            }

            return setStyle(col, item.style);
        }

        function setStyle(col, item) {
            if (item.width) {
                col.width = item.width * 1;
            }

            if (item.height) {
                col.height = item.height;
            }

            if (item.fontSize) {
                col.fontSize = item.fontSize;
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

        function createTable() {
            var table = {
                headerRows: 1,
                // keepWithHeaderRows: 1,
                // dontBreakRows: true,
                body: [
                    [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                    [
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    ],
                    [
                        'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                    ]
                ]
            }

            // var table = {
            //     headerRows: 1,
            //     // keepWithHeaderRows: 1,
            //     // dontBreakRows: true,
            //     body: [
            //         [{ text: 'Header 1', style: 'tableHeader' }]
            //     ]
            // }

            return table;
        }

        function getHeaderFooter(type, data, dataObject) {
            var items = $.grep(data.rows, function (item) {
                return item[type];
            });

            if (items.length > 0) {
                return createColumn(item.columns[0], dataObject);
            }
        }


        function createDefinition1(data) {
            // optional space between columns
            //columnGap: 10  
            //alignment : left|right|center|justify| 
            //pageBreak: 'before' | 'after'      

            return {
                content: getContents(),
                styles: {
                    header: {
                        fontSize: 18,
                        italics: true,
                        bold: true,
                        decoration: "lineThrough",// "overline",//"underline",
                        alignment: 'right',
                        margin: [0, 190, 0, 80]
                        // width: 'auto',
                        // width: 100,
                        // width: '*',
                        // width: '10%',
                    }
                }
            }

        }

        function getContents() {
            // var contents= [               
            //          {text:'First paragraph',color:'red'},
            //          {text:'First paragraph',style:'header'},
            //          {background: '#039BE5', text:'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'}
            //      ]

            var contents = [];

            //for (var i = 0; i < 200; i++) {
            contents.push({ text: 'First paragraph', color: 'red' });
            contents.push({ text: 'First paragraph', style: 'header' });
            contents.push({ pageBreak: 'after', background: '#039BE5', text: 'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines' });
            //}                

            return contents;
        }

        return service;

        //////////////////////////

        function buildPdf(id) {
            var pdfObj = pdfForElement(id);
            // pdfObj.open();

            pdfObj.getDataUrl(function (outDoc) {
                var pdfViewer = document.getElementById('pdfV');
                pdfViewer.src = outDoc;

                setTimeout(function () {
                    document.getElementById('title').html("");
                }, 3000);

            });
        }

        function pdfForElement(id) {

            function ParseContainer(cnt, e, p, styles, cellWidth) {
                var elements = [];
                var children = e.childNodes;
                if (children.length != 0) {
                    for (var i = 0; i < children.length; i++) p = ParseElement(elements, children[i], p, styles, cellWidth);
                }
                if (elements.length != 0) {
                    for (var i = 0; i < elements.length; i++) cnt.push(elements[i]);
                }
                return p;
            }

            function ComputeStyle(o, styles) {
                for (var i = 0; i < styles.length; i++) {
                    var st = styles[i].trim().toLowerCase().split(":");
                    if (st.length == 2) {
                        switch (st[0]) {
                            case "font-size":
                                {
                                    o.fontSize = parseInt(st[1]);
                                    break;
                                }
                            case "text-align":
                                {
                                    switch (st[1]) {
                                        case "right":
                                            o.alignment = 'right';
                                            break;
                                        case "center":
                                            o.alignment = 'center';
                                            break;
                                    }
                                    break;
                                }
                            case "font-weight":
                                {
                                    switch (st[1]) {
                                        case "bold":
                                            o.bold = true;
                                            break;
                                    }
                                    break;
                                }
                            case "text-decoration":
                                {
                                    switch (st[1]) {
                                        case "underline":
                                            o.decoration = "underline";
                                            break;
                                    }
                                    break;
                                }
                            case "font-style":
                                {
                                    switch (st[1]) {
                                        case "italic":
                                            o.italics = true;
                                            break;
                                    }
                                    break;
                                }
                        }
                    }
                }
            }

            var undefinedCellWidth = '-1';
            var colSpanCellWidth = '-2';
            var currentCellIndex = 0;
            var digitPattern = /[0-9]/g;
            var ppiFactor = 1.5;
            var horizontalPageBreak = null;
            var defaultRefColumn = 0;
            var preparedRefColumns = [];
            var defaultPdfCellSize = 50;
            var a4SizePageWidth = 750;
            var availablePageWidth = 500;
            var printedPages = 0;

            function getTableSpec() {
                return {
                    table: {
                        widths: [],
                        body: []
                    }
                };

            }
            function getTableSpecWidthPageBreak() {
                return {
                    pageBreak: 'before',
                    table: {
                        widths: [],
                        body: []
                    }
                };
            }


            function setCellWidth(widthDef, previousWidth) {
                var cWidth = previousWidth;
                var numWidthDef = ((widthDef == '') ? undefinedCellWidth : widthDef);
                var numPreviousWidth = ((previousWidth == '') ? undefinedCellWidth : previousWidth);

                numWidthDef = numWidthDef.toLowerCase().split('px')[0].split('%')[0].trim();
                numPreviousWidth = numPreviousWidth.toLowerCase().split('px')[0].split('%')[0].trim();
                if (parseInt(numWidthDef) > parseInt(numPreviousWidth)) {
                    return numWidthDef.trim();
                }
                return numPreviousWidth.trim();
            }

            function calculateWidth(wdt) {
                if (typeof wdt === 'string' && wdt.match(digitPattern)) {
                    return Math.floor(parseInt(wdt) / ppiFactor);
                }
                else {

                }
                return wdt;
            }

            function prepareTableContent(splitColumnIndex, endColumnIndex, t, preparedBaseTable, pageBreakFlag) {

                var preparedTable = ((!pageBreakFlag) ? getTableSpec() : getTableSpecWidthPageBreak());

                if (preparedBaseTable.table.widths.length > 0) {
                    if (pageBreakFlag) {
                        preparedTable.table = preparedBaseTable.table;
                        preparedTable = JSON.parse(JSON.stringify(preparedTable));
                    }
                    else {
                        preparedTable = JSON.parse(JSON.stringify(preparedBaseTable));
                    }

                    splitColumnIndex = ((preparedBaseTable.table.widths.length > splitColumnIndex) ? preparedBaseTable.table.widths.length : splitColumnIndex);
                }

                for (var k = splitColumnIndex; k < endColumnIndex; k++) {
                    preparedTable.table.widths.push(calculateWidth(t.table.widths[k]));
                }

                var rows = [];

                if (t.table.body.length > 0) {
                    for (var i = 0; i < t.table.body.length; i++) {
                        rows[i] = [];
                        for (var j = splitColumnIndex; j < endColumnIndex; j++) {
                            //rows[i].push(JSON.parse(JSON.stringify(t.table.body[i][j])));
                            rows[i].push(t.table.body[i][j]);
                        }
                    }
                }
                for (var i = 0; i < rows.length; i++) {
                    if (preparedTable.table.body.length <= i) preparedTable.table.body[preparedTable.table.body.length] = rows[i];
                    else {
                        for (var j = 0; j < rows[i].length; j++) {
                            preparedTable.table.body[i].push(rows[i][j]);
                        }
                    }
                }

                return preparedTable;
            }


            function breakTables(cnt, t, splitColumnIndex) {
                var preparedBaseTable = getTableSpec();
                var maxIdColumns = 0;
                if (preparedRefColumns.length == 0) {
                    preparedRefColumns.push(defaultRefColumn);
                }
                for (var i = 0; i < preparedRefColumns.length; i++) {
                    if (preparedRefColumns[i] > maxIdColumns) {
                        maxIdColumns = preparedRefColumns[i];
                    }
                }
                preparedBaseTable = prepareTableContent(0, maxIdColumns + 1, t, preparedBaseTable, false);
                var consumedColumWidth = 0;
                for (var i = 0; i < maxIdColumns + 1; i++) {
                    consumedColumWidth = consumedColumWidth + preparedBaseTable.table.widths[i];
                }
                var handledIndex = splitColumnIndex;
                for (; splitColumnIndex < t.table.widths.length; splitColumnIndex++) {
                    var columnWidth = 0;
                    if (t.table.widths[splitColumnIndex] == undefinedCellWidth || t.table.widths[splitColumnIndex] == colSpanCellWidth) {
                        columnWidth = calculateWidth(defaultPdfCellSize);
                    } else if (t.table.widths[splitColumnIndex].match(digitPattern)) {
                        columnWidth = calculateWidth(t.table.widths[splitColumnIndex]);
                    }
                    if ((consumedColumWidth + columnWidth) >= availablePageWidth) {
                        breakTables(cnt, t, splitColumnIndex);
                        break;
                    }
                    consumedColumWidth += columnWidth;
                }

                if (handledIndex == 0) {
                    cnt.push(prepareTableContent(handledIndex, splitColumnIndex, t, preparedBaseTable, false));
                }
                else {
                    horizontalPageBreak.push(prepareTableContent(handledIndex, splitColumnIndex, t, preparedBaseTable, true));
                }
            }

            function ParseElement(cnt, e, p, styles, cellWidth) {
                if (!styles) styles = [];
                if (e.getAttribute) {
                    var nodeStyle = e.getAttribute("style");
                    if (nodeStyle) {
                        var ns = nodeStyle.split(";");
                        for (var k = 0; k < ns.length; k++) styles.push(ns[k]);
                    }
                }

                switch (e.nodeName.toLowerCase()) {
                    case "#text":
                        {
                            var t = {
                                text: e.textContent.replace(/\n/g, "")
                            };
                            if (styles) ComputeStyle(t, styles);
                            p.text.push(t);
                            break;
                        }
                    case "b":
                    case "strong":
                        {
                            //styles.push("font-weight:bold");
                            ParseContainer(cnt, e, p, styles.concat(["font-weight:bold"]), cellWidth);
                            break;
                        }
                    case "u":
                        {
                            //styles.push("text-decoration:underline");
                            ParseContainer(cnt, e, p, styles.concat(["text-decoration:underline"]), cellWidth);
                            break;
                        }
                    case "i":
                        {
                            //styles.push("font-style:italic");
                            ParseContainer(cnt, e, p, styles.concat(["font-style:italic"]), cellWidth);
                            //styles.pop();
                            break;
                            //cnt.push({ text: e.innerText, bold: false });
                        }
                    case "span":
                        {
                            ParseContainer(cnt, e, p, styles, cellWidth);
                            break;
                        }
                    case "br":
                        {
                            p = CreateParagraph();
                            cnt.push(p);
                            break;
                        }
                    case "table":
                        {
                            var t = getTableSpec();
                            var border = e.getAttribute("border");
                            var isBorder = false;
                            if (border)
                                if (parseInt(border) == 1) isBorder = true;
                            if (!isBorder) t.layout = 'noBorders';
                            ParseContainer(t.table.body, e, p, styles, t.table.widths);

                            breakTables(cnt, t, 0);


                            break;
                        }
                    case "tbody":
                        {
                            ParseContainer(cnt, e, p, styles, cellWidth);
                            //p = CreateParagraph();
                            break;
                        }
                    case "tr":
                        {
                            var row = [];
                            currentCellIndex = 0;
                            ParseContainer(row, e, p, styles, cellWidth);
                            cnt.push(row);
                            break;
                        }
                    case "td":
                        {
                            p = CreateParagraph();
                            var st = {
                                stack: []
                            }
                            st.stack.push(p);



                            var rspan = e.getAttribute("rowspan");
                            if (rspan) st.rowSpan = parseInt(rspan);
                            var cspan = e.getAttribute("colspan");
                            if (cspan) {
                                st.colSpan = parseInt(cspan);
                                for (var i = 0; i < st.colSpan; i++) {
                                    cellWidth.push(colSpanCellWidth);
                                }
                                currentCellIndex = currentCellIndex + st.colSpan;
                            }
                            else {

                                if (currentCellIndex >= cellWidth.length) {

                                    cellWidth.push(setCellWidth(e.width, undefinedCellWidth));
                                }
                                else {
                                    cellWidth[currentCellIndex] = setCellWidth(e.width, cellWidth[currentCellIndex]);
                                }
                                currentCellIndex++;
                            }



                            ParseContainer(st.stack, e, p, styles, cellWidth);
                            cnt.push(st);
                            break;
                        }
                    case "div":
                    case "p":
                        {
                            p = CreateParagraph();
                            var st = {
                                stack: []
                            }
                            st.stack.push(p);
                            ComputeStyle(st, styles);
                            ParseContainer(st.stack, e, p, cellWidth);

                            cnt.push(st);
                            break;
                        }
                    default:
                        {
                            console.log("Parsing for node " + e.nodeName + " not found");
                            break;
                        }
                }
                return p;
            }

            function ParseHtml(cnt, html) {
                horizontalPageBreak = [];
                //var html = $(htmlText.replace(/\t/g, "").replace(/\n/g, ""));
                var p = CreateParagraph();
                for (var i = 0; i < html.children.length; i++) {
                    ParseElement(cnt, html.children[i], p, null);
                }
                for (var i = 0; i < horizontalPageBreak.length; i++) {

                    //cnt.push(CreateParagraph());
                    //cnt.push(pageBreak);
                    cnt.push(horizontalPageBreak[i]);
                    console.log(JSON.stringify(horizontalPageBreak[i]));
                }
            }

            function CreateParagraph() {
                var p = {
                    text: []
                };
                return p;
            }

            var content = [];

            ParseHtml(content, document.getElementById(id));



            return pdfMake.createPdf({
                content: content
            });



        }

        ////////////////////////////////////
    }
})();