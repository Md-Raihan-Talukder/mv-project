(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('banglaFontService', banglaFontService);

    /** @ngInject */
    function banglaFontService() {

        var service = {
            arrangeText: arrangeText
        };

        function swapLeft(result, chr) {
            var lastChr = result[result.length - 1];
            result[result.length - 1] = chr;
            result.push(lastChr);
            return result;
        }

        function swapBoth(result, chr) {
            var left = '9C7';// Sign E
            var right = '9BE';// Sign A

            var uniChr = chr.charCodeAt(0).toString(16).toUpperCase();
            if (uniChr === '9CC') {
                var right = '9D7';// Sign A
            }

            var leftChr = String.fromCharCode(parseInt(left, 16));
            var rightChr = String.fromCharCode(parseInt(right, 16));

            var lastChr = result[result.length - 1];
            result[result.length - 1] = leftChr;
            result.push(lastChr);
            result.push(rightChr);
            return result;
        }

        function arrangeText(text) {
            var result = [];
            for (var i = 0; i < text.length; i++) {
                var chr = text[i];
                var chrType = checkType(chr);
                switch (chrType) {
                    case 'left':
                        result = swapLeft(result, chr);
                        break;
                    case 'both':
                        result = swapBoth(result, chr);
                        break;
                    default:
                        result.push(chr);
                        break;
                }
            }

            return result.join('');
        }

        function checkType(chr) {
            var uniChr = chr.charCodeAt(0).toString(16).toUpperCase();
            //console.log(uniChr); 
            switch (uniChr) {
                case '9BF'://SIGN I       
                case '9C7': //SIGN E                    
                case '9C8'://SIGN OI
                    return 'left'
                    break;
                case '9CB'://SIGN O       
                case '9CC': //SIGN OU                                        
                    return 'both'
                    break;
                default:
                    'default';
                    break;
            }
        }

        return service;
    }
})();