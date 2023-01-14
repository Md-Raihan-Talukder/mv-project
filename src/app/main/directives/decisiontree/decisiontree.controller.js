(function () {
    'use strict';

    angular
        .module('tech-diser')
        .controller('decisionTreeDirectiveController', decisionTreeDirectiveController);

    /** @ngInject */
    function decisionTreeDirectiveController($scope, DISCISION_ROOT, NO_ACTION, utilService) {
        var vm = this;

        //vm.selectedNodes=$scope.selectedNodes;

        var rootNode = null;

        function setParent(tree) {
            if (tree) {
                var fnd = false;
                if (tree.children) {
                    for (var i = 0; i < tree.children.length; i++) {
                        fnd = setParent(tree.children[i]);
                        if (!tree.isParent) {
                            tree.isParent = fnd;
                        }
                    }
                }
                return tree.isParent || !tree.notAnOption
            }
            return false;
        }

        function shrinkTree(tree) {
            if (tree) {
                if (tree.children) {
                    for (var i = 0; i < tree.children.length;) {
                        if (tree.children[i] && !tree.children[i].isParent && tree.children[i].notAnOption) {
                            tree.children.splice(i, 1);
                        }
                        else {
                            shrinkTree(tree.children[i]);
                            i++;
                        }
                    }
                }
            }
        }

        var defaultHeight = 700;
        var defaultWidth = 3200;
        var heightUnit = 60;
        var widthUnit = 400;
        var wdt = defaultWidth;
        var hgt = defaultHeight;

        function shrinkSpace(data) {
            var tData = angular.fromJson(angular.toJson(data));

            if ($scope.isShrinked) {
                shrinkTree(tData);
            }

            return tData;
        }

        setParent($scope.treeData);
        vm.tData = shrinkSpace($scope.treeData);

        //vm.tData=$scope.treeData

        $scope.$watch('tid',
            function handleChange(newValue, oldValue) {
                if (newValue != oldValue) {
                    setParent($scope.treeData);
                    if ($scope.isShrinked) {
                        vm.tData = shrinkSpace($scope.treeData);
                    }
                    else {
                        vm.tData = angular.fromJson(angular.toJson($scope.treeData));
                    }
                    initDecisionTree();
                }
            }
        );

        $scope.$watch('isShrinked',
            function handleChange(newValue, oldValue) {
                if (newValue != oldValue) {
                    vm.tData = shrinkSpace($scope.treeData);
                    initDecisionTree();
                }
            }
        );
        $scope.$watch('selectedCase',
            function handleChange(newValue, oldValue) {
                if ($scope.selectedCase) {
                    vm.tData = shrinkSpace($scope.treeData);
                    initDecisionTree();
                }
            }
        );

        function checkInSelectedCase(d) {
            if ($scope.selectedCase && d && $scope.selectedCase.nodes) {
                for (var i = 0; i < $scope.selectedCase.nodes.length; i++) {
                    if ($scope.selectedCase.nodes[i] && $scope.selectedCase.nodes[i].nodeRoute && d.nodeRoute && $scope.selectedCase.nodes[i].nodeRoute.toLowerCase() == d.nodeRoute.toLowerCase()) {
                        return true;
                    }
                }
            }
            return false;
        }



        $scope.$watch('decisionCase',
            function handleChange(newValue, oldValue) {
                if ($scope.decisionCase) {
                    console.log('loading tree');
                    initDecisionTree();
                }
            }
        );

        function initDecisionTree() {

            var i = 0,
                duration = 750,
                root;

            hgt = defaultHeight;
            wdt = defaultWidth;
            if (!$scope.isShrinked && $scope.area) {
                if ($scope.area.height) {
                    hgt = $scope.area.height * heightUnit;
                }
                if ($scope.area.width) {
                    wdt = $scope.area.width * widthUnit;
                }

            }

            var margin = { top: 20, right: 120, bottom: 20, left: 200 },
                width = wdt - margin.right - margin.left,
                height = hgt - margin.top - margin.bottom;

            var tree = d3.layout.tree()
                .size([height, width]);

            var diagonal = d3.svg.diagonal()
                .projection(function (d) { return [d.y, d.x]; });

            $("#decision-tree").html('');

            var svg = d3.select("#decision-tree").append("svg")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            root = vm.tData;
            root.x0 = height / 2;
            root.y0 = 0;
            d3.select(self.frameElement).style("height", "800px");



            function collapse(d) {
                if (d.children) {
                    d._children = d.children;
                    d._children.forEach(collapse);
                    d.children = null;
                }
            }

            setHasOption(root);
            setToalVotes(root);
            initSelectedStatus(root);

            //root.children.forEach(collapse);
            update(root);
            /***************Json string***************/

            // if(d && d.id && d.parent){
            //       if(d.parent.children){
            //         for(var i=0;i<d.parent.children.length;i++){
            //           if(d.parent.children[i] && d.parent.children[i].id){
            //             if(d.parent.children[i].id.toLowerCase()!=d.id.toLowerCase()){

            //             }
            //           }
            //         }
            //       }

            //     }

            function setHasOption(tree) {
                if (tree) {
                    if (!tree.containsOption) {
                        tree.containsOption = false;
                    }
                    if (tree.children) {
                        for (var i = 0; i < tree.children.length; i++) {
                            if (tree.children[i]) {
                                tree.containsOption = setHasOption(tree.children[i]);
                                if (!tree.children[i].notAnOption) {
                                    tree.containsOption = true;
                                }
                            }
                        }
                    }
                    return tree.containsOption;
                }
                return false;
            }

            function initSelectedStatus(tree) {
                if (tree) {
                    if (tree.notAnOption) {
                        //console.log('setting status of: '+tree.title + ', initial status: '+ tree.selected + ', total votes: '+ tree.totalVotes + ', casted votes: '+tree.castedVotes);
                        setNodeSelectStatus(tree);
                        //console.log('set status of: '+tree.title + ', current status: '+ tree.selected + ', total votes: '+ tree.totalVotes + ', casted votes: '+tree.castedVotes);
                    }
                    if (tree.children) {
                        for (var i = 0; i < tree.children.length; i++) {
                            if (tree.children[i]) {
                                initSelectedStatus(tree.children[i]);
                            }
                        }
                    }
                }
            }

            function setToalVotes(d) {
                if (d) {
                    if (!d.castedVotes) {
                        d.castedVotes = initCastedVotes();
                    }
                    d.totalVotes = 0;
                    if (d.children) {
                        var optionCounted = false;
                        for (var i = 0; i < d.children.length; i++) {
                            if (d.children[i]) {
                                if (!optionCounted && !d.children[i].notAnOption) {
                                    optionCounted = true;
                                    d.totalVotes++;
                                }
                                else if (d.children[i].notAnOption && d.children[i].containsOption) {
                                    d.totalVotes++;
                                }
                                setToalVotes(d.children[i]);
                            }
                        }
                    }
                }
            }

            function setNodeSelectStatus(d) {
                var stts = false;
                if (d && d.castedVotes) {
                    if (d.castedVotes.length == d.totalVotes) {
                        stts = true;
                    }
                    d.selected = stts;
                }
            }

            function initCastedVotes() {
                return [];
            }

            function addToCastedVotes(d, negatedVotes) {
                if (d && d.id && d.parent) {
                    //console.log('casting vote: '+d.title + ', status: '+d.selected +', to: '+d.parent.title + ', status: '+ d.parent.selected + ', total votes: '+ d.parent.totalVotes + ', votes: '+d.parent.castedVotes);
                    if (d.parent.castedVotes && d.selected) {
                        var i = d.parent.castedVotes.indexOf(d.id.toLowerCase());
                        if (i < 0) {
                            d.parent.castedVotes.push(d.id.toLowerCase());
                            if (negatedVotes) {
                                addRemoveNegatedNodes(negatedVotes, d, true);
                            }
                        }
                    }
                    setNodeSelectStatus(d.parent);
                    //console.log('casted vote: '+d.title + ', status: '+d.selected +', to: '+d.parent.title + ', status: '+ d.parent.selected + ', total votes: '+ d.parent.totalVotes + ', votes: '+d.parent.castedVotes);
                }
            }

            function addRemoveNegatedNodes(negatedVotes, d, toRemove) {
                if (negatedVotes && d && d.id) {
                    var i = 0;
                    for (; i < negatedVotes.length; i++) {
                        if (negatedVotes[i] && negatedVotes[i].id) {
                            if (d.id.toLowerCase() == negatedVotes[i].id.toLowerCase()) {
                                if (toRemove) {
                                    negatedVotes.splice(i, 1);
                                    return;
                                }
                                break;
                            }
                        }
                    }
                    if (i >= negatedVotes.length && !toRemove) {
                        negatedVotes.push(d);
                    }
                }
            }

            function removeFromCastedVotes(d, negatedVotes) {
                if (d && d.id && d.parent) {
                    //console.log('cancelling vote: '+d.title + ', status: '+d.selected +', from: '+ d.parent.title + ', status: '+ d.parent.selected + ', total votes: '+ d.parent.totalVotes + ', votes: '+d.parent.castedVotes);
                    if (d.parent.castedVotes) {
                        var i = d.parent.castedVotes.indexOf(d.id.toLowerCase());
                        if (i >= 0 && i < d.parent.castedVotes.length) {
                            d.parent.castedVotes.splice(i, 1);
                            if (negatedVotes) {
                                addRemoveNegatedNodes(negatedVotes, d);
                            }
                        }
                    }
                    setNodeSelectStatus(d.parent);
                    //console.log('canceled vote: '+d.title + ', status: '+d.selected +', from: '+ d.parent.title + ', status: '+ d.parent.selected + ', total votes: '+ d.parent.totalVotes + ', votes: '+d.parent.castedVotes);
                }
            }

            function negateSucessorVotes(d, negatedVotes) {
                if (d && d.id) {
                    // if(d.parent){
                    removeFromCastedVotes(d, negatedVotes);
                    //}
                    if (d.children) {
                        for (var i = 0; i < d.children.length; i++) {
                            if (d.children[i] && d.children[i].id) {
                                if (d.children[i].id.toLowerCase() != d.id.toLowerCase()) {
                                    negateSucessorVotes(d.children[i], negatedVotes)
                                }
                            }
                        }
                    }
                }
            }

            function negatedAlternateVotes(d, negatedVotes) {
                if (d && d.id) {
                    removeFromCastedVotes(d, negatedVotes);
                    if (d.parent) {
                        if (d.parent.children) {
                            for (var i = 0; i < d.parent.children.length; i++) {
                                if (d.parent.children[i] && d.parent.children[i].id) {
                                    if (d.parent.children[i].id.toLowerCase() != d.id.toLowerCase()) {
                                        if (!d.parent.children[i].notAnOption) {
                                            negateSucessorVotes(d.parent.children[i], negatedVotes);
                                        }
                                    }
                                }
                            }
                        }
                        negatedAlternateVotes(d.parent, negatedVotes);
                    }
                }
            }

            function upadateElectoralStatus(d, toCast, negatedVotes) {
                if (d) {
                    if (toCast) {
                        addToCastedVotes(d, negatedVotes);
                    }
                    else {
                        removeFromCastedVotes(d, negatedVotes);
                    }
                    if (d.parent) {
                        upadateElectoralStatus(d.parent, toCast, negatedVotes);
                    }
                }
            }

            function setCircleStyle(id, clr) {
                if (id) {
                    var nd = d3.select("circle[id='" + id.toLowerCase() + "']");
                    if (nd && nd.length > 0) {
                        if (nd[0] && nd[0].length > 0 && nd[0][0]) {
                            nd[0][0].style = "fill:" + clr;
                        }
                    }
                }
            }
            function setLinkStyle(id, clr, wdt) {
                if (id) {
                    var nd = d3.select("path[id='" + id.toLowerCase() + "']");
                    if (nd && nd.length > 0) {
                        if (nd[0] && nd[0].length > 0 && nd[0][0]) {
                            //nd[0][0].style.stroke=clr +" ; "+activeLinkWidth;
                            nd[0][0].style.stroke = clr;
                            nd[0][0].style.strokeWidth = wdt;
                        }
                    }
                }
            }

            function setNotRequired(d) {
                if (d) {
                    if (d.selected && NO_ACTION.indexOf(utilService.removeDuplicateNumber(d.id)) >= 0) {
                        d.notRequired = true;
                    }
                    else {
                        d.notRequired = false;
                    }
                    //console.log('Setting notRequired of "'+d.id+'" to '+d.notRequired+', having selection status: '+d.selected);
                }
            }

            function activateLinks(d) {
                if (d) {
                    setNotRequired(d);
                    if (d.selected) {
                        setLinkStyle(d.id, activeLinkClass, activeLinkWidth);
                        //activateLinks(d.parent);
                    }
                    else {
                        setLinkStyle(d.id, blurLinkClass, blurLinkWidth);
                    }
                    if (d.parent) {
                        activateLinks(d.parent);
                    }
                }
            }

            function deactivateLinks(nds) {
                if (nds) {
                    for (var i = 0; i < nds.length; i++) {
                        setLinkStyle(nds[i].id, blurLinkClass, blurLinkWidth);
                        setNotRequired(nds[i])
                    }
                }
            }

            var blurColor = '#fff';
            var activeColor = '#0bf016';

            var blurLinkClass = 'gray';
            var activeLinkClass = 'steelblue';
            var activeLinkWidth = '1px';
            var blurLinkWidth = '.3px';

            function blurAlternateNodes(nds) {
                if (nds && nds.length > 0) {
                    for (var i = 0; i < nds.length; i++) {
                        if (nds[i] && nds[i].id && !nds[i].notAnOption && !nds[i].isParent) {
                            setCircleStyle(nds[i].id, blurColor);
                            setLinkStyle(nds[i].id, blurLinkClass, blurLinkWidth);
                        }
                    }
                }
            }

            function adjustNegatedNodes(nds) {
                if (nds && nds.length > 0) {
                    for (var i = 0; i < nds.length; i++) {
                        if (nds[i] && nds[i].id && !nds[i].notAnOption && !nds[i].isParent) {
                            nds[i].selected = false;
                        }
                    }
                }
            }



            function updateDecisionTree(nds) {
                blurAlternateNodes(nds)
                //path
            }

            function copyToActivityNode(selectedNode, activityNode, notRequired) {

                //console.log('adding: '+selectedNode.title);
                activityNode.nodeRoute = selectedNode.nodeRoute;
                activityNode.children = [];
                activityNode.notAnOption = selectedNode.notAnOption;
                activityNode.pathToNode = selectedNode.pathToNode;
                activityNode.unitType = selectedNode.unitType;
                activityNode.refPathToNode = selectedNode.refPathToNode;
                activityNode.notRequired = (notRequired) ? true : false;
            }

            function updateActivity(selectedNode, activityNode, choiceNode, notRequired) {
                // if(notRequired){
                //   console.log('got it');
                // }
                if (!selectedNode) {
                    $scope.activities.splice(0, $scope.activities.length);
                    for (var i = 0; i < $scope.choice.length; i++) {
                        if ($scope.choice[i]) {
                            var nd = fetchNode($scope.choice[i].nodeRoute, $scope.treeData);
                            if (nd && nd.notAnOption) {
                                $scope.activities.push({});
                                updateActivity(nd, $scope.activities[$scope.activities.length - 1], $scope.choice[i], $scope.choice[i].notRequired)
                            }
                        }
                    }
                }
                else {
                    if (selectedNode.notAnOption) {
                        notRequired = (notRequired) ? true : false;
                        copyToActivityNode(selectedNode, activityNode, notRequired)
                    }
                    if (selectedNode.children) {
                        for (var j = 0; j < selectedNode.children.length; j++) {
                            if (selectedNode.children[j]) {
                                if (selectedNode.children[j].notAnOption) {
                                    activityNode.children.push({});
                                    updateActivity(selectedNode.children[j], activityNode.children[activityNode.children.length - 1], choiceNode, notRequired)
                                }
                                else if (selectedNode.children[j].nodeRoute && choiceNode) {
                                    //  console.log('checking '+selectedNode.children[j].title);
                                    var nd = fetchNode(selectedNode.children[j].nodeRoute, choiceNode);
                                    if (nd) {
                                        notRequired = (nd.notRequired) ? nd.notRequired : notRequired;
                                        updateActivity(selectedNode.children[j], activityNode, choiceNode, notRequired)
                                    }
                                }
                            }
                        }
                    }
                }
            }


            function setSelectedNodesToChioce() {
                $scope.choice.splice(0, $scope.choice.length);
                var lastActivityNode = null;
                for (var j = 0; j < $scope.selectedNodes.length; j++) {
                    if ($scope.selectedNodes[j]) {
                        if ($scope.selectedNodes[j].pathToParent) {
                            if ($scope.choice.length > 0) {
                                var i = 0;
                                for (; i < $scope.choice.length; i++) {
                                    if ($scope.choice[i]) {
                                        var nd = fetchNode($scope.selectedNodes[j].pathToParent, $scope.choice[i]);
                                        if (nd) {
                                            if (!nd.children) {
                                                nd.children = [];
                                            }
                                            nd.children.push({ 'nodeRoute': $scope.selectedNodes[j].nodeRoute, 'pathToNode': $scope.selectedNodes[j].pathToNode, 'refPathToNode': $scope.selectedNodes[j].refPathToNode, 'children': [], 'notAnOption': $scope.selectedNodes[j].notAnOption, 'title': $scope.selectedNodes[j].title, 'pathToParent': $scope.selectedNodes[j].pathToParent, 'unitType': $scope.selectedNodes[j].unitType, 'notRequired': $scope.selectedNodes[j].notRequired });
                                            break;
                                        }
                                    }
                                }
                                if (i >= $scope.choice.length) {
                                    $scope.choice.push({ 'nodeRoute': $scope.selectedNodes[j].nodeRoute, 'pathToNode': $scope.selectedNodes[j].pathToNode, 'refPathToNode': $scope.selectedNodes[j].refPathToNode, 'children': [], 'notAnOption': $scope.selectedNodes[j].notAnOption, 'title': $scope.selectedNodes[j].title, 'pathToParent': $scope.selectedNodes[j].pathToParent, 'unitType': $scope.selectedNodes[j].unitType, 'notRequired': $scope.selectedNodes[j].notRequired });
                                }
                            }
                            else {
                                $scope.choice.push({ 'nodeRoute': $scope.selectedNodes[j].nodeRoute, 'pathToNode': $scope.selectedNodes[j].pathToNode, 'refPathToNode': $scope.selectedNodes[j].refPathToNode, 'children': [], 'notAnOption': $scope.selectedNodes[j].notAnOption, 'title': $scope.selectedNodes[j].title, 'pathToParent': $scope.selectedNodes[j].pathToParent, 'unitType': $scope.selectedNodes[j].unitType, 'notRequired': $scope.selectedNodes[j].notRequired });
                            }
                        }
                        else {
                            $scope.choice.push({ 'nodeRoute': $scope.selectedNodes[j].nodeRoute, 'pathToNode': $scope.selectedNodes[j].pathToNode, 'refPathToNode': $scope.selectedNodes[j].refPathToNode, 'children': [], 'notAnOption': $scope.selectedNodes[j].notAnOption, 'title': $scope.selectedNodes[j].title, 'pathToParent': $scope.selectedNodes[j].pathToParent, 'unitType': $scope.selectedNodes[j].unitType, 'notRequired': $scope.selectedNodes[j].notRequired });
                        }
                    }
                }
                //  console.log('got it');
            }

            function fetchSelectedNodes(selectedNode) {

                if (!selectedNode) {
                    //console.log('starting fetchSelectedNodes');
                    selectedNode = vm.tData;
                    $scope.selectedNodes.splice(0, $scope.selectedNodes.length);
                }
                if (selectedNode.selected) {
                    if (!selectedNode.parent) {
                        $scope.selectedNodes.push({ 'nodeRoute': selectedNode.nodeRoute, 'pathToNode': selectedNode.pathToNode, 'refPathToNode': selectedNode.refPathToNode, 'pathToParent': DISCISION_ROOT, 'notAnOption': selectedNode.notAnOption, 'title': selectedNode.title, 'unitType': selectedNode.unitType, 'notRequired': selectedNode.notRequired });
                    }
                    else {
                        $scope.selectedNodes.push({ 'nodeRoute': selectedNode.nodeRoute, 'pathToNode': selectedNode.pathToNode, 'refPathToNode': selectedNode.refPathToNode, 'pathToParent': selectedNode.parent.nodeRoute, 'notAnOption': selectedNode.notAnOption, 'title': selectedNode.title, 'unitType': selectedNode.unitType, 'notRequired': selectedNode.notRequired });
                    }
                    // console.log('node: '+selectedNode.title+', path: '+selectedNode.nodeRoute);
                    // console.log($scope.selectedNodes);
                }
                if (selectedNode.children) {
                    for (var i = 0; i < selectedNode.children.length; i++) {
                        if (selectedNode.children[i] && selectedNode.children[i].nodeRoute) {
                            fetchSelectedNodes(selectedNode.children[i]);
                        }
                    }
                }

            }

            function pollVote(d) {
                var negatedVotes = [];
                if (d) {
                    if (d.selected) {
                        setCircleStyle(d.id, activeColor);
                        setLinkStyle(d.id, activeLinkClass, activeLinkWidth);
                        negatedAlternateVotes(d, negatedVotes);
                    }
                    else {
                        setCircleStyle(d.id, blurColor);
                        setLinkStyle(d.id, blurLinkClass, blurLinkWidth);
                    }
                    upadateElectoralStatus(d, d.selected, negatedVotes);
                    adjustNegatedNodes(negatedVotes);
                }
                return negatedVotes;
            }

            function fetchNode(nodeRoute, selectedNode) {
                if (!selectedNode) {
                    selectedNode = root;
                }
                if (selectedNode && selectedNode.nodeRoute) {
                    if (selectedNode.nodeRoute.toLowerCase() == nodeRoute.toLowerCase()) {
                        return selectedNode;
                    }
                    if (selectedNode.children) {
                        for (var i = 0; i < selectedNode.children.length; i++) {
                            if (selectedNode.children[i] && selectedNode.children[i].nodeRoute) {
                                var nd = fetchNode(nodeRoute, selectedNode.children[i]);
                                if (nd) {
                                    return nd;
                                }
                            }
                        }
                    }
                }
                return null;
            }

            function makeDecision(d) {

                if (d && !d.isParent && !d.notAnOption) {
                    previousNode = d;
                    d.selected = !d.selected;

                    setTimeout(
                        function () {
                            var nds = pollVote(d);
                            if (nds) {
                                updateDecisionTree(nds);
                                activateLinks(d);
                                deactivateLinks(nds);
                                fetchSelectedNodes();
                                setSelectedNodesToChioce();
                                updateActivity();
                                var ob = $scope.activities;
                            }
                        }, 500);
                }

            }


            var previousNode = null;

            function checkNodeInDecisionCase(d) {
                if ($scope.decisionCase && $scope.decisionCase.nodes && d && d.pathToNode) {
                    for (var i = 0; i < $scope.decisionCase.nodes.length; i++) {
                        if ($scope.decisionCase.nodes[i] && $scope.decisionCase.nodes[i].pathToNode && $scope.decisionCase.nodes[i].pathToNode.toLowerCase() == d.pathToNode.toLowerCase()) {
                            //console.log('matched: '+$scope.decisionCase.nodes[i].pathToNode);
                            return true;
                        }
                    }
                }
                return false;
            }

            function update(source) {

                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.
                nodes.forEach(function (d) { d.y = d.depth * 180; });

                // Update the nodes…
                var node = svg.selectAll("g.node")
                    .data(nodes, function (d) { return d.id || (d.id = ++i); });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    .attr("transform", function (d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                    });


                //var texts = d3.selectAll("text[attrName=attrValue]");
                nodeEnter.append("circle")
                    .attr("r", function () {
                        return 1e-10;
                    })
                    .attr("id", function (d) {
                        //console.log(d.id);
                        return d.id ? d.id.toLowerCase() : '';
                    })
                    .attr("pathToNode", function (d) {
                        return d.pathToNode ? d.pathToNode.toLowerCase() : '';
                    })
                    .attr("refPathToNode", function (d) {
                        return d.refPathToNode ? d.refPathToNode.toLowerCase() : '';
                    })
                    .attr("nodeRoute", function (d) {
                        return d.nodeRoute ? d.nodeRoute.toLowerCase() : '';
                    })
                    .attr("unitType", function (d) {
                        return d.unitType ? d.unitType.toLowerCase() : '';
                    })
                    .attr("class", function (d) {
                        return d.isParent;
                    })
                    .style("fill", function (d) {
                        var nd = fetchNode(d.nodeRoute);
                        if (nd && (nd.isParent || nd.notAnOption)) {
                            return "gray";
                        }
                        if (checkInSelectedCase(d)) {
                            makeDecision(d);
                        }
                        return d._children ? "lightsteelblue" : "#fff";
                    })
                    .on("click", function (d, e) {
                        if ($scope.isShrinked) {
                            makeDecision(d);
                        }
                        else {
                            click(d, e)
                        }
                    });

                nodeEnter.append("text")
                    .attr("x", function (d) { return d.children || d._children ? -10 : 10; })
                    .attr("dy", ".35em")
                    .attr("id", function (d) {
                        return d.id ? d.id.toLowerCase() : '';
                    })
                    .attr("text-anchor", function (d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .text(function (d) {
                        return d.title;
                    })
                    .on("click", function (d, e) {
                        if ($scope.isShrinked) {
                            makeDecision(d);
                        }
                        else {
                            click(d, e)
                        }
                    });


                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

                nodeUpdate.select("circle")
                    .attr("r", 8.5)
                    .style("fill", function (d) {
                        var nd = fetchNode(d.nodeRoute);
                        if (nd && (nd.isParent || nd.notAnOption)) {
                            return "gray";
                        }
                        if (d.selected) {
                            return "#40f006";
                        }
                        return d._children ? "lightsteelblue" : "#fff";
                    });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + source.y + "," + source.x + ")";
                    })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-10).style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });

                nodeExit.select("text")
                    .style("fill-opacity", 1e-10);

                // Update the links…
                var link = svg.selectAll("path.link")
                    .data(links, function (d) { return d.target.id; });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("id", function (d) {
                        if (d.target) {
                            return d.target.id ? d.target.id.toLowerCase() : '';
                        }
                        return '';
                    })
                    .attr("d", function (d) {
                        var o = { x: source.x0, y: source.y0 };
                        return diagonal({ source: o, target: o });
                    });

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function (d) {
                        var o = { x: source.x, y: source.y };
                        return diagonal({ source: o, target: o });
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            // Toggle children on click.
            function click(d, e) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }
        }

        initDecisionTree();

    }
})();