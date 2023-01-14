(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('emptyImageService', emptyImageService);

    /** @ngInject */
    function emptyImageService(msbUtilService) {

        var service = {
            getImage: getImage
        };

        function getImage(name) {
            var index = msbUtilService.getIndex(images, "name", name);
            if (index > -1) {
                return images[index];
            }
        }

        var images = [
            {
                "name": "profile",
                "data": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMDAwMDAwQEBAQFBQUFBQcHBgYHBwsICQgJCAsRCwwLCwwLEQ8SDw4PEg8bFRMTFRsfGhkaHyYiIiYwLTA+PlQBAwMDAwMDBAQEBAUFBQUFBwcGBgcHCwgJCAkICxELDAsLDAsRDxIPDg8SDxsVExMVGx8aGRofJiIiJjAtMD4+VP/CABEIAGAAYAMBIgACEQEDEQH/xAAbAAEBAQADAQEAAAAAAAAAAAAACAcEBQYJA//aAAgBAQAAAAD6QAADwOO8XevYAYbJIuDSARTloq7egSXhYp6igRLmI1a0gTDOopSlAfj87eveqv4BFOWtcswHV4jLIpzdO4eHwfE+GDlbRvkIgA//xAAXAQEBAQEAAAAAAAAAAAAAAAAAAwIB/9oACAECEAAAAKtMm6o5bqlh26HHboctoZ//xAAXAQADAQAAAAAAAAAAAAAAAAAAAQMC/9oACAEDEAAAAMCGGYl2ZiW0KDsxRLOWAN//xAA2EAABAwIDBQQIBgMAAAAAAAABAgMEBREGByEAEiAxURATQYEIFCIjMGFxkSQmMkBCgmJyof/aAAgBAQABPwD9hiTMvCWGVrakzO/kp0MaOnvFg9DyCdqj6QNQUtQptHYQnwVIWpwnyTu22gekBXEOj16lQnW/EMlbSvuor2wljihYyiKdgu7rqdHYztg4g/S+o+Y+BnJjuTh+KzR6c6pqXMbK3XUmym2b29noVEc9iSo3PPtBKSCDYjkRtlXiGRiPB8Z6SvvJEVa4zqzqVluxST87KF+POZxxeYFRC+TbUdKPp3aTw5AH8t1QdKhf7tp48+aYiPiWFOQpP4uFZQ8d5o2v9lcPo+SUKgVuNdO8l9le742UCL/8484XZa8f1Jt51SktJZSyDyQgtpVYeZ4cl5MhjHsNtsqCH2JCHR1SEFYv5p487MGVV+rorsGI4/HVEAlFA3y2Wr+0oD+NuAAqNhz2yYwJWabVnK1VIbkVAjFEdDuiypwi6t3mLAcciO1KjvMOp3m3UKQtPVKxY7VenuUmqToDmq4kl1lR6ltRTftwJDM/GNCZ3N4GoMqUn/FtQUr4Ob1Tw/UsVvKpbLiXmVFma5oEPONm28mx8ie3KLEeHMPVtZqTDpky1NMR5ACShgKNlFVyLX6jjqtbpFDj+s1KYxFa8FOrAv8AIDmT9NsV550hMCTGoLT7slbZS3JWju0IvpvAE3JHhe2xJUVEquTqSeDB+eFMap0SHXmpIfZbCDKQkOJWBoFKF7362vtR6/RsQR+/pk1iU347itR/snmnz7cQ5iYSwyVtzJ6VSE847PvXL9CBon+xG2JM9azO32aLGRBaOgeXZx4/Qck7T6jUKpIVJnSXZDyubjqys/c8cKfNp0hEmJJdjPJ/S40soUPMbYbzzr9O3GawwiosjTvRZt0Dy0VthzMbCWKChqJOS1IVyjP+7cv0F9Ff1J2JKjc6k8z8MEpNxoRyO3//xAAdEQEAAwACAwEAAAAAAAAAAAABAAIQICESMTJB/9oACAECAQE/AMK2fyNbB64UBdt1Z2n1t/rRTGKugsOiMRMKV4+BP//EABsRAQACAwEBAAAAAAAAAAAAAAEAEAISISAx/9oACAEDAQE/AK2IZD4zULx+Xn8vB5aDR1gBexHrDjDIa3fO7P/Z"
            },
            {
                "name": "default",
                "data": "data:image/jpeg;base64,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"
            }
        ];


        return service;
    }
})();