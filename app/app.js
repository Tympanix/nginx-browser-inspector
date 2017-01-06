var app = angular.module("nginxTrustedBrowsers", []);

app.controller('mainController', ['$window', '$scope', 'os', 'browsers', 'devices', 'common', function($window, $scope, os, browsers, devices, common) {

    $scope.VERSION = '1.0.1'

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