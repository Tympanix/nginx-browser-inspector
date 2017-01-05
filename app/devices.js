'use strict'

angular.module('nginxTrustedBrowsers').factory('devices', function() {

    MOBILE_REGEX = 'Mobile(\\/[\\w\\d]+?)?'

    function iPad() {
        this.system = ['iPad', '(like )?Mac OS X', 'CPU OS']
        this.extensions = [MOBILE_REGEX]
    }

    function iPhone() {
        this.system = ['iPhone', '(like )?Mac OS X']
        this.extensions = [MOBILE_REGEX]
    }

    function Samsung() {
        this.system = ['Linux']
        this.android = ['Samsung', 'Galaxy']
        this.extensions = [MOBILE_REGEX]
    }

    function HTC() {
        this.system = ['Linux']
        this.android = ['HTC']
        this.extensions = [MOBILE_REGEX]
    }

    function Huawei() {
        this.system = ['Linux']
        this.android = ['Huawei']
        this.extensions = [MOBILE_REGEX]
    }

    function OnePlus() {
        this.system = ['Linux']
        this.android = ['A0001']
        this.extensions = [MOBILE_REGEX]
    }

    function Sony() {
        this.system = ['Linux']
        this.android = ['Sony']
        this.extensions = [MOBILE_REGEX]
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
