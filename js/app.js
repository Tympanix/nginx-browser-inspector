var app = angular.module("nginxTrustedBrowsers", []);

app.controller('mainController', ['$window', '$scope', 'os', 'browsers', 'devices', 'common', function($window, $scope, os, browsers, devices, common) {

    $scope.VERSION = '1.0.0'

    UA_REGEX = '^Mozilla\\/5\\.0\\s\\((SYSTEM)+ANDROID\\)((PLATFORM)\\/[A-Z\\d\\.+]+|EXTENSIONS)+$'
    ANDROID_REGEX = '(Android\\s[\\d\\.]+;\\s(\\w\\w-\\w\\w;\\s)?(DEVICES)\\s?([\\w\\d_]+)?\\sBuild\\/[A-Z\\d]+)?'

    $scope.regex_string = ''
    $scope.status = undefined

    $scope.os = os
    $scope.browsers = browsers
    $scope.devices = devices

    $scope.list = function(list) {
        return list.filter(function(value) {
            return value.enabled === true
        }).map(function(value) {
            return value.constructor.name
        }).join(', ')
    }

    Set.prototype.union = function(setB) {
        var union = new Set(this);
        for (var elem of setB) {
            union.add(elem);
        }
        return union;
    }

    function getSpec(specs, value) {
        return Array.from(specs.reduce(function(acc, curr) {
            return acc.union(curr[value] || [])
        }, new Set()))
    }

    function isEnabled(spec) {
        return spec.enabled
    }

    $scope.updateStatusText = function() {
        if ($scope.status === true) {
            $scope.statusText = "Success! User agent matches the regex"
        } else if ($scope.status === false) {
            $scope.statusText = "Blocked! User agent does not match the regex"
        } else if ($scope.useragent === false) {
            $scope.statusText = "Please type in a user agent to test with"
        } else {
            $scope.statusText = "Please update your regex paramters"
        }
    }

    $scope.updateStatusText()

    $scope.match = function() {
        $scope.status = regex.test($scope.useragent)
        $scope.updateStatusText()
    }

    $scope.getUserAgent = function() {
        $scope.useragent = $window.navigator.userAgent
        $scope.match()
    }

    function buildRegExString(system, android, platform, extensions) {
        let regex = UA_REGEX
        regex = regex.replace('SYSTEM', system.join('|'))
        regex = regex.replace('ANDROID', buildAndroidRegEx(android))
        regex = regex.replace('PLATFORM', platform.join('|'))
        regex = regex.replace('EXTENSIONS', extensions.join('|'))
        return regex
    }

    function buildAndroidRegEx(android) {
        if (!android.length) return ''
        return ANDROID_REGEX.replace('DEVICES', android.join('|'))
    }

    $scope.computeRegex = function() {
        let enabled = [].concat(os).concat(browsers).concat(devices).filter(isEnabled)
        enabled.push(common)
        console.log("Enabled", enabled);

        let system = getSpec(enabled, 'system')
        let android = getSpec(enabled, 'android')
        let platform = getSpec(enabled, 'platform')
        let extensions = getSpec(enabled, 'extensions')

        $scope.regex_string = buildRegExString(system, android, platform, extensions)
        regex = RegExp($scope.regex_string)
        $scope.match()
    }

}]);
'use strict'

angular.module('nginxTrustedBrowsers').directive('toggle', function() {

    function controller() {
        var vm = this;

        // TODO: assert this is usefull ?
        // if(angular.isUndefined(vm.ngModel)) { vm.ngModel = !!vm.ngModel; }

        if (angular.isFunction(vm.checked)) { vm.ngModel = !!vm.checked(); }

        vm.toggle = function() {
            if (angular.isFunction(vm.disabled) && vm.disabled()) return;
            vm.ngModel = !vm.ngModel;
        }
    }

    function link() {

    }

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            checked: '&?',
            disabled: '&?',
            ngModel: '=ngModel'
        },
        controller: controller,
        controllerAs: 'vm',
        bindToController: true,
        require: 'ngModel',
        template: '<div class="ui toggle checkbox">' +
            '<input type="checkbox" ng-model="vm.ngModel">' +
            '<label ng-transclude></label>' +
            '</div>',
        link: link
    };
});

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

'use strict'

angular.module('nginxTrustedBrowsers').factory('browsers', function() {

    function Chrome() {
        this.icon = 'chrome'
        this.platform = ['Chrome', 'Safari']
    }

    function Edge() {
        this.icon = 'edge'
        this.platform = ['Edge']
    }

    function Safari() {
        this.icon = 'safari'
        this.platform = ['Safari']
    }

    function Firefox() {
        this.icon = 'firefox'
        this.platform = ['Firefox']
    }

    function InternetExplorer() {
        this.icon = 'internet explorer'
        this.system = ['compatible', 'MSIE', 'rv:[\\d\\.]+', 'Trident\\/\\d.\\d', '\\.NET\\d\\.\\d[A-Z]']
        this.extensions = ['like Gecko']
    }

    function Opera() {
        this.icon = 'opera'
        this.platform = ['Opera']
    }

    return [
        new Chrome(),
        new Edge(),
        new Safari(),
        new Firefox(),
        new InternetExplorer(),
        new Opera()
    ]
});

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

'use strict'

angular.module('nginxTrustedBrowsers').factory('common', function() {

    function Default() {
        this.system = ['U', ';?\\s', '[\\d\\._]+\\+?']
        this.platform = ['Version', 'AppleWebKit']
        this.extensions = ['\\(KHTML, like Gecko\\)|\\s']
    }

    return new Default()
});
