var app = angular.module("nginxTrustedBrowsers", []);

app.controller('mainController', ['$scope', function($scope){
    $scope.hello = "Hello there! Sup!"

    $scope.list = function(dic) {
        let keys = Object.keys(dic)
        let filtered = keys.filter(function(value){
            return dic[value] === true
        })
        return filtered.join(', ')
    }

    $scope.os = {}
    $scope.browsers = {}
    $scope.devices = {}
}]);