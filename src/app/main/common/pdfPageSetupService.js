(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('pdfPageSetupService', pdfPageSetupService);

    /** @ngInject */
    function pdfPageSetupService() {

        var service = {
            createPageSetup: createPageSetup
        };

        function createPageSetup(definition, data) {
            definition = setPageSetup(definition, data);
            definition = setPageHeader(definition, data);
            definition = setPageFooter(definition, data);
            definition = setStyleLibrary(definition);
            //definition = setWaterMark(definition); example of water mark

            return definition;
        }

        function setWaterMark(definition) {
            definition.watermark = { text: 'test watermark', color: 'blue', opacity: 0.3, bold: true, italics: false };
            return definition;
        }

        function setStyleLibrary(definition) {
            definition.styles = {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10]
                },
                zeropadding: {
                    padding: [0, 0, 0, 0],
                    margin: [0, 0, 0, 0]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    //fontSize: 13,
                    color: 'black'
                }
            };

            return definition
        }

        function setPageSetup(definition, data) {
            definition.pageSize = data.pageSetup.pageSize ? data.pageSetup.pageSize : 'A4';
            definition.pageOrientation = data.pageSetup.pageOrientation ? data.pageSetup.pageOrientation : 'portrait';
            definition.pageMargins = [40, 60, 40, 60];
            return definition;
        }

        function setPageHeader(definition, data) {
            if (data.header) {
                var rowLayout, margin = 20;
                if (data.header.style && data.header.style.drawLine) {
                    rowLayout = {
                        hLineWidth: function (i, node) {
                            return (i === node.table.body.length) ? 1 : 0;
                        },
                        vLineWidth: function (i, node) {
                            return 0;
                        },
                        hLineColor: function (i, node) {
                            //return '#a30033';
                            return '#000';
                        }
                    }
                }

                if (data.header.style && data.header.style.margins) {
                    margin = data.header.style.margins;
                }

                definition.header = function (currentPage, pageCount) {
                    return createRowDefTB(data.header, undefined, undefined, currentPage, pageCount, margin, rowLayout);
                }
            }

            return definition;
        }

        function setPageFooter(definition, data) {
            if (data.footer) {
                var rowLayout, margin = [20, 0, 20, 0];
                if (data.footer.style && data.footer.style.drawLine) {
                    rowLayout = {
                        hLineWidth: function (i, node) {
                            return (i === 0) ? 1 : 0;
                        },
                        vLineWidth: function (i, node) {
                            return 0;
                        },
                        hLineColor: function (i, node) {
                            //return '#a30033';
                            return '#000';
                        }
                    }
                }

                if (data.footer.style && data.footer.style.margins) {
                    margin = data.footer.style.margins;
                }

                definition.footer = function (currentPage, pageCount) {
                    return createRowDefTB(data.footer, undefined, undefined, currentPage, pageCount, margin, rowLayout);;
                }
            }
            return definition;
        }

        return service;
    }
})();