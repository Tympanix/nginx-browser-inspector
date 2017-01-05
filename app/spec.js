'use strict'

angular.module('nginxTrustedBrowsers').factory('Spec', function() {

    function Spec() {
        this.system = []
        this.platform = []
    }

    return Spec
});
