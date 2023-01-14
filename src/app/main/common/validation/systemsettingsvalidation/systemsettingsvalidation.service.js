(function () {
    'use strict';

    angular
        .module('app.common')
        .factory('systemSettingsValidation', systemSettingsValidation);

    /** @ngInject */
    function systemSettingsValidation(PRIMARY_COLUMN_NAME) {
        var services = {
            issueTypeCanBeOmitted: issueTypeCanBeOmitted
        };

        return services;

        function issueTypeCanBeOmitted(issueType, issues) {
            var omittableIssueTypeId = issueType[PRIMARY_COLUMN_NAME];
            var feedback = {
                "isOmittable": true
            };

            for (var i = 0; i < issues.length; i++) {
                if ((issues[i].issueTypeId === omittableIssueTypeId) && (!issues[i].deleted)) {
                    feedback.isOmittable = false;
                    feedback.reason = issueType.title + " has issue with " + issues[i].title;
                    break;
                }
            }

            return feedback;
        }
    }
})();
