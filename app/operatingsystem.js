'use strict'

angular.module('nginxTrustedBrowsers').factory('os', function() {

    function Windows() {
        this.icon = 'windows'
        this.system = ['Windows', 'NT']
    }

    function Linux() {
        this.icon = 'linux'
        this.system = ['Linux', 'X11']
    }

    function Mac() {
        this.icon = 'apple'
        this.system = ['Macintosh']
    }

    return [
        new Windows(),
        new Linux(),
        new Mac()
    ]
});
