app.controller('CommonController', CommonController);
function CommonController($scope, $http, $timeout, $interval, $window) {
    if (!localStorage.getItem("Access_token")) {
        swal({
            title: "Phiên đăng nhập đã hết hạn",
            text: "Mời bạn vui lòng đăng nhập lại!.",
            type: "warning",
            showCancelButton: false,
            confirmButtonClass: "btn-success",
            cancelButtonClass: "btn-warning",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Không",
        },
            function (isConfirm) {
                if (isConfirm) {
                    location.href = "/Auth";
                }
            });
    } else {
        $scope.decodeToken = parseJwt(localStorage.getItem("Access_token"));
        GetAsync($http, "/getInfo?userName=" + $scope.decodeToken.username, []).then(function (res) {
            $scope.userInfo = res.data[0];
        }, function (err) {
            console.log("error");
        });

        $scope.logout = () => {
            localStorage.removeItem("Access_token");
            location.href = "/Auth";
        }
    }
}