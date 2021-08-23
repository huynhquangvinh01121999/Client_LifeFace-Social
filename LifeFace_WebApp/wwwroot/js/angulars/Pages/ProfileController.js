
app.controller('ProfileController', ProfileController);
function ProfileController($scope, $http, $timeout, $interval, $window) {
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
        toastr.options.preventDuplicates = true;
        $("#loader").show();

        // get UserInfo
        $scope.decodeToken = parseJwt(localStorage.getItem("Access_token"));
        let offSet = 0;

        $scope.GetProfile = function () {
            $("#loader").show();
            GetAsync($http, "/profile?userName=" + $scope.decodeToken.username, []).then(function (res) {
                $scope.profileInfo = res.data.ReturnData.UserInfo[0];
                $scope.listPeople = res.data.ReturnData.ListPeople;
                $scope.listPost = res.data.ReturnData.ListPost;
                $scope.totalHeart = res.data.ReturnData.TotalHeart;
                $("#loader").hide();
                console.log($scope.profileInfo);
            }, function (err) {
                console.log("error");
            });
        }

        $scope.LoadList = function () {
            $scope.GetProfile();
        }

        setTimeout(() => {
            $scope.GetProfile();
        }, 3000);
    }
}