'use strict'

angular.module('nginxTrustedBrowsers').factory('os', function() {

    function Windows() {
        this.icon = 'windows'
        this.system = ['Windows( NT)?', 'Win64', 'x64']
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
