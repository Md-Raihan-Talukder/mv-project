(function () {
    'use strict';

    angular
        .module('CustomDiective')
        .controller('CommentsDirectiveController', CommentsDirectiveController);

    /** @ngInject */

    function CommentsDirectiveController($scope, utilService, msUtils) {
        var vm = this;
        vm.notes = { expand: false };
        vm.comments = { expand: false };
        vm.shoHideForm = shoHideForm;
        vm.addNewComment = addNewComment;
        vm.checkUser = checkUser;
        vm.removeComment = removeComment;
        vm.usersComments = usersComments;


        function shoHideForm(type) {
            if (type === "notes") {
                vm.notes.expand = !vm.notes.expand;
            } else {
                vm.comments.expand = !vm.comments.expand;
            }
        }


        function usersComments(comment) {
            var user = utilService.getCurrentUser();
            return user.id === comment.person.id;
        }

        function removeComment(comment) {
            $scope.onRemoveItem({ item: comment });
        }

        function checkUser(comment) {
            var user = utilService.getCurrentUser();
            comment.showDelete = user.id === comment.person.id;
        }

        function addNewComment(newCommentText) {
            var user = utilService.getCurrentUser();

            var newComment = {
                id: msUtils.guidGenerator(),
                person: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar
                },
                message: newCommentText,
                time: 'now'
            };

            $scope.onAddItem({ item: newComment });

        }
    }

})();
