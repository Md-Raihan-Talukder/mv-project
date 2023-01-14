(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('factorySetupValidation', factorySetupValidation);

    /** @ngInject */
    function factorySetupValidation($mdDialog, utilService, PRIMARY_COLUMN_NAME) {
        var services = {
            canJobOmit: canJobOmit,
            canProductionPlantOmit: canProductionPlantOmit,
            canSectionOmit: canSectionOmit
        };

        return services;

        function canJobOmit(jobWantToOmit, inFactory) {
            var omittableJobId = jobWantToOmit[PRIMARY_COLUMN_NAME];
            var feedback = {
                "isOmittable": false,
                "reason": "Job has few dependencies"
            };

            var productionPlants = inFactory.productionPlants;
            for (var i = 0; i < productionPlants.length; i++) {
                var isImpossible = productionPlants[i].jobIds.indexOf(omittableJobId) > -1;
                if (isImpossible) {
                    feedback.reason = "Production plant " + productionPlants[i].title + " has dependency in " + jobWantToOmit.title;
                    return feedback;
                }
            }

            var sections = inFactory.sections;
            for (var i = 0; i < sections.length; i++) {
                var isImpossible = sections[i].jobId === omittableJobId ? true : false;
                if (isImpossible) {
                    feedback.reason = sections[i].sectionCode + " section has dependency in " + jobWantToOmit.title;
                    return feedback;
                }
            }

            var processGroups = inFactory.processGroups;
            for (var i = 0; i < processGroups.length; i++) {
                var isImpossible = processGroups[i].jobId === omittableJobId ? true : false;
                if (isImpossible) {
                    feedback.reason = processGroups[i].processGroupName + " operation has dependency in " + jobWantToOmit.title;
                    return feedback;
                }
            }

            var workers = inFactory.workers;
            for (var i = 0; i < workers.length; i++) {
                for (var j = 0; j < workers[i].skillSets.length; j++) {
                    var isImpossible = workers[i].skillSets[j].jobId === omittableJobId ? true : false;
                    if (isImpossible) {
                        feedback.reason = workers[i].name + " works in " + jobWantToOmit.title;
                        return feedback;
                    }
                }
            }

            var products = inFactory.products;
            for (var i = 0; i < products.length; i++) {
                var isImpossible = products[i].jobId === omittableJobId ? true : false;
                if (isImpossible) {
                    feedback.reason = "Factory product " + products[i].productName + " has dependency in " + jobWantToOmit.title;
                    return feedback;
                }
            }

            var processwiseSmvs = inFactory.processwiseSmvs;
            for (var i = 0; i < processwiseSmvs.length; i++) {
                var isImpossible = processwiseSmvs[i].jobId === omittableJobId ? true : false;
                if (isImpossible) {
                    feedback.reason = "SMV for " + processwiseSmvs[i].processName + " process has dependency in " + jobWantToOmit.title;
                    return feedback;
                }
            }

            feedback.isOmittable = true;
            return feedback;
        }

        function canProductionPlantOmit(productionPlantWantToOmit, inFactory) {
            var omittableProductionPlantId = productionPlantWantToOmit[PRIMARY_COLUMN_NAME];
            var feedback = {
                "isOmittable": false,
                "reason": "Production plant has few dependencies"
            };

            var sections = inFactory.sections;
            for (var i = 0; i < sections.length; i++) {
                var isImpossible = sections[i].productionPlantId === omittableProductionPlantId ? true : false;
                if (isImpossible) {
                    feedback.reason = sections[i].sectionCode + " section has dependency in " + productionPlantWantToOmit.title;
                    return feedback;
                }
            }

            var workers = inFactory.workers;
            for (var i = 0; i < workers.length; i++) {
                var isImpossible = workers[i].productionPlantId === omittableProductionPlantId ? true : false;
                if (isImpossible) {
                    feedback.reason = workers[i].name + " works in " + productionPlantWantToOmit.title;
                    return feedback;
                }
            }

            var products = inFactory.products;
            for (var i = 0; i < products.length; i++) {
                var isImpossible = products[i].productionPlantId === omittableProductionPlantId ? true : false;
                if (isImpossible) {
                    feedback.reason = "Factory product " + products[i].productName + " has dependency in " + productionPlantWantToOmit.title;
                    return feedback;
                }
            }

            var lineEfficiencies = inFactory.lineEfficiencies;
            for (var i = 0; i < lineEfficiencies.length; i++) {
                var isImpossible = lineEfficiencies[i].productionPlantId === omittableProductionPlantId ? true : false;
                if (isImpossible) {
                    feedback.reason = "Line efficiency calculation for " + lineEfficiencies[i].productName + " has dependency in " + productionPlantWantToOmit.title;
                    return feedback;
                }
            }

            feedback.isOmittable = true;
            return feedback;
        }

        function canSectionOmit(sectionWantToOmit, inFactory) {
            var omittableSectioinId = sectionWantToOmit[PRIMARY_COLUMN_NAME];
            var feedback = {
                "isOmittable": false,
                "reason": "Section has few dependencies"
            };

            var workers = inFactory.workers;
            for (var i = 0; i < workers.length; i++) {
                var isImpossible = (workers[i].sectionId === omittableSectioinId && workers[i].deleted == false) ? true : false;
                if (isImpossible) {
                    feedback.reason = workers[i].name + " works in " + sectionWantToOmit.sectionCode;
                    return feedback;
                }
            }

            var lineEfficiencies = inFactory.lineEfficiencies;
            for (var i = 0; i < lineEfficiencies.length; i++) {
                var isImpossible = lineEfficiencies[i].sectionId === omittableSectioinId ? true : false;
                if (isImpossible) {
                    feedback.reason = "Line efficiency calculation for " + lineEfficiencies[i].productName + " has dependency in " + sectionWantToOmit.sectionCode;
                    return feedback;
                }
            }

            feedback.isOmittable = true;
            return feedback;
        }
    }
})();
