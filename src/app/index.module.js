(function () {
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('tech-diser', [

            // Core
            'app.core',
            'ui.ace',
            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick panel
            'app.quick-panel',
            'app.common',

            'ui.calendar',

            // main menu
            'app.tools',
            'CustomDiective',
            'app.pages',
            'app.dashboards',
            'app.video',
            //CODE_GENERATOR_MARKER_APP_NAME


        ]);
})();
