(function () {
    'use strict';

    angular
        .module('app.mail', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider) {
        // State
        $stateProvider
            .state('app.mail', {
                abstract: true,
                url: '/mail'
            })
            .state('app.mail.threads', {
                url: '/:type/:filter',
                views: {
                    'content@app': {
                        templateUrl: 'app/main/apps/mail/mail.html',
                        controller: 'MailController as vm'
                    }
                },
                params: {
                    type: {
                        value: null,
                        squash: true
                    }
                },
                bodyClass: 'mail'
            })
            .state('app.mail.threads.thread', {
                url: '/:threadId',
                bodyClass: 'mail'
            });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/mail');

        // Api
        msApiProvider.register('mail.folders', ['app/data/mail/folders.json']);
        msApiProvider.register('mail.labels', ['app/data/mail/labels.json']);

        msApiProvider.register('mail.label.notes', ['app/data/mail/labels/notes.json']);
        msApiProvider.register('mail.label.paypal', ['app/data/mail/labels/paypal.json']);
        msApiProvider.register('mail.label.invoices', ['app/data/mail/labels/invoices.json']);
        msApiProvider.register('mail.label.amazon', ['app/data/mail/labels/amazon.json']);

        msApiProvider.register('mail.folder.inbox', ['app/data/mail/folders/inbox.json']);
        msApiProvider.register('mail.folder.sent', ['app/data/mail/folders/sent.json']);
        msApiProvider.register('mail.folder.drafts', ['app/data/mail/folders/drafts.json']);
        msApiProvider.register('mail.folder.spam', ['app/data/mail/folders/spam.json']);
        msApiProvider.register('mail.folder.trash', ['app/data/mail/folders/trash.json']);
        msApiProvider.register('mail.folder.starred', ['app/data/mail/folders/starred.json']);
        msApiProvider.register('mail.folder.important', ['app/data/mail/folders/important.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('communications.mail', {
            title: 'Mails',
            icon: 'icon-email',
            state: 'app.mail.threads',
            stateParams: {
                type: 'folder',
                filter: 'inbox'
            },
            class: 'mail-count',
            badge: {
                content: 25,
                color: '#F44336'
            },
            weight: 1
        });
    }
})();