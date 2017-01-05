'use strict'

angular.module('nginxTrustedBrowsers').factory('os', function() {

    function Windows() {
        this.icon = 'windows'
        this.system = ['Windows( NT)?', 'Win64', 'x64', 'WOW64']
    }

    function Linux() {
        this.icon = 'linux'
        this.system = ['Linux', 'X11', 'x86_64']
    }

    function Mac() {
        this.icon = 'apple'
        this.system = ['Macintosh', '(Intel|PPC) Mac OS X']
    }

    return [
        new Windows(),
        new Linux(),
        new Mac()
    ]
});
