'use strict'

angular.module('nginxTrustedBrowsers').factory('common', function() {

    function Common() {
        this.enabled = true
        this.system = [/U/, /;?\s/, /\w\w-\w\w/, /[\d\._]+\+?/]
        this.platform = [/Version/, /AppleWebKit/]
        this.extensions = [/\(KHTML, like Gecko\)/, /\s/]
    }

    return [new Common()]
});
