'use strict'

angular.module('nginxTrustedBrowsers').factory('common', function() {

    function Default() {
        this.system = [';?\\s', '[\\d\\._]+\\+?']
        this.platform = ['Version', 'AppleWebKit']
    }

    return new Default()
});
