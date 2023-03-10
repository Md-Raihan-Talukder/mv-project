(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('barcodeService', barcodeService);

    /** @ngInject */
    function barcodeService() {
        var barcodeTypes = [
            { name: 'AusPost 4 State Customer Code', type: 'auspost', text: '5956439111ABA 9', altText: '', scale: { x: 2, y: 2 }, options: 'includetext custinfoenc=character' },
            { name: 'Aztec', type: 'azteccode', text: 'This is Aztec Code', altText: '', scale: { x: 2, y: 2 }, options: 'format=full' },
            { name: 'Aztec Runes', type: 'aztecrune', text: '1', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'BC412', type: 'bc412', text: 'BC412', altText: '', scale: { x: 2, y: 2 }, options: 'semi includetext includecheckintext' },
            { name: 'Channel Code', type: 'channelcode', text: '3493', altText: '', scale: { x: 2, y: 2 }, options: 'height=0.5 includetext' },
            { name: 'Codabar', type: 'rationalizedCodabar', text: 'A0123456789B', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'Codablock F', type: 'codablockf', text: 'CODABLOCK F 34567890123456789010040digit', altText: '', scale: { x: 2, y: 2 }, options: 'columns=8' },
            { name: 'Code 11', type: 'code11', text: '0123456789', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'Code 128', type: 'code128', text: 'Count01234567^FNC2!', altText: '', scale: { x: 2, y: 2 }, options: 'includetext parsefnc' },
            { name: 'Code 16K', type: 'code16k', text: 'Abcd-1234567890-wxyZ', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'Code 25', type: 'code2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'Code 39', type: 'code39', text: 'THIS IS CODE 39', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'Code 39 Extended', type: 'code39ext', text: 'Code39 Ext!', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'Code 49', type: 'code49', text: 'MULTIPLE ROWS IN CODE 49', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'Code 93', type: 'code93', text: 'THIS IS CODE 93', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck' },
            { name: 'Code 93 Extended', type: 'code93ext', text: 'Code93 Ext!', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck' },
            { name: 'Code One', type: 'codeone', text: 'Code One', altText: '', scale: { x: 2, y: 2 }, options: 'version=B' },
            { name: 'Compact Aztec Code', type: 'azteccodecompact', text: '1234', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'Compact PDF417', type: 'pdf417compact', text: 'This is compact PDF417', altText: '', scale: { x: 2, y: 2 }, options: 'columns=2' },
            { name: 'COOP 2 of 5', type: 'coop2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'Custom 1D symbology', type: 'raw', text: '331132131313411122131311333213114131131221323', altText: '', scale: { x: 2, y: 2 }, options: 'height=0.5' },
            { name: 'Custom 4 state symbology', type: 'daft', text: 'FATDAFTDAD', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'Data Matrix', type: 'datamatrix', text: 'This is Data Matrix!', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'Datalogic 2 of 5', type: 'datalogic2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'Deutsche Post Identcode', type: 'identcode', text: '563102430313', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'Deutsche Post Leitcode', type: 'leitcode', text: '21348075016401', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'EAN-13', type: 'ean13', text: '2112345678900', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
            { name: 'EAN-13 Composite', type: 'ean13composite', text: '2112345678900|(99)1234-abcd', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'EAN-2 (2 digit addon)', type: 'ean2', text: '05', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
            { name: 'EAN-5 (5 digit addon)', type: 'ean5', text: '90200', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
            { name: 'EAN-8', type: 'ean8', text: '02345673', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
            { name: 'EAN-8 Composite', type: 'ean8composite', text: '02345673|(21)A12345678', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'Flattermarken', type: 'flattermarken', text: '11099', altText: '', scale: { x: 2, y: 2 }, options: 'inkspread=-0.25 showborder borderleft=0 borderright=0' },
            { name: 'GS1 Composite 2D Component', type: 'gs1-cc', text: '(01)95012345678903(3103)000123', altText: '', scale: { x: 2, y: 2 }, options: 'ccversion=b cccolumns=4' },
            { name: 'GS1 Data Matrix', type: 'gs1datamatrix', text: '(01)03453120000011(17)120508(10)ABCD1234(410)9501101020917', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Expanded', type: 'databarexpanded', text: '(01)95012345678903(3103)000123', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Expanded Composite', type: 'databarexpandedcomposite', text: '(01)93712345678904(3103)001234|(91)1A2B3C4D5E', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Expanded Stacked', type: 'databarexpandedstacked', text: '(01)95012345678903(3103)000123', altText: '', scale: { x: 2, y: 2 }, options: 'segments=4' },
            { name: 'GS1 DataBar Expanded Stacked Composite', type: 'databarexpandedstackedcomposite', text: '(01)00012345678905(10)ABCDEF|(21)12345678', altText: '', scale: { x: 2, y: 2 }, options: 'segments=4' },
            { name: 'GS1 DataBar Limited', type: 'databarlimited', text: '(01)15012345678907', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Limited Composite', type: 'databarlimitedcomposite', text: '(01)03512345678907|(21)abcdefghijklmnopqrstuv', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Omnidirectional', type: 'databaromni', text: '(01)24012345678905', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Omnidirectional Composite', type: 'databaromnicomposite', text: '(01)03612345678904|(11)990102', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Stacked', type: 'databarstacked', text: '(01)24012345678905', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Stacked Composite', type: 'databarstackedcomposite', text: '(01)03412345678900|(17)010200', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Stacked Omnidirectional', type: 'databarstackedomni', text: '(01)24012345678905', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Stacked Omnidirectional Composite', type: 'databarstackedomnicomposite', text: '(01)03612345678904|(11)990102', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Truncated', type: 'databartruncated', text: '(01)24012345678905', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 DataBar Truncated Composite', type: 'databartruncatedcomposite', text: '(01)03612345678904|(11)990102', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1 QR Code', type: 'gs1qrcode', text: '(01)03453120000011(8200)http://www.abc.net(10)ABCD1234(410)9501101020917', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'GS1-128', type: 'gs1-128', text: '(01)95012345678903(3103)000123', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'GS1-128 Composite', type: 'gs1-128composite', text: '(00)030123456789012340|(02)13012345678909(37)24(10)1234567ABCDEFG', altText: '', scale: { x: 2, y: 2 }, options: 'ccversion=c' },
            { name: 'GS1-14', type: 'ean14', text: '(01) 0 46 01234 56789 3', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'HIBC Codablock F', type: 'hibccodablockf', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'HIBC Code 128', type: 'hibccode128', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'HIBC Code 39', type: 'hibccode39', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'HIBC Data Matrix', type: 'hibcdatamatrix', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'HIBC MicroPDF417', type: 'hibcmicropdf417', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'HIBC PDF417', type: 'hibcpdf417', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'HIBC QR Code', type: 'hibcqrcode', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'IATA 2 of 5', type: 'iata2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'Industrial 2 of 5', type: 'industrial2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'Interleaved 2 of 5 (ITF)', type: 'interleaved2of5', text: '2401234567', altText: '', scale: { x: 2, y: 2 }, options: 'height=0.5 includecheck includetext includecheckintext' },
            { name: 'ISBN', type: 'isbn', text: '978-1-56581-231-4 52250', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
            { name: 'ISMN', type: 'ismn', text: '979-0-2605-3211-3', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
            { name: 'ISSN', type: 'issn', text: '0311-175X 00 17', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
            { name: 'Italian Pharmacode', type: 'code32', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'ITF-14', type: 'itf14', text: '0 46 01234 56789 3', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'Japan Post 4 State Customer Code', type: 'japanpost', text: '6540123789-A-K-Z', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheckintext' },
            { name: 'Matrix 2 of 5', type: 'matrix2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'MaxiCode', type: 'maxicode', text: '[)>^03001^02996152382802^029840^029001^0291Z00004951^029UPSN^02906X610^029159^0291234567^0291/1^029^029Y^029634 ALPHA DR^029PITTSBURGH^029PA^029^004', altText: '', scale: { x: 2, y: 2 }, options: 'mode=2 parse' },
            { name: 'Micro QR Code', type: 'microqrcode', text: '1234', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'MicroPDF417', type: 'micropdf417', text: 'MicroPDF417', altText: '', scale: { x: 2, y: 2 }, options: '' },
            { name: 'Miscellaneous symbols', type: 'symbol', text: 'fima', altText: '', scale: { x: 2, y: 2 }, options: 'backgroundcolor=DD000011' },
            { name: 'MSI Modified Plessey', type: 'msi', text: '0123456789', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
            { name: 'PDF417', type: 'pdf417', text: 'This is PDF417', altText: '', scale: { x: 2, y: 2 }, options: 'columns=2' },
            { name: 'Pharmaceutical Binary Code', type: 'pharmacode', text: '117480', altText: '', scale: { x: 2, y: 2 }, options: 'showborder' },
            { name: 'Pharmazentralnummer (PZN)', type: 'pzn', text: '123456', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'Plessey UK', type: 'plessey', text: '01234ABCD', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheckintext' },
            { name: 'PosiCode', type: 'posicode', text: 'ABC123', altText: '', scale: { x: 2, y: 2 }, options: 'version=b inkspread=-0.5 parsefnc includetext' },
            { name: 'QR Code', type: 'qrcode', text: 'This is  QR Code' + '\r\n' + "asdad", altText: '', scale: { x: 2, y: 2 }, options: 'eclevel=M' },
            { name: 'Royal Dutch TPG Post KIX', type: 'kix', text: '1231FZ13XHS', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'Royal Mail 4 State Customer Code', type: 'royalmail', text: 'LE28HS9Z', altText: '', scale: { x: 2, y: 2 }, options: 'includetext barcolor=FF0000' },
            { name: 'SSCC-18', type: 'sscc18', text: '(00) 0 0614141 123456789 0', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'Telepen', type: 'telepen', text: 'ABCDEF', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'Telepen Numeric', type: 'telepennumeric', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'Two-track Pharmacode', type: 'pharmacode2', text: '117480', altText: '', scale: { x: 2, y: 2 }, options: 'includetext showborder' },
            { name: 'UPC-A', type: 'upca', text: '416000336108', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'UPC-A Composite', type: 'upcacomposite', text: '416000336108|(99)1234-abcd', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'UPC-E', type: 'upce', text: '00123457', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'UPC-E Composite', type: 'upcecomposite', text: '00123457|(15)021231', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
            { name: 'USPS Intelligent Mail', type: 'onecode', text: '0123456709498765432101234567891', altText: '', scale: { x: 2, y: 2 }, options: 'barcolor=FF0000' },
            { name: 'USPS PLANET', type: 'planet', text: '01234567890', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheckintext' },
            { name: 'USPS POSTNET', type: 'postnet', text: '01234', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheckintext' },
        ];

        var barcodeGroups = [
            {
                "id": "1",
                "title": "Lenear(1D)",
                "barcodes": [
                    { name: 'BC412', type: 'bc412', text: 'BC412', altText: '', scale: { x: 2, y: 2 }, options: 'semi includetext includecheckintext' },
                    { name: 'Channel Code', type: 'channelcode', text: '3493', altText: '', scale: { x: 2, y: 2 }, options: 'height=0.5 includetext' },
                    { name: 'Codabar', type: 'rationalizedCodabar', text: 'A0123456789B', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'Code 11', type: 'code11', text: '0123456789', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'Code 128', type: 'code128', text: 'Count01234567^FNC2!', altText: '', scale: { x: 2, y: 2 }, options: 'includetext parsefnc' },
                    { name: 'Code 25', type: 'code2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'Code 39', type: 'code39', text: 'THIS IS CODE 39', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'Code 39 Extended', type: 'code39ext', text: 'Code39 Ext!', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'Code 93', type: 'code93', text: 'THIS IS CODE 93', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck' },
                    { name: 'Code 93 Extended', type: 'code93ext', text: 'Code93 Ext!', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck' },
                    { name: 'COOP 2 of 5', type: 'coop2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'Custom 1D symbology', type: 'raw', text: '331132131313411122131311333213114131131221323', altText: '', scale: { x: 2, y: 2 }, options: 'height=0.5' },
                    { name: 'Datalogic 2 of 5', type: 'datalogic2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'IATA 2 of 5', type: 'iata2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'Industrial 2 of 5', type: 'industrial2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'Interleaved 2 of 5 (ITF)', type: 'interleaved2of5', text: '2401234567', altText: '', scale: { x: 2, y: 2 }, options: 'height=0.5 includecheck includetext includecheckintext' },
                    { name: 'Flattermarken', type: 'flattermarken', text: '11099', altText: '', scale: { x: 2, y: 2 }, options: 'inkspread=-0.25 showborder borderleft=0 borderright=0' },
                    { name: 'GS1-128', type: 'gs1-128', text: '(01)95012345678903(3103)000123', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'GS1-128 Composite', type: 'gs1-128composite', text: '(00)030123456789012340|(02)13012345678909(37)24(10)1234567ABCDEFG', altText: '', scale: { x: 2, y: 2 }, options: 'ccversion=c' },
                    { name: 'GS1-14', type: 'ean14', text: '(01) 0 46 01234 56789 3', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'Matrix 2 of 5', type: 'matrix2of5', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'Miscellaneous symbols', type: 'symbol', text: 'fima', altText: '', scale: { x: 2, y: 2 }, options: 'backgroundcolor=DD000011' },
                    { name: 'MSI Modified Plessey', type: 'msi', text: '0123456789', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheck includecheckintext' },
                    { name: 'Plessey UK', type: 'plessey', text: '01234ABCD', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheckintext' },
                    { name: 'PosiCode', type: 'posicode', text: 'ABC123', altText: '', scale: { x: 2, y: 2 }, options: 'version=b inkspread=-0.5 parsefnc includetext' },
                    { name: 'SSCC-18', type: 'sscc18', text: '(00) 0 0614141 123456789 0', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'Telepen', type: 'telepen', text: 'ABCDEF', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'Telepen Numeric', type: 'telepennumeric', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' }

                ]
            },
            {
                "id": "2",
                "title": "2D Codes",
                "barcodes": [
                    { name: 'QR Code', type: 'qrcode', text: 'This is  QR Code' + '\r\n' + "asdad", altText: '', scale: { x: 2, y: 2 }, options: 'eclevel=M' },
                    { name: 'Data Matrix', type: 'datamatrix', text: 'This is Data Matrix!', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'Aztec', type: 'azteccode', text: 'This is Aztec Code', altText: '', scale: { x: 2, y: 2 }, options: 'format=full' },
                    { name: 'Code 16K', type: 'code16k', text: 'Abcd-1234567890-wxyZ', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'Code 49', type: 'code49', text: 'MULTIPLE ROWS IN CODE 49', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'Code One', type: 'codeone', text: 'Code One', altText: '', scale: { x: 2, y: 2 }, options: 'version=B' },
                    { name: 'Compact Aztec Code', type: 'azteccodecompact', text: '1234', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'Compact PDF417', type: 'pdf417compact', text: 'This is compact PDF417', altText: '', scale: { x: 2, y: 2 }, options: 'columns=2' },
                    { name: 'Aztec Runes', type: 'aztecrune', text: '1', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'Codablock F', type: 'codablockf', text: 'CODABLOCK F 34567890123456789010040digit', altText: '', scale: { x: 2, y: 2 }, options: 'columns=8' },
                    { name: 'MaxiCode', type: 'maxicode', text: '[)>^03001^02996152382802^029840^029001^0291Z00004951^029UPSN^02906X610^029159^0291234567^0291/1^029^029Y^029634 ALPHA DR^029PITTSBURGH^029PA^029^004', altText: '', scale: { x: 2, y: 2 }, options: 'mode=2 parse' },
                    { name: 'Micro QR Code', type: 'microqrcode', text: '1234', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'MicroPDF417', type: 'micropdf417', text: 'MicroPDF417', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'PDF417', type: 'pdf417', text: 'This is PDF417', altText: '', scale: { x: 2, y: 2 }, options: 'columns=2' }

                ]
            },
            {
                "id": "3",
                "title": "Postal Codes",
                "barcodes": [
                    { name: 'AusPost 4 State Customer Code', type: 'auspost', text: '5956439111ABA 9', altText: '', scale: { x: 2, y: 2 }, options: 'includetext custinfoenc=character' },
                    { name: 'Custom 4 state symbology', type: 'daft', text: 'FATDAFTDAD', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'Deutsche Post Identcode', type: 'identcode', text: '563102430313', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'Deutsche Post Leitcode', type: 'leitcode', text: '21348075016401', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'Japan Post 4 State Customer Code', type: 'japanpost', text: '6540123789-A-K-Z', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheckintext' },
                    { name: 'Royal Dutch TPG Post KIX', type: 'kix', text: '1231FZ13XHS', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'Royal Mail 4 State Customer Code', type: 'royalmail', text: 'LE28HS9Z', altText: '', scale: { x: 2, y: 2 }, options: 'includetext barcolor=FF0000' },
                    { name: 'USPS Intelligent Mail', type: 'onecode', text: '0123456709498765432101234567891', altText: '', scale: { x: 2, y: 2 }, options: 'barcolor=FF0000' },
                    { name: 'USPS PLANET', type: 'planet', text: '01234567890', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheckintext' },
                    { name: 'USPS POSTNET', type: 'postnet', text: '01234', altText: '', scale: { x: 2, y: 2 }, options: 'includetext includecheckintext' }

                ]
            },
            {
                "id": "4",
                "title": "GS1 DataBar",
                "barcodes": [
                    { name: 'GS1 Composite 2D Component', type: 'gs1-cc', text: '(01)95012345678903(3103)000123', altText: '', scale: { x: 2, y: 2 }, options: 'ccversion=b cccolumns=4' },
                    { name: 'GS1 Data Matrix', type: 'gs1datamatrix', text: '(01)03453120000011(17)120508(10)ABCD1234(410)9501101020917', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Expanded', type: 'databarexpanded', text: '(01)95012345678903(3103)000123', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Expanded Composite', type: 'databarexpandedcomposite', text: '(01)93712345678904(3103)001234|(91)1A2B3C4D5E', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Expanded Stacked', type: 'databarexpandedstacked', text: '(01)95012345678903(3103)000123', altText: '', scale: { x: 2, y: 2 }, options: 'segments=4' },
                    { name: 'GS1 DataBar Expanded Stacked Composite', type: 'databarexpandedstackedcomposite', text: '(01)00012345678905(10)ABCDEF|(21)12345678', altText: '', scale: { x: 2, y: 2 }, options: 'segments=4' },
                    { name: 'GS1 DataBar Limited', type: 'databarlimited', text: '(01)15012345678907', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Limited Composite', type: 'databarlimitedcomposite', text: '(01)03512345678907|(21)abcdefghijklmnopqrstuv', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Omnidirectional', type: 'databaromni', text: '(01)24012345678905', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Omnidirectional Composite', type: 'databaromnicomposite', text: '(01)03612345678904|(11)990102', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Stacked', type: 'databarstacked', text: '(01)24012345678905', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Stacked Composite', type: 'databarstackedcomposite', text: '(01)03412345678900|(17)010200', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Stacked Omnidirectional', type: 'databarstackedomni', text: '(01)24012345678905', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Stacked Omnidirectional Composite', type: 'databarstackedomnicomposite', text: '(01)03612345678904|(11)990102', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Truncated', type: 'databartruncated', text: '(01)24012345678905', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 DataBar Truncated Composite', type: 'databartruncatedcomposite', text: '(01)03612345678904|(11)990102', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'GS1 QR Code', type: 'gs1qrcode', text: '(01)03453120000011(8200)http://www.abc.net(10)ABCD1234(410)9501101020917', altText: '', scale: { x: 2, y: 2 }, options: '' }

                ]
            },
            {
                "id": "5",
                "title": "EAN / UPC",
                "barcodes": [
                    { name: 'EAN-13', type: 'ean13', text: '2112345678900', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
                    { name: 'EAN-13 Composite', type: 'ean13composite', text: '2112345678900|(99)1234-abcd', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'EAN-2 (2 digit addon)', type: 'ean2', text: '05', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
                    { name: 'EAN-5 (5 digit addon)', type: 'ean5', text: '90200', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
                    { name: 'EAN-8', type: 'ean8', text: '02345673', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
                    { name: 'EAN-8 Composite', type: 'ean8composite', text: '02345673|(21)A12345678', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'UPC-A', type: 'upca', text: '416000336108', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'UPC-A Composite', type: 'upcacomposite', text: '416000336108|(99)1234-abcd', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'UPC-E', type: 'upce', text: '00123457', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'UPC-E Composite', type: 'upcecomposite', text: '00123457|(15)021231', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' }

                ]
            },
            {
                "id": "6",
                "title": "ISBN",
                "barcodes": [
                    { name: 'ISBN', type: 'isbn', text: '978-1-56581-231-4 52250', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
                    { name: 'ISMN', type: 'ismn', text: '979-0-2605-3211-3', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' },
                    { name: 'ISSN', type: 'issn', text: '0311-175X 00 17', altText: '', scale: { x: 2, y: 2 }, options: 'includetext guardwhitespace' }
                ]
            },
            {
                "id": "7",
                "title": "Business Card",
                "barcodes": [
                    { name: 'QR Code', type: 'qrcode', text: 'This is  QR Code' + '\r\n' + "asdad", altText: '', scale: { x: 2, y: 2 }, options: 'eclevel=M' },
                    { name: 'Data Matrix', type: 'datamatrix', text: 'This is Data Matrix!', altText: '', scale: { x: 2, y: 2 }, options: '' }

                ]
            },
            {
                "id": "8",
                "title": "Health Industry",
                "barcodes": [
                    { name: 'HIBC Codablock F', type: 'hibccodablockf', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'HIBC Code 128', type: 'hibccode128', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'HIBC Code 39', type: 'hibccode39', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'HIBC Data Matrix', type: 'hibcdatamatrix', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'HIBC MicroPDF417', type: 'hibcmicropdf417', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'HIBC PDF417', type: 'hibcpdf417', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'HIBC QR Code', type: 'hibcqrcode', text: 'A123BJC5D6E71', altText: '', scale: { x: 2, y: 2 }, options: '' },
                    { name: 'Italian Pharmacode', type: 'code32', text: '01234567', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'ITF-14', type: 'itf14', text: '0 46 01234 56789 3', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'Pharmaceutical Binary Code', type: 'pharmacode', text: '117480', altText: '', scale: { x: 2, y: 2 }, options: 'showborder' },
                    { name: 'Pharmazentralnummer (PZN)', type: 'pzn', text: '123456', altText: '', scale: { x: 2, y: 2 }, options: 'includetext' },
                    { name: 'Two-track Pharmacode', type: 'pharmacode2', text: '117480', altText: '', scale: { x: 2, y: 2 }, options: 'includetext showborder' }

                ]
            }

        ];

        var service = {
            interfaceDef: interfaceDef,
            getBarcodeTypes: getBarcodeTypes,
            getBarcodeGroups: getBarcodeGroups
        };

        function interfaceDef(callBack, taskCode, param) {
            if (taskCode) {
                service[taskCode](callBack, param);
            }
        }

        function getBarcodeTypes(callBack) {
            callBack(barcodeTypes);
        }

        function getBarcodeGroups(callBack) {
            callBack(barcodeGroups);
        }

        return service;
    }
})();
