(function () {
    'use strict';

    angular
        .module('app.team.project-contacts')
        .controller('ProjectContactsController', ProjectContactsController);

    /** @ngInject */
    function ProjectContactsController($timeout, $q, $log, $scope, $mdSidenav, msUtils, $mdDialog, $document, teamService) {

        var vm = this;
        vm.loadCurrentPos = loadCurrentPos;
        vm.loadContcts = loadContcts;
        vm.selectedItemChange = selectedItemChange;
        vm.selectedItemChange = selectedItemChange;
        vm.querySearch = querySearch;

        vm.selectedItemChange1 = selectedItemChange1;
        vm.selectedItemChange1 = selectedItemChange1;
        vm.querySearch1 = querySearch1;
        vm.removeMember = removeMember;
        vm.openContactDialog = openContactDialog;


        function openContactDialog(ev, contact) {
            $mdDialog.show({
                controller: 'ContactDialogController',
                controllerAs: 'vm',
                templateUrl: 'app/main/team/contacts/dialogs/contact/contact-dialog.html',
                parent: angular.element($document.find('#content-container')),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    Contact: contact,
                    User: vm.user,
                    Contacts: vm.contacts
                }
            });
        }

        function removeMember(team, member) {

            var index = getMemberIndex(team, member);

            if (index > -1) {
                team.members.splice(index, 1);
            }
        }

        function querySearch1(query) {
            var results = query ? vm.contacts.filter(createFilterFor(query)) : vm.contacts;
            return results;
        }


        function searchTextChange1(text) {
            $log.info('Text changed to ' + text);
        }

        function getMemberIndex(team, member) {
            for (var i = 0; i < team.members.length; i++) {
                if (team.members[i].id === member.id) {
                    return i;
                }
            }
            return -1;
        }

        function selectedItemChange1(team, item) {
            if (item) {
                if (!team.members) team.members = [];
                var index = getMemberIndex(team, item);
                if (index < 0) {
                    team.members.push(item);
                }
            }
        }

        vm.loadCurrentPos();
        vm.loadContcts();

        vm.autoComplete = {
            isDisabled: false,
            noCache: true,
            repos: vm.pos,
            querySearch: vm.querySearch,
            selectedItemChange: vm.selectedItemChange,
            searchTextChange: vm.searchTextChange
        };

        vm.sideNaveAutoComplete = {
            isDisabled: false,
            noCache: true,
            repos: vm.pos,
            querySearch: vm.querySearch,
            selectedItemChange: vm.selectedItemChange,
            searchTextChange: vm.searchTextChange
        };

        vm.toggleSidenav = toggleSidenav;
        vm.selectPo = selectPo;
        vm.addNewTeam = addNewTeam;

        function selectPo(po) {
            vm.selectedPo = po;
        }

        function addNewTeam(newTemName) {
            vm.selectedPo.teams.push({ title: newTemName });
        }




        function querySearch(query) {
            var results = query ? vm.pos.filter(createFilterFor(query)) : vm.pos;

            //var deferred = $q.defer();

            if (vm.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
                return results;
            }


            // teamService.getPo()
            // .success(function (response) {
            //     var repos = response.data;

            //     results = repos.map( function (repo) {
            //         repo.value = repo.poNo.toLowerCase();
            //         return repo;
            //       });

            //     results = results.filter( createFilterFor(query));

            //     deferred.resolve( results );
            // })
            // .error(function (err) {

            // });     

            // return deferred.promise;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(item) {
                return (item.value.indexOf(lowercaseQuery) === 0);
            };
        }

        function loadContcts() {

            teamService.getContacts()
                .success(function (response) {
                    var repos = response.data;
                    vm.contacts = repos.map(function (repo) {
                        repo.value = repo.name.toLowerCase();
                        return repo;
                    });

                })
                .error(function (err) {

                });
        }

        function loadCurrentPos() {

            teamService.getPo()
                .success(function (response) {
                    var repos = response.data;
                    vm.pos = repos.map(function (repo) {
                        repo.value = repo.poNo.toLowerCase();
                        return repo;
                    });
                    vm.selectedPo = vm.pos[0];
                })
                .error(function (err) {

                });
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
        }

        function selectedItemChange(item) {
            if (item) {
                vm.selectedPo = item;
            }
        }

        function toggleSidenav(sidenavId) {
            $mdSidenav(sidenavId).toggle();
        }

    }

})();