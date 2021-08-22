app.controller('CommonController', CommonController);
function CommonController($scope, $http, $timeout, $interval, $window) {
    $scope.decodeToken = parseJwt(localStorage.getItem("Access_token"));
    GetAsync($http, "/getInfo?userName=" + $scope.decodeToken.username, []).then(function (res) {
        $scope.userInfo = res.data[0];
        console.log($scope.userInfo);
        $("#loader").hide();
    }, function (err) {
        console.log("error");
    });
}