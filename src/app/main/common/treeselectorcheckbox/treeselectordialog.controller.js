(function () {
    'use strict';

    angular
        .module('app.common')
        .controller('TreeselectorCheckBoxDialogController', TreeselectorCheckBoxDialogController);

    /** @ngInject */
    function TreeselectorCheckBoxDialogController($mdDialog, Items, Type, utilService, $timeout, PRIMARY_COLUMN_NAME) {
        var vm = this;
        vm.saveDialog = saveDialog;
        vm.closeDialog = closeDialog;
        vm.selectItem = selectItem;
        vm.checkedItems = [];
        vm.showSegments = showSegments;
        vm.checkedCard = [];
        vm.isTree = Type;
        vm.removeCard = removeCard;

        init()

        function init() {
            vm.treeOptions = {
                showCheckbox: true,
                showUserBtn: false,
                showAddBtn: false,
                showRemoveBtn: false,
                maxLevel: 100
            }

            vm.items = angular.copy(Items)
        }

        function showSegments(section) {
            vm.segmentsOfSection = section;
        }

        function selectItem(item, event, callBack) {
            if (!Type) {
                console.log(item);
                var isRoleExist = vm.checkedItems.indexOf(item[PRIMARY_COLUMN_NAME]);
                if (isRoleExist > -1) {
                    item.isChecked = false;
                    vm.checkedItems.splice(isRoleExist, 1);
                }
                else {
                    item.isChecked = true;
                    vm.checkedItems.push(item.TECHDISER_ID);
                }
                console.log(vm.checkedItems);


            }
            if (item && Type) {
                var i, j, k, l, m, n, o, p, q, r, s, t;
                if (item.level == 1) {
                    if (item.isChecked) {
                        // card exist
                        var checkSection = utilService.getIndex(item.nodes, "isChecked", false);
                        if (checkSection > -1) {
                            // if a section not checked but card has
                            item.isChecked = true;
                            item.itemChecked = false;

                            for (q = 0; q < item.nodes.length; q++) {
                                item.nodes[q].isChecked = true;
                                item.nodes[q].itemChecked = true;
                                for (k = 0; k < item.nodes[q].nodes.length; k++) {
                                    item.nodes[q].nodes[k].isChecked = true;
                                    item.nodes[q].nodes[k].itemChecked = true;
                                }
                            }
                        }
                        else {
                            item.isChecked = false;
                            item.itemChecked = true;

                            for (q = 0; q < item.nodes.length; q++) {
                                item.nodes[q].isChecked = false;
                                item.nodes[q].itemChecked = false;
                                for (k = 0; k < item.nodes[q].nodes.length; k++) {
                                    item.nodes[q].nodes[k].isChecked = false;
                                    item.nodes[q].nodes[k].itemChecked = false;
                                }
                            }
                        }
                        // for (i = 0; i < item.nodes.length; i++) {
                        //     if (item.nodes[i].isChecked) {
                        //         for (j = 0; j < item.nodes[i].nodes.length; j++) {
                        //             if (item.nodes[i].nodes[j].isChecked) {
                        //                 item.nodes[i].nodes[j].isChecked = false;
                        //                 item.nodes[i].nodes[j].itemChecked = false;
                        //             }
                        //             else {
                        //                 item.nodes[i].nodes[j].isChecked = true;
                        //                 item.nodes[i].nodes[j].itemChecked = true;
                        //             }
                        //         }
                        //         var noSegment = utilService.getIndex(item.nodes[i].nodes, "isChecked", true);
                        //         if (noSegment<0) {
                        //             item.nodes[i].isChecked = false;
                        //             item.nodes[i].itemChecked = false;
                        //         }
                        //
                        //     }
                        //     else {
                        //         // if a section not checked but card has
                        //         item.isChecked = true;
                        //         item.itemChecked = false;
                        //
                        //         for (q = 0; q < item.nodes.length; q++) {
                        //             item.nodes[q].isChecked = true;
                        //             item.nodes[q].itemChecked = true;
                        //             for (k = 0; k < item.nodes[i].nodes.length; k++) {
                        //                 item.nodes[i].nodes[k].isChecked = true;
                        //                 item.nodes[i].nodes[k].itemChecked = true;
                        //             }
                        //         }
                        //
                        //
                        //     }
                        // }
                        // var noSection = utilService.getIndex(item.nodes, "isChecked", true);
                        // if (noSection<0) {
                        //     item.isChecked = false;
                        //     item.itemChecked = true;
                        // }

                    }
                    else {
                        // if card not exist
                        item.isChecked = true;
                        item.itemChecked = false;
                        for (l = 0; l < item.nodes.length; l++) {
                            item.nodes[l].isChecked = true;
                            item.nodes[l].itemChecked = true;
                            for (m = 0; m < item.nodes[l].nodes.length; m++) {
                                item.nodes[l].nodes[m].isChecked = true;
                                item.nodes[l].nodes[m].itemChecked = true;
                            }
                        }
                    }

                }
                else if (item.level == 2) {
                    var cardIndex = utilService.getIndex(vm.items, PRIMARY_COLUMN_NAME, item.parentId);
                    var cardOfSection = vm.items[cardIndex];

                    if (cardOfSection.isChecked) {
                        if (item.isChecked) {
                            item.isChecked = false;
                            item.itemChecked = true;
                            for (p = 0; p < item.nodes.length; p++) {
                                item.nodes[p].isChecked = false;
                                item.nodes[p].itemChecked = false;
                            }
                        }
                        else {
                            item.isChecked = true;
                            item.itemChecked = false;
                            for (o = 0; o < item.nodes.length; o++) {
                                item.nodes[o].isChecked = true;
                                item.nodes[o].itemChecked = true;
                            }
                        }

                        var noSection = utilService.getIndex(cardOfSection.nodes, "isChecked", true);
                        if (noSection < 0) {
                            cardOfSection.isChecked = false;
                            cardOfSection.itemChecked = false;
                        }
                    }
                    else {
                        cardOfSection.isChecked = true;
                        cardOfSection.itemChecked = true;
                        item.isChecked = true;
                        item.itemChecked = false;
                        for (n = 0; n < item.nodes.length; n++) {
                            item.nodes[n].isChecked = true;
                            item.nodes[n].itemChecked = true;
                        }
                    }

                }
                else if (item.level == 3) {
                    var indexSection = utilService.getIndex(vm.items, PRIMARY_COLUMN_NAME, item.parentId);
                    var sectionOfSegment = vm.items[indexSection];
                    var indexCard = utilService.getIndex(vm.items, PRIMARY_COLUMN_NAME, sectionOfSegment.parentId);
                    var cardOfSegment = vm.items[indexCard];
                    if (cardOfSegment.isChecked) {
                        if (sectionOfSegment.isChecked) {
                            if (item.isChecked) {
                                item.isChecked = false;
                                item.itemChecked = true;
                            }
                            else {
                                item.isChecked = true;
                                item.itemChecked = false;
                            }
                            var noSegment = utilService.getIndex(sectionOfSegment.nodes, "isChecked", true);
                            if (noSegment < 0) {
                                sectionOfSegment.isChecked = false;
                                sectionOfSegment.itemChecked = false;
                            }
                        }
                        else {
                            sectionOfSegment.isChecked = true;
                            sectionOfSegment.itemChecked = true;
                            item.isChecked = true;
                            item.itemChecked = false;
                        }
                        var noSection = utilService.getIndex(cardOfSegment.nodes, "isChecked", true);
                        if (noSection < 0) {
                            cardOfSegment.isChecked = false;
                            cardOfSegment.itemChecked = false;
                        }
                    }
                    else {
                        cardOfSegment.isChecked = true;
                        cardOfSegment.itemChecked = true;
                        sectionOfSegment.isChecked = true;
                        sectionOfSegment.itemChecked = true;
                        item.isChecked = true;
                        item.itemChecked = false;
                    }
                }




                // console.log(item);

                // 13.7.17

                // var i,j,k,l,m,n,o,p;
                // if (item.level == 1) {
                //     var flatOne = {
                //         "TECHDISER_ID": utilService.generateId(),
                //         "TECHDISER_SERIAL_NO": vm.flat.length + 1,
                //         "title": item.title
                //     }
                //     vm.flat.push(flatOne);
                //     for (i = 0; i < item.nodes.length; i++) {
                //         //item.nodes[i].TECHDISER_ID = utilService.generateId();
                //         var flatTwo = {
                //             "TECHDISER_ID": utilService.generateId(),
                //             "TECHDISER_SERIAL_NO": vm.flat.length + 1,
                //             "title": item.nodes[i].title,
                //             "parentId": flatOne.TECHDISER_ID
                //         }
                //         vm.flat.push(flatTwo);
                //         for (j = 0; j < item.nodes[i].nodes.length; j++) {
                //             var flatThree = {
                //                 "TECHDISER_ID": utilService.generateId(),
                //                 "TECHDISER_SERIAL_NO": vm.flat.length + 1,
                //                 "title": item.nodes[i].nodes[j].title,
                //                 "parentId": flatTwo.TECHDISER_ID
                //             }
                //             vm.flat.push(flatThree);
                //         }
                //     }
                // }
                // else if(item.level == 2) {
                //     var indexOfSecCard = utilService.getIndex(vm.items, PRIMARY_COLUMN_NAME, item.parentId);
                //     var cardOfSection = vm.items[indexOfSecCard];
                //     var levelTwoCard = {
                //         "TECHDISER_ID": utilService.generateId(),
                //         "TECHDISER_SERIAL_NO": vm.flat.length + 1,
                //         "title": cardOfSection.title
                //     }
                //     vm.flat.push(levelTwoCard);
                //     var levelTwoSection = {
                //         "TECHDISER_ID": utilService.generateId(),
                //         "TECHDISER_SERIAL_NO": vm.flat.length + 1,
                //         "title": item.title,
                //         "parentId": levelTwoCard.TECHDISER_ID
                //     }
                //     vm.flat.push(levelTwoSection);
                //     for (k = 0; k < item.nodes.length; k++) {
                //         var levelTwoSegment = {
                //             "TECHDISER_ID": utilService.generateId(),
                //             "TECHDISER_SERIAL_NO": vm.flat.length + 1,
                //             "title": item.nodes[k].title,
                //             "parentId": levelTwoSection.TECHDISER_ID
                //         }
                //         vm.flat.push(levelTwoSegment);
                //     }
                // }
                // else if (item.level == 3) {
                //     var indexOfSegSec = utilService.getIndex(vm.items, PRIMARY_COLUMN_NAME, item.parentId);
                //     var sectionOfSegment = vm.items[indexOfSegSec];
                //     var indexOfSegSecCard = utilService.getIndex(vm.items, PRIMARY_COLUMN_NAME, sectionOfSegment.parentId);
                //     var cardOfSectionOfSegment = vm.items[indexOfSegSecCard];
                //     var levelThreeCard = {
                //         "TECHDISER_ID": utilService.generateId(),
                //         "TECHDISER_SERIAL_NO": vm.flat.length + 1,
                //         "title": cardOfSectionOfSegment.title
                //     }
                //     vm.flat.push(levelThreeCard);
                //     var levelThreeSection = {
                //         "TECHDISER_ID": utilService.generateId(),
                //         "TECHDISER_SERIAL_NO": vm.flat.length + 1,
                //         "title": sectionOfSegment.title,
                //         "parentId": levelThreeCard.TECHDISER_ID
                //     }
                //     vm.flat.push(levelThreeSection);
                //     var levelThreeSegment = {
                //         "TECHDISER_ID": utilService.generateId(),
                //         "TECHDISER_SERIAL_NO": vm.flat.length + 1,
                //         "title": item.title,
                //         "parentId": levelThreeSection.TECHDISER_ID
                //     }
                //     vm.flat.push(levelThreeSegment);
                // }
                // console.log(vm.flat);

                // 13.7.17

                // if(vm.flat){
                //     var flats = $.grep(vm.flat, function(item){
                //         return !item.deleted;
                //     });
                //     var sortedItems = utilService.sortItems(flats);
                // }
                //
                // console.log(sortedItems);
                // var map = {}, node, roots = [];
                // for (var i = 0; i < sortedItems.length; i += 1) {
                //     node = sortedItems[i];
                //     node.sortedItems = [];
                //     map[node[PRIMARY_COLUMN_NAME]] = i;
                //     if (node.parentId) {
                //         if(sortedItems[map[node.parentId]]){
                //             if(!sortedItems[map[node.parentId]].sortedItems){
                //                 sortedItems[map[node.parentId]].sortedItems = [];
                //             }
                //
                //             sortedItems[map[node.parentId]].sortedItems.push(node);
                //         }
                //     } else {
                //         roots.push(node);
                //     }
                // }
                // console.log(roots);
                // vm.items = roots;


                //12.7.17

                // var copyItems = angular.copy(vm.items);
                // var i,j,k,l,m,n,o;
                // if (item.level == 1) {
                //     var isCardExist = utilService.getIndex(vm.checkedItems, "title", item.title);
                //     if (isCardExist === -1){
                //         // push
                //         for (i = 0; i < item.nodes.length; i++) {
                //             item.nodes[i].itemChecked = true;
                //             for (j = 0; j < item.nodes[i].nodes.length; j++) {
                //                 item.nodes[i].nodes[j].itemChecked = true;
                //             }
                //         }
                //         vm.checkedItems.push(item);
                //     }
                //     else {
                //         // splice
                //         for (i = 0; i < item.nodes.length; i++) {
                //             item.nodes[i].itemChecked = false;
                //             for (j = 0; j < item.nodes[i].nodes.length; j++) {
                //                 item.nodes[i].nodes[j].itemChecked = false;
                //             }
                //         }
                //         vm.checkedItems.splice(isCardExist,1);
                //     }
                // }
                // else if (item.level == 2) {
                //     //var copyItems = angular.copy(vm.items);
                //     var indexOfSecCard = utilService.getIndex(copyItems, PRIMARY_COLUMN_NAME, item.parentId);
                //     var cardNameOfSec = copyItems[indexOfSecCard];
                //     for ( i = 0; i < vm.checkedItems.length; i++) {
                //         var isSectionExist = utilService.getIndex(vm.checkedItems[i].nodes, "title", item.title);
                //         if (isSectionExist>-1) {
                //             break;
                //         }
                //     }
                //     if (isSectionExist>-1) {
                //         vm.checkedItems[i].nodes.splice(isSectionExist,1);
                //         if(vm.checkedItems[i].nodes.length<1){
                //             vm.checkedItems.splice(i,1);
                //         }
                //         for (l = 0; l < item.nodes.length; l++) {
                //             item.nodes[l].itemChecked = false;
                //         }
                //     }
                //     else  {
                //
                //         var levelTwo = {
                //             "title": cardNameOfSec.title,
                //             "nodes": [item],
                //             "TECHDISER_ID": cardNameOfSec.TECHDISER_ID
                //         }
                //         var m;
                //         var indexOfCard = -1;
                //         for ( m = 0; m < vm.checkedItems.length; m++) {
                //
                //              indexOfCard = utilService.getIndex(vm.checkedItems, PRIMARY_COLUMN_NAME, levelTwo.TECHDISER_ID);
                //             if (indexOfCard>-1) {
                //                 break;
                //             }
                //         }
                //         if(indexOfCard<0){
                //             vm.checkedItems.push(levelTwo);
                //             for (k = 0; k < item.nodes.length; k++) {
                //                 item.nodes[k].itemChecked = true;
                //             }
                //         }
                //         else {
                //             vm.checkedItems[indexOfCard].nodes.push(item);
                //         }
                //
                //     }
                //     console.log(vm.checkedItems);
                //
                // }
                // else if (item.level == 3){
                //     //item.itemChecked = true;
                //     console.log(item);
                //     var p,q,r,s;
                //     var indexOfSegSec = utilService.getIndex(copyItems, PRIMARY_COLUMN_NAME, item.parentId);
                //     var sectionOfSegment = angular.copy(copyItems[indexOfSegSec]);
                //     var indexOfSegSecCard = utilService.getIndex(copyItems, PRIMARY_COLUMN_NAME, sectionOfSegment.parentId);
                //     var cardOfSectionOfSegment = angular.copy(copyItems[indexOfSegSecCard]);
                //     // console.log(sectionOfSegment);
                //     // console.log(cardOfSectionOfSegment);
                //     var isCardExist = utilService.getIndex(vm.checkedItems, PRIMARY_COLUMN_NAME, cardOfSectionOfSegment.TECHDISER_ID);
                //     if(isCardExist>-1){
                //         var isSectionExist = utilService.getIndex(vm.checkedItems[isCardExist].nodes, PRIMARY_COLUMN_NAME, sectionOfSegment.TECHDISER_ID);
                //         if(isSectionExist>-1){
                //             var isSegmentExist = utilService.getIndex(vm.checkedItems[isCardExist].nodes[isSectionExist].nodes, PRIMARY_COLUMN_NAME, item.TECHDISER_ID);
                //
                //         }
                //         else {
                //             var isSegmentExist = -1;
                //         }
                //     }
                //     else {
                //         var isSectionExist = -1; var isSegmentExist = -1;
                //     }
                //
                //     // var isCardExist = utilService.getIndex(vm.checkedItems, PRIMARY_COLUMN_NAME, cardOfSectionOfSegment.TECHDISER_ID);
                //     if (isCardExist<0) {
                //         // No Card Mactching
                //         if(isSectionExist<0){
                //
                //             if(isSegmentExist<0){
                //                 var levelThree = {
                //                     "title": cardOfSectionOfSegment.title,
                //                     "nodes": [
                //                         {
                //                             "title": sectionOfSegment.title,
                //                             "nodes": [item],
                //                             "TECHDISER_ID": sectionOfSegment.TECHDISER_ID
                //                         }
                //                     ],
                //                     "TECHDISER_ID": cardOfSectionOfSegment.TECHDISER_ID
                //                 }
                //                 vm.checkedItems.push(levelThree);
                //             }
                //             else {
                //                 vm.checkedItems[isCardExist].nodes[isSectionExist].nodes.push(item);
                //             }
                //
                //         }
                //         else {
                //
                //         }
                //
                //     }
                //     else {
                //         // card maching
                //         if (isSectionExist>-1) {
                //             if(isSegmentExist>-1){
                //                 vm.checkedItems[isCardExist].nodes[isSectionExist].nodes.splice(isSegmentExist,1);
                //             }
                //             else {
                //                 vm.checkedItems[isCardExist].nodes[isSectionExist].nodes.push(item);
                //             }
                //             if(vm.checkedItems[isCardExist].nodes[isSectionExist].nodes.length<1){
                //                 vm.checkedItems[isCardExist].nodes.splice(isSectionExist,1);
                //             }
                //         }
                //         else {
                //             // Card Matching but no section Matching
                //             var levelThreeSection = {
                //                 "title": sectionOfSegment.title,
                //                 "nodes": [item],
                //                 "TECHDISER_ID": sectionOfSegment.TECHDISER_ID
                //             }
                //             vm.checkedItems[isCardExist].nodes.push(levelThreeSection);
                //
                //         }
                //         if(vm.checkedItems[isCardExist].nodes.length<1){
                //             vm.checkedItems.splice(isCardExist,1);
                //         }
                //
                //     }
                //     console.log(vm.checkedItems);


                // 12.7.17





                // var indexOfSegSec = utilService.getIndex(vm.items, PRIMARY_COLUMN_NAME, item.parentId);
                // var secName = angular.copy(vm.items[indexOfSegSec]);
                // secName.nodes = [angular.copy(item)];
                // var indexOfSegSecCard = utilService.getIndex(vm.items, PRIMARY_COLUMN_NAME, secName.parentId);
                // var cardNameOfSeg = angular.copy(vm.items[indexOfSegSecCard]);
                // var k,l;
                // for ( k = 0; k < vm.checkedItems.length; k++) {
                //     for ( l = 0; l < vm.checkedItems.length; l++) {
                //         var isSegmentExist = utilService.getIndex(vm.checkedItems[k].nodes[l].nodes, "title", item.title);
                //         if (isSegmentExist>-1) {
                //             break;
                //         }
                //
                //     }
                //     if(isSegmentExist>-1){
                //         break;
                //     }
                //
                // }
                // if (isSegmentExist>-1) {
                //     vm.checkedItems[k].nodes[l].nodes.splice(isSegmentExist,1);
                //     if(vm.checkedItems[k].nodes[l].nodes.length<1){
                //         vm.checkedItems[k].nodes.splice(l,1);
                //     }
                // }
                // else  {
                //     var levelThree = {
                //         "title": cardNameOfSeg.title,
                //         "nodes": [secName]
                //     }
                //
                //     vm.checkedItems.push(levelThree);
                // }

                // console.log(vm.checkedItems);
                // }
                // console.log(vm.checkedItems);


            }


            // To Load View
            vm.ckitem = false;
            $timeout(function () {
                vm.ckitem = true;
            }, 400);

            //$mdDialog.hide(item);
        }
        function removeCard(card) {
            console.log(card);
            card.isChecked = false;
            card.itemChecked = false;
        }

        function saveDialog() {
            if (vm.checkedItems.length > 0) {
                $mdDialog.hide(vm.checkedItems);
            }
            else {
                $mdDialog.hide(vm.items);
            }

        }
        function closeDialog() {
            $mdDialog.hide();
        }


    }

})();
