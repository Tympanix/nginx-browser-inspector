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