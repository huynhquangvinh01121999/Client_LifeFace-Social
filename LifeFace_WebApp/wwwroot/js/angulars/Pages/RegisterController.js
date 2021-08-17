app.controller('RegisterController', RegisterController);
function RegisterController($scope, $http, $timeout, $interval, $window) {
    $scope.register = function () {
        var pw = $("#inputPassWord").val();
        var rePw = $("#inputRePassWord").val();

        if (pw == rePw) {
            var auth = new Object();
            auth.firstName = $("#inputFirstName").val();
            auth.middleName = $("#inputMiddleName").val();
            auth.lastName = $("#inputLastName").val();
            auth.doB = $("#inputDob").val();
            auth.userName = $("#inputUserName").val();
            auth.passWord = pw;
            auth.email = $("#inputEmail").val();

            PostAsync($http, "http://localhost:3000/register", auth).then(function (res) {
                if (res.data.IsSuccess) {
                    toastr.success('Đăng ký thành công', 'Thông báo', { timeOut: 3000 });
                    //location.href = "/";
                    document.getElementById("frmRegister").reset();
                } else {
                    toastr.warning(res.data.Message, 'Cảnh báo', { timeOut: 3000 });
                }
            }, function (err) {
                toastr.error('Hệ thống hiện đang lỗi', 'Lỗi hệ thống', { timeOut: 3000 });
            })
        } else {
            toastr.warning('Mật khẩu không trùng khớp', '', { timeOut: 3000 });
        }
    }
}