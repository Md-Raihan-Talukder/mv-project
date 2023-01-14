(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('pdfDialogService', pdfDialogService);

    /** @ngInject */
    function pdfDialogService() {
        var mouseDownX = 0;
        var mouseDownY = 0;
        var mouseUpX = 0;
        var mouseUpY = 0;
        var pdfContents = [];


        var service = {
            renderPDF: renderPDF,
            loadData: loadData
        };

        function renderPDF(data, canvasContainer, currentPage, callBack) {

            function renderPages(pdfDoc) {
                callBack(pdfDoc.numPages);
                pdfDoc.getPage(currentPage).then(function (page) {
                    renderPage(page, canvasContainer)
                });
            }

            PDFJS.disableWorker = true;
            PDFJS.getDocument({
                data: data
            }).then(renderPages);
        }

        function renderPage(page, canvasContainer) {
            var canvas = document.createElement('canvas');
            var viewport = page.getViewport(1);
            var context = canvas.getContext('2d');
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvasContainer.innerHTML = '';
            canvasContainer.appendChild(canvas);


            var xdir = 'h';
            var ydir = 'v';
            var pageXdir = xdir;
            var pageYdir = ydir;

            if (canvas.height < canvas.width) {
                pageXdir = ydir;
                pageYdir = xdir
            }

            var cnt = {
                ypos: 0,
                xpos: 0,
                octant4: 0,
                octant5: 0,
                pageSetup: '',
                text: '',
                lineTabSort: ''
            };

            pdfContents = [];
            var leftPadingOffset = '0000';
            var movedTo = null;


            function replace(ctx, key) {
                var val = ctx[key];
                if (typeof (val) == "function") {

                    ctx[key] = function () {
                        var args = Array.prototype.slice.call(arguments);

                        if (key == 'fillText') {
                            if (movedTo != null) {
                                movedTo.text = movedTo.text + args[0];
                            }

                        } else if (key == 'transform') {
                            var cntX = JSON.parse(JSON.stringify(cnt)); //clone(cnt); 
                            cntX.octant4 = args[4];
                            cntX.octant5 = args[5];
                            cntX.pageSetup = ((pageXdir == xdir) ? 'Potrait' : 'Landscape')

                            cntX.xpos = Math.floor(((pageXdir == xdir) ? args[4] : args[5]));
                            cntX.ypos = Math.floor(((pageXdir == xdir) ? (canvas.height - args[5]) : args[4]));

                            cntX.text = '';
                            var yt = "" + cntX.ypos;
                            var xt = "" + cntX.xpos;
                            yt = leftPadingOffset.substring(0, (leftPadingOffset.length - yt.length)) + yt;
                            xt = leftPadingOffset.substring(0, (leftPadingOffset.length - xt.length)) + xt;
                            cntX.lineTabSort = yt + xt;
                            pdfContents.push(cntX);
                            movedTo = cntX;

                        }

                        return val.apply(ctx, args);
                    }

                }
            }

            for (var k in context) {
                replace(context, k);
            }

            page.render(renderContext);

            // console.log(pdfContents) 

            //   var delay=10000; //1 second

            //   setTimeout(function() {
            //     addMouseEvents();         
            //   }, delay);

            addMouseEvents(context, canvas);

        }

        function addMouseEvents(context, canvas) {
            // add mouse event listenner

            var destcanvas = document.getElementById('img-canvas');
            var destcontext = destcanvas.getContext('2d');

            var messagedown_x = 0;
            var messagedown_y = 0;

            var messagedown_x1 = 0;
            var messagedown_y1 = 0;

            function getMousePos(canvas, evt) {
                var rect = canvas.getBoundingClientRect();
                return {
                    x: evt.clientX - rect.left,
                    y: evt.clientY - rect.top
                };
            }

            function canvasMousDown(evt) {
                var mousePos = getMousePos(canvas, evt);
                messagedown_x = mousePos.x;
                messagedown_y = mousePos.y;



            }

            function canvasMousUp(evt) {
                var mousePos = getMousePos(canvas, evt);

                var w = Math.abs(messagedown_x - mousePos.x) + 1;
                var y = Math.abs(messagedown_y - mousePos.y) + 1;
                destcontext.fillStyle = '#EEEEEE';
                destcontext.fillRect(0, 0, destcanvas.width, destcanvas.height);

                destcanvas.height = y;
                destcanvas.width = w;

                messagedown_x1 = mousePos.x;
                messagedown_y1 = mousePos.y;

                var imgData = context.getImageData(messagedown_x, messagedown_y, mousePos.x, mousePos.y);
                destcontext.putImageData(imgData, 1, 1);

                mouseDownX = messagedown_x;
                mouseDownY = messagedown_y;
                mouseUpX = messagedown_x1;
                mouseUpY = messagedown_y1;

            }

            function canvasMouseMove(evt) {
                var mousePos = getMousePos(canvas, evt);
            }

            var $container = $('#pdf-canvas-holder');
            var $selection = $('<div>').addClass('selection-box');

            //mouse down

            $container.on('mousedown', function (e) {
                canvasMousDown(e);
                var click_y = e.pageY;
                var click_x = e.pageX;

                $selection.css({
                    'top': click_y,
                    'left': click_x,
                    'width': 0,
                    'height': 0
                });

                $selection.appendTo($container);

                $container.on('mousemove', function (e) {
                    canvasMouseMove(e);
                    var move_x = e.pageX,
                        move_y = e.pageY,
                        width = Math.abs(move_x - click_x),
                        height = Math.abs(move_y - click_y),
                        new_x, new_y;

                    new_x = (move_x < click_x) ? (click_x - width) : click_x;
                    new_y = (move_y < click_y) ? (click_y - height) : click_y;

                    $selection.css({
                        'width': width,
                        'height': height,
                        'top': new_y,
                        'left': new_x
                    });

                }).on('mouseup', function (e) {
                    canvasMousUp(e)
                    $container.off('mousemove');

                });


            }); //end mouse down
        }

        function loadData() {
            loadText(pdfContents, mouseDownX, mouseDownY, mouseUpX, mouseUpY);
        }


        function loadText(pdfContents, messagedown_x, messagedown_y, messagedown_x1, messagedown_y1) {
            var txtCntrol = document.getElementById('the-text');

            pdfContents.sort(function (a, b) {
                if (a.lineTabSort < b.lineTabSort) {
                    return -1;
                }
                if (a.lineTabSort > b.lineTabSort) {
                    return 1;
                }
                return 0;
            });

            ////////////-----------------------------table preparetion begins -------------


            var fontHeightOffset = 5;
            var voidCellItem = ' ';
            var preparedTable = [];
            var maxValue = 9999;

            //------------------------ prepare table lines ----------------

            if (pdfContents.length > 0) {

                //-------------------------items within the range ------------------------

                var contentItems = [];
                for (var i = 0; i < pdfContents.length; i++) {
                    if (pdfContents[i].xpos >= messagedown_x && pdfContents[i].xpos <= messagedown_x1) {
                        if (pdfContents[i].ypos >= messagedown_y && pdfContents[i].ypos <= messagedown_y1) {
                            contentItems.push(pdfContents[i]);
                        }
                    }
                }
                var tableLines = [];
                var tableRows = 1;
                var newRowStarted = true;
                var maximunNumberOfItems = 0;
                var virtualTableLineContender = [];
                if (contentItems.length > 0) {
                    tableLines.push([]);
                    var current_y_pos = contentItems[0].ypos;
                    for (var i = 0; i < contentItems.length; i++) {
                        if (contentItems[i].ypos >= current_y_pos && contentItems[i].ypos <= (current_y_pos + fontHeightOffset)) {
                            tableLines[tableRows - 1].push(contentItems[i]);
                            newRowStarted = false;
                        }
                        else {
                            tableLines[tableRows - 1].sort(function (a, b) {
                                if (a.xpos < b.xpos) {
                                    return -1;
                                }
                                if (a.xpos > b.xpos) {
                                    return 1;
                                }
                                return 0;
                            });

                            if (maximunNumberOfItems < tableLines[tableRows - 1].length) {
                                maximunNumberOfItems = tableLines[tableRows - 1].length;
                            }
                            tableLines.push([]);
                            tableRows++;
                            tableLines[tableRows - 1].push(contentItems[i]);
                            newRowStarted = true;
                            current_y_pos = contentItems[i].ypos;
                        }
                    }
                    var virtualTableLine = [];
                    for (var i = 0; i < tableLines.length; i++) {
                        if (tableLines[i].length == maximunNumberOfItems) {
                            virtualTableLineContender.push(tableLines[i]);
                        }
                    }
                    for (var j = 0; j < virtualTableLineContender[0].length; j++) {
                        var lowestXPos = maxValue;
                        for (var i = 0; i < virtualTableLineContender.length; i++) {
                            if (virtualTableLineContender[i][j].xpos < lowestXPos) {
                                virtualTableLine[j] = virtualTableLineContender[i][j].xpos;
                                lowestXPos = virtualTableLine[j];
                            }
                        }
                    }
                    /////---------------------------- Prepareing Table ----------------------------------------------------------------
                    /////----------------------------got some corner cases where-------- gap between VR.Item(X) and item(X) - xpos is larger than gap between VR.Item(X+1) and item(X) 
                    for (var i = 0; i < tableLines.length; i++) {
                        if (tableLines[i].length == maximunNumberOfItems) {
                            preparedTable.push(tableLines[i]);
                        }
                        else if (tableLines[i].length < maximunNumberOfItems) {
                            var tempTableRow = [];
                            for (var j = 0; j < tableLines[i].length; j++) {
                                var minDif = maxValue;
                                var indx = maxValue;
                                for (var k = 0; k < virtualTableLine.length; k++) {
                                    if (minDif < Math.abs(tableLines[i][j].xpos - virtualTableLine[k])) {
                                        minDif = Math.abs(tableLines[i][j].xpos - virtualTableLine[k]);
                                        indx = k;
                                    }
                                }
                                if (indx < maximunNumberOfItems && tableLines[i].length <= indx) {
                                    for (var k = tableLines[i].length; k < indx; k++) {
                                        var cntX = JSON.parse(JSON.stringify(cnt)); //  clone(cnt);
                                        tempTableRow.push(cntX);
                                    }
                                    tempTableRow.push(tableLines[i][j]);
                                }
                            }
                            preparedTable.push(tempTableRow);
                        }
                    }

                    ////////////-----------------------------table preparetion ends -------------


                }
            }


            ////////////------------------------------draw table ---------------------------
            var htmlText = "<table border='1'>";
            for (var i = 0; i < preparedTable.length; i++) {
                htmlText = htmlText + "<tr>";
                for (var j = 0; j < preparedTable[i].length; j++) {
                    htmlText = htmlText + "<td>" + preparedTable[i][j].text + "</td>";
                }
                htmlText = htmlText + "</tr>";

            }
            htmlText = htmlText + "</table>";
            txtCntrol.innerHTML = htmlText;

        }


        return service;

    }
})();