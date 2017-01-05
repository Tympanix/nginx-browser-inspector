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