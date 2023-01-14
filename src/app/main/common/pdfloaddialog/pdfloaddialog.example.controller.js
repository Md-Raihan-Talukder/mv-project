(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('PdfLoadDialogControllerX', PdfLoadDialogControllerX);

    /** @ngInject */
    function PdfLoadDialogControllerX($mdDialog, $timeout) {
        var vm = this;
        vm.closeDialog = closeDialog;

        /////////////////////////////////////////////
        $timeout(function () {

            var canvas = document.getElementById('the-canvas');

            var shadow_canvas = document.getElementById('shadow-canvas');


            var context = canvas.getContext('2d');
            var shadow_context = shadow_canvas.getContext('2d');


            var txtCntrol = document.getElementById('the-text');

            var umousedown = false;

            var destcanvas = document.getElementById('img-canvas');
            var destcontext = destcanvas.getContext('2d');

            var messagedown_x = 0;
            var messagedown_y = 0;

            var messagedown_x1 = 0;
            var messagedown_y1 = 0;

            var outputText = document.getElementById('pos');
            var downText = document.getElementById('down');
            var upText = document.getElementById('up');

            var xdir = 'h';
            var ydir = 'v';

            var canvas_left = 0;
            var canvas_top = 0;

            ///////-----------------------------------------------------------------------

            var cnt = {
                ypos: 0,
                xpos: 0,
                octant4: 0,
                octant5: 0,
                pageSetup: '',
                text: '',
                lineTabSort: ''
            };

            var pdfContents = [];
            var str = '';


            var leftPadingOffset = '0000';
            var maxHeight = 9999;
            var movedTo = null;


            function draw(ctx, x1, y1, x2, y2) {
                ctx.rect(x1, y1, x2, y2);
                ctx.stroke();
                ctx.closePath();
            }

            function clearShadow() {
                var rectangle_canvas = document.getElementById('rectangle-canvas');
                if (rectangle_canvas != null) rectangle_canvas.remove();
            }

            function getOffset(el) {
                el = el.getBoundingClientRect();
                return {
                    left: el.left + window.scrollX,
                    top: el.top + window.scrollY
                }
            }


            function addCanvas(left, top, width, height) {
                width = width - 5;
                height = height - 5;
                if (width > 0 && height > 0) {
                    var rectangle_canvas = document.getElementById('rectangle-canvas');
                    if (rectangle_canvas != null) rectangle_canvas.remove();

                    rectangle_canvas = document.createElement('canvas');

                    left = left + canvas_left;
                    top = top + canvas_top;

                    var rectangle_style = "border:1px solid black; position: absolute; left: " + left + "; top: " + top + "; z-index: 2;";
                    rectangle_canvas.height = height;
                    rectangle_canvas.width = width;
                    rectangle_canvas.setAttribute("style", rectangle_style);
                    rectangle_canvas.setAttribute("id", 'rectangle-canvas');

                    document.getElementById('rectangle_container').appendChild(rectangle_canvas);
                }

            }















            PDFJS.getDocument('F281.pdf').then(function (pdf) {
                pdf.getPage(1).then(function (page) {

                    var delay = 10000; //1 second

                    setTimeout(function () {
                        //your code to be executed after 1 second
                    }, delay);

                    var scale = 1;
                    var viewport = page.getViewport(scale);



                    canvas.height = viewport.height;
                    canvas.width = viewport.width;


                    canvas_left = Math.floor(getOffset(canvas).left); //Math.floor();
                    canvas_top = Math.floor(getOffset(canvas).top);


                    var shadow_style = "position: absolute; left: " + canvas_left + "; top: " + canvas_top + "; z-index: 1;";
                    shadow_canvas.height = canvas.height;
                    shadow_canvas.width = canvas.width;
                    shadow_canvas.setAttribute("style", shadow_style);








                    //var canvasRatio = canvas.height / canvas.width;
                    //var shadow_canvasRatio = canvas.height / canvas.width;


                    // alert(canvasRatio+'\n'+shadow_canvasRatio+'\n'+windowRatio);



                    var pageXdir = xdir;
                    var pageYdir = ydir;

                    if (canvas.height < canvas.width) {
                        pageXdir = ydir;
                        pageYdir = xdir
                    }

                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };



                    function replace(ctx, key) {
                        var val = ctx[key];
                        if (typeof (val) == "function") {
                            ctx[key] = function () {

                                var args = Array.prototype.slice.call(arguments);
                                //console.log("Called " + key + "(" + args.join(",") + ")");
                                if (key == 'fillText') {
                                    if (movedTo != null) {
                                        movedTo.text = movedTo.text + args[0];
                                    }
                                    str = str + args[0];
                                    //console.log("fillText " + key + "(" + args.join(",") + ")");
                                    //record(ctx, key, args)
                                }
                                else if (key == 'transform') {
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
                                    //cntX.lineTabSort =  (  (pageXdir==xdir) ? (yt + xt) : (xt + yt) ) ;
                                    //console.log("fillText : text : "+str+", " + key + "(" + args.join(",") + ")");
                                    cntX.lineTabSort = yt + xt;
                                    pdfContents.push(cntX);
                                    movedTo = cntX;
                                    str = '';
                                }

                                return val.apply(ctx, args);
                            }
                        }
                    }



                    for (var k in context) {
                        replace(context, k);
                    }

                    page.render(renderContext);

                });


                function getMousePos(shadow_canvas, evt) {
                    var rect = canvas.getBoundingClientRect();
                    return {
                        x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top
                    };
                }



                shadow_canvas.addEventListener('mousemove', function (evt) {
                    var mousePos = getMousePos(shadow_canvas, evt);
                    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;

                    if (umousedown) {
                        var mpos_x = ((messagedown_x > mousePos.x) ? mousePos.x : messagedown_x);
                        var mpos_y = ((messagedown_y > mousePos.y) ? mousePos.y : messagedown_y);

                        var mpos_x1 = ((messagedown_x < mousePos.x) ? mousePos.x : messagedown_x);
                        var mpos_y1 = ((messagedown_y < mousePos.y) ? mousePos.y : messagedown_y);

                        var wid = Math.abs(mpos_x - mpos_x1);
                        var len = Math.abs(mpos_y - mpos_y1);

                        addCanvas(mpos_x, mpos_y, wid, len);

                    }

                    outputText.value = message;
                }, false);



                shadow_canvas.addEventListener('mousedown', function (evt) {
                    var mousePos = getMousePos(shadow_canvas, evt);
                    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
                    messagedown_x = mousePos.x;
                    messagedown_y = mousePos.y;
                    umousedown = true;
                    clearShadow();
                    downText.value = message;
                }, false);

                shadow_canvas.addEventListener('click', function (evt) {
                    // clearShadow();
                }, false);




                shadow_canvas.addEventListener('mouseup', function (evt) {
                    var mousePos = getMousePos(shadow_canvas, evt);
                    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
                    up.value = message;
                    var w = Math.abs(messagedown_x - mousePos.x) + 10;
                    var y = Math.abs(messagedown_y - mousePos.y) + 10;
                    destcontext.fillStyle = '#EEEEEE';
                    destcontext.fillRect(0, 0, destcanvas.width, destcanvas.height);

                    destcanvas.height = y;
                    destcanvas.width = w;



                    if (messagedown_x > mousePos.x) {
                        var tmpX = mousePos.x;
                        mousePos.x = messagedown_x;
                        messagedown_x = tmpX;
                    }
                    if (messagedown_y > mousePos.y) {
                        var tmpY = mousePos.y;
                        mousePos.y = messagedown_y;
                        messagedown_y = tmpY;
                    }
                    messagedown_x1 = mousePos.x;
                    messagedown_y1 = mousePos.y;

                    var wid = Math.abs(messagedown_x - mousePos.x);
                    var len = Math.abs(messagedown_y - mousePos.y);


                    addCanvas(messagedown_x, messagedown_y, wid, len);
                    //draw(shadow_context,messagedown_x, messagedown_y, destcanvas.width, destcanvas.height)

                    var imgData = context.getImageData(messagedown_x, messagedown_y, mousePos.x, mousePos.y);
                    destcontext.putImageData(imgData, 5, 5);
                    umousedown = false;



                }, false);
            });


        });


        /////////////////////////////////////////////         




        function closeDialog() {
            $mdDialog.hide();
        }

    }
})();