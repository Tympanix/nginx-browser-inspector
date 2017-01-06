var app = angular.module("nginxTrustedBrowsers", []);

app.controller('mainController', ['$window', '$scope', 'os', 'browsers', 'devices', 'common', function($window, $scope, os, browsers, devices, common) {

    $scope.VERSION = '1.0.2'

    UA_REGEX = /^Mozilla\/5\.0\s\((SYSTEM)+ANDROID\)((PLATFORM)\/[A-Z\d\.+]+|EXTENSIONS)+$/
    ANDROID_REGEX = /(Android\s[\d\.]+;\s(\w\w-\w\w;\s)?(DEVICES)\s?([\w\d_]+)?\sBuild\/[A-Z\d]+)?/

    $scope.status = undefined
    $scope.regex = undefined

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

    function getSpec(rules, value) {
        return _.reduce(rules, function(memo, rule) {
            return memo.concat(rule[value] || [])
        }, [])
    }

    function isEnabled(rule) {
        return rule.enabled
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
        $scope.status = $scope.regex.test($scope.useragent)
        $scope.updateStatusText()
    }

    $scope.getUserAgent = function() {
        $scope.useragent = $window.navigator.userAgent
        $scope.match()
    }

    function buildRegExString(system, android, platform, extensions) {
        let regex = UA_REGEX.source
        console.log('Base regex', regex);
        regex = regex.replace('SYSTEM', regExOr(system))
        regex = regex.replace('ANDROID', buildAndroidRegEx(android))
        regex = regex.replace('PLATFORM', regExOr(platform))
        regex = regex.replace('EXTENSIONS', regExOr(extensions))
        return regex
    }

    function regExSource(regex) {
        return regex.source
    }

    function regExOr(list) {
        list = _.map(list, regExSource)
        list = _.uniq(list, _.identity)
        return list.join('|')
    }

    function buildAndroidRegEx(android) {
        if (!android.length) return ''
        return ANDROID_REGEX.source.replace('DEVICES', regExOr(android))
    }

    $scope.computeRegex = function() {
        let all = _.union(os, browsers, devices, common)
        let enabled = _.filter(all, isEnabled)

        let system = getSpec(enabled, 'system')
        let android = getSpec(enabled, 'android')
        let platform = getSpec(enabled, 'platform')
        let extensions = getSpec(enabled, 'extensions')

        $scope.regex = RegExp(buildRegExString(system, android, platform, extensions))
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
        this.system = [/Windows( NT)?/, /Win64/, /x64/, /WOW64/]
    }

    function Linux() {
        this.icon = 'linux'
        this.system = [/Linux/, /X11/, /x86_64/]
    }

    function Mac() {
        this.icon = 'apple'
        this.system = [/Macintosh/, /(Intel|PPC) Mac OS X/]
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
        this.platform = [/Chrome/, /Safari/]
    }

    function Edge() {
        this.icon = 'edge'
        this.platform = [/Edge/]
    }

    function Safari() {
        this.icon = 'safari'
        this.platform = [/Safari/]
    }

    function Firefox() {
        this.icon = 'firefox'
        this.platform = [/Firefox/]
    }

    function InternetExplorer() {
        this.icon = 'internet explorer'
        this.system = [/compatible/, /MSIE/, /rv:[\d\.]+/, /Trident\/\d.\d/, /\.NET\d\.\d[A-Z]/]
        this.extensions = [/like Gecko/]
    }

    function Opera() {
        this.icon = 'opera'
        this.platform = [/Opera/]
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

    MOBILE_REGEX = /Mobile(\/[\w\d]+?)?/

    function iPad() {
        this.system = [/iPad/, /(like )?Mac OS X/, /CPU OS/]
        this.extensions = [MOBILE_REGEX]
    }

    function iPhone() {
        this.system = [/(CPU )?iPhone( OS)?/, /(like )?Mac OS X/]
        this.extensions = [MOBILE_REGEX]
    }

    function Samsung() {
        this.system = [/Linux/]
        this.android = [/Samsung/, /Galaxy/]
        this.extensions = [MOBILE_REGEX]
    }

    function HTC() {
        this.system = [/Linux/]
        this.android = [/HTC/]
        this.extensions = [MOBILE_REGEX]
    }

    function Huawei() {
        this.system = [/Linux/]
        this.android = [/Huawei/]
        this.extensions = [MOBILE_REGEX]
    }

    function OnePlus() {
        this.system = [/Linux/]
        this.android = [/A0001/]
        this.extensions = [MOBILE_REGEX]
    }

    function Sony() {
        this.system = [/Linux/]
        this.android = [/Sony/]
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

    function Common() {
        this.enabled = true
        this.system = [/U/, /;?\s/, /\w\w-\w\w/, /[\d\._]+\+?/]
        this.platform = [/Version/, /AppleWebKit/]
        this.extensions = [/\(KHTML, like Gecko\)/, /\s/]
    }

    return [new Common()]
});
