(function () {
    'use strict';

    angular
        .module('app.systemsettings', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider) {

        $stateProvider
            .state('app.systemsettings', {
                abstract: true,
                url: '/systemsettings'
            })
            .state('app.systemsettings.supplydefinition', {
                url: '/supplydefinition',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/supplydefinition/supplydefinition.html',
                        controller: 'SupplyDefinitionController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.supplierrating', {
                url: '/supplierrating',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/supplierrating/supplierrating.html',
                        controller: 'SupplierRatingController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.stitchsetup', {
                url: '/stitchsetup',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/stitchsetup/stitchsetup.html',
                        controller: 'StitchSetupController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.supply-definition', {
                url: '/supply-definition',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/supply-definition/supply-definition.html',
                        controller: 'SupplyDefinitionTreeController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.costing-heads', {
                url: '/costing-heads',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/costing-heads/costing-heads.html',
                        controller: 'CostingHeadsTreeController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.pi-heads', {
                url: '/pi-heads',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/pi-heads/pi-heads.html',
                        controller: 'PiHeadsController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.import-inco', {
                url: '/import-inco',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/import-inco/import-inco.html',
                        controller: 'ImportInCoController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            // .state('app.systemsettings.export-inco', {
            //     url: '/export-inco',
            //     views: {
            //         'content@app': {
            //             templateUrl: 'app/main/systemsettings/export-inco/export-inco.html',
            //             controller: 'ExportIncoController as vm'
            //         }
            //     },
            //     bodyClass: 'systemsettings'
            // })
            .state('app.systemsettings.shipment-time', {
                url: '/shipment-time',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/shipment-time/shipment-time.html',
                        controller: 'ShipmentTimeController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.lump-sum-cost', {
                url: '/lump-sum-cost',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/lump-sum-cost/lump-sum-cost.html',
                        controller: 'LumpSumCostController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.packing-type', {
                url: '/packing-type',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/packing-type/packing-type.html',
                        controller: 'PackingTypeController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.folding-type', {
                url: '/folding-type',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/folding-type/folding-type.html',
                        controller: 'FoldingTypeController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.label-setup', {
                url: '/label-setup',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/packing-label-setup/packing-label-setup.html',
                        controller: 'LabelSetupController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.bom-setup', {
                url: '/bom-setup',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/bom-setup/bom-setup.html',
                        controller: 'BomSetupController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.test-setup', {
                url: '/test-setup',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/test-setup/test-setup.html',
                        controller: 'TestSetupController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.material-packaging', {
                url: '/material-packaging',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/material-packaging/material-packaging.html',
                        controller: 'MaterialPackagingController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.dupro-setup', {
                url: '/dupro-setup',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/dupro-setup/dupro-setup.html',
                        controller: 'DuproSetupController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.material-check-point', {
                url: '/material-check-point',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/material-check-point/material-check-point.html',
                        controller: 'MaterialCheckPointController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.stackeholder-setup', {
                url: '/stackeholder-setup',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/stackeholder/stackeholder-setup.html',
                        controller: 'StackeholderSetupController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.document-sets', {
                url: '/document-sets',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/document-sets/document-sets.html',
                        controller: 'DocumentSetsController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.document-setup', {
                url: '/document-setup',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/documents/documents.html',
                        controller: 'DocumentsController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            })
            .state('app.systemsettings.wbs-time-setup', {
                url: '/wbs-time-setup',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/systemsettings/wbs-time-setup/wbs-time-setup.html',
                        controller: 'WBSTimeSetupController as vm'
                    }
                },
                bodyClass: 'systemsettings'
            });


        msNavigationServiceProvider.saveItem('systemsettings', {
            title: 'System Settings',
            icon: 'icon-cog-box',
            weight: 0
        });
        msNavigationServiceProvider.saveItem('systemsettings.jobSourcingPolicy', {
            title: 'Job Sourcing Policy',
            state: 'app.systemsettings.jobSourcingPolicy',
            icon: 'icon-cog-box',
            weight: -1
        });
        msNavigationServiceProvider.saveItem('systemsettings.containerSetup', {
            title: 'Container Setup',
            state: 'app.systemsettings.containerSetup',
            icon: 'icon-cog-box',
            weight: -1
        });
        msNavigationServiceProvider.saveItem('systemsettings.dupro-setup', {
            title: 'DUPRO Setup',
            state: 'app.systemsettings.dupro-setup',
            icon: 'icon-store',
            weight: 1
        });
        msNavigationServiceProvider.saveItem('systemsettings.material-check-point', {
            title: 'Material Check Point',
            state: 'app.systemsettings.material-check-point',
            icon: 'icon-store',
            weight: 1
        });
        msNavigationServiceProvider.saveItem('systemsettings.material-packaging', {
            title: 'Material Packaging',
            state: 'app.systemsettings.material-packaging',
            icon: 'icon-store',
            weight: 1
        });
        msNavigationServiceProvider.saveItem('systemsettings.bom-setup', {
            title: 'BOM Setup',
            state: 'app.systemsettings.bom-setup',
            icon: 'icon-store',
            weight: 1
        });
        msNavigationServiceProvider.saveItem('systemsettings.test-setup', {
            title: 'Test Setup',
            state: 'app.systemsettings.test-setup',
            icon: 'icon-store',
            weight: 2
        });
        msNavigationServiceProvider.saveItem('systemsettings.supplydefinition', {
            title: 'Supply Definition old v.',
            state: 'app.systemsettings.supplydefinition',
            icon: 'icon-store',
            weight: 1
        });
        msNavigationServiceProvider.saveItem('systemsettings.supplierrating', {
            title: 'Rating',
            state: 'app.systemsettings.supplierrating',
            icon: 'icon-cursor-pointer',
            weight: 2
        });
        msNavigationServiceProvider.saveItem('systemsettings.stitchsetup', {
            title: 'Stitch Setup',
            state: 'app.systemsettings.stitchsetup',
            icon: 'icon-ruler',
            weight: 3
        });
        msNavigationServiceProvider.saveItem('systemsettings.supply-definition', {
            title: 'Supply Definition',
            state: 'app.systemsettings.supply-definition',
            icon: 'icon-castle',
            weight: 4
        });
        msNavigationServiceProvider.saveItem('systemsettings.costing-heads', {
            title: 'Costing Heads',
            state: 'app.systemsettings.costing-heads',
            icon: 'icon-store',
            weight: 5
        });
        msNavigationServiceProvider.saveItem('systemsettings.pi-heads', {
            title: 'PI Heads',
            state: 'app.systemsettings.pi-heads',
            icon: 'icon-store',
            weight: 5
        });
        msNavigationServiceProvider.saveItem('systemsettings.import-inco', {
            title: 'InCo',
            state: 'app.systemsettings.import-inco',
            icon: 'icon-import',
            weight: 6
        });
        // msNavigationServiceProvider.saveItem('systemsettings.export-inco', {
        //     title: 'Export InCo',
        //     state: 'app.systemsettings.export-inco',
        //     icon: 'icon-export',
        //     weight: 7
        // });
        msNavigationServiceProvider.saveItem('systemsettings.shipment-time', {
            title: 'Shipment Time',
            state: 'app.systemsettings.shipment-time',
            icon: 'icon-timer-sand',
            weight: 8
        });
        msNavigationServiceProvider.saveItem('systemsettings.lump-sum-cost', {
            title: 'Lump Sum Cost',
            state: 'app.systemsettings.lump-sum-cost',
            icon: 'icon-coin',
            weight: 9
        });
        msNavigationServiceProvider.saveItem('systemsettings.packing-type', {
            title: 'Packing Consumption',
            state: 'app.systemsettings.packing-type',
            icon: 'icon-package-variant',
            weight: 10
        });
        msNavigationServiceProvider.saveItem('systemsettings.folding-type', {
            title: 'Folding Consumption',
            state: 'app.systemsettings.folding-type',
            icon: 'icon-cube-unfolded',
            weight: 11
        });
        msNavigationServiceProvider.saveItem('systemsettings.label-setup', {
            title: 'Packing Label Setup',
            state: 'app.systemsettings.label-setup',
            icon: 'icon-label-outline',
            weight: 4
        });
        msNavigationServiceProvider.saveItem('systemsettings.stackeholder-setup', {
            title: 'Stackeholder',
            state: 'app.systemsettings.stackeholder-setup',
            icon: 'icon-label-outline',
            weight: 14
        });
        msNavigationServiceProvider.saveItem('systemsettings.document-sets', {
            title: 'Document Sets',
            state: 'app.systemsettings.document-sets',
            icon: 'icon-label-outline',
            weight: 15
        });
        msNavigationServiceProvider.saveItem('systemsettings.document-setup', {
            title: 'Document',
            state: 'app.systemsettings.document-setup',
            icon: 'icon-label-outline',
            weight: 16
        });
        msNavigationServiceProvider.saveItem('systemsettings.wbs-time-setup', {
            title: 'WBS Time Setup',
            state: 'app.systemsettings.wbs-time-setup',
            icon: 'icon-store',
            weight: -1
        });
    }
})();
