'use strict'

angular.module('nginxTrustedBrowsers').factory('devices', function() {

    function iPad() {
        this.system = ['iPad', '(like )?Mac OS X']
    }

    function iPhone() {
        this.system = ['iPhone', '(like )?Mac OS X']
    }

    function Samsung() {
        this.android = ['Samsung', 'Galaxy']
    }

    function HTC() {
        this.android = ['HTC']
    }

    function Huawei() {
        this.android = ['Huawei']
    }

    function OnePlus() {
        this.android = ['A0001']
    }

    function Sony() {
        this.android = ['Sony']
    }

    return [
        new iPad(),
        new iPhone(),
        new Samsung(),
        new HTC(),
        new Huawei(),
        new OnePlus(),
        new Sony()
    ]
});
