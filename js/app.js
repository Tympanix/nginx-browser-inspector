var app = angular.module("nginxTrustedBrowsers", []);

app.controller('mainController', ['$window', '$scope', 'os', 'browsers', 'devices', 'common', function($window, $scope, os, browsers, devices, common) {

    UA_REGEX = '^Mozilla\\/5\\.0\\s\\((SYSTEM)+ANDROID\\)((PLATFORM)\\/[A-Z\\d\\.+]+|EXTENSIONS)+$'
    ANDROID_REGEX = '(Android\\s[\\d\\.]+;\\s(\\w\\w-\\w\\w;\\s)?(DEVICES)\\s?([\\w\\d_]+)?\\sBuild\\/[A-Z\\s]+)?'
    EXTENSIONS = ['\\(KHTML, like Gecko\\)|\\s']

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

    $scope.computeRegex = function() {
        let enabled = os.concat(browsers).concat(devices).filter(isEnabled)
        enabled.push(common)
        console.log("Enabled", enabled);

        let system = getSpec(enabled, 'system')
        let platform = getSpec(enabled, 'platform')
        let android = getSpec(enabled, 'android')

        android_regex = android.length? ANDROID_REGEX.replace('DEVICES', android.join('|')) : ''
        $scope.regex_string = UA_REGEX.replace('SYSTEM', system.join('|')).replace('ANDROID', android_regex)
            .replace('PLATFORM', platform.join('|')).replace('EXTENSIONS', EXTENSIONS)

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
        this.system = ['MSIE', 'rev:[\d\.]+']
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

'use strict'

angular.module('nginxTrustedBrowsers').factory('common', function() {

    function Default() {
        this.system = [';?\\s', '[\\d\\._]+\\+?']
        this.platform = ['Version', 'AppleWebKit']
    }

    return new Default()
});
