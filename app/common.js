'use strict'

angular.module('nginxTrustedBrowsers').factory('common', function() {

    function Default() {
        this.system = ['U', ';?\\s', '[\\d\\._]+\\+?']
        this.platform = ['Version', 'AppleWebKit']
        this.extensions = ['\\(KHTML, like Gecko\\)|\\s']
    }

    return new Default()
});
