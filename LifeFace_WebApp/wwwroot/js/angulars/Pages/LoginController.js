﻿app.controller('LoginController', LoginController);
function LoginController($scope, $http, $timeout, $interval, $window) {
    if (localStorage.getItem("Access_token")) {
        location.href = "/Home";
    }
    $scope.login = function () {
        var userName = $("#inputUserName").val();
        var passWord = $("#inputPassWord").val();

        if (userName === undefined || userName === "") {
            toastr.warning('Vui lòng nhập tên tài khoản', 'Nhắc nhở', { timeOut: 3000 });
            return;
        }
        if (passWord === undefined || passWord === "") {
            toastr.warning('Vui lòng nhập mật khẩu', 'Nhắc nhở', { timeOut: 3000 });
            return;
        }
        var auth = {
            userName: userName,
            passWord: passWord,
        };
        PostAsync($http, "http://localhost:3000/authen", auth).then(function (res) {
            if (res.data.IsSuccess) {
                localStorage.setItem("Access_token", res.data.ReturnData.Access_token);
                location.href = "/Home";
            } else {
                toastr.warning(`${res.data.Message}`, 'Thông báo', { timeOut: 3000 });
                document.getElementById("frmLogin").reset();
            }
        }, function (error) {
            toastr.error(`Hệ thống hiện đang lỗi ${error}`, 'Lỗi hệ thống', { timeOut: 3000 });
        })
    }
}