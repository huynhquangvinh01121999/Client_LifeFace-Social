app.controller('RegisterController', RegisterController);
function RegisterController($scope, $http, $timeout, $interval, $window) {
    $scope.register = function () {
        var pw = $("#inputPassWord").val();
        var rePw = $("#inputRePassWord").val();

        if ($("#inputFirstName").val() === "" || $("#inputFirstName").val() === undefined) {
            toastr.warning('Vui lòng nhập họ của bạn', 'Thông báo', { timeOut: 3000 });
            return;
        }
        if ($("#inputMiddleName").val() === "" || $("#inputMiddleName").val() === undefined) {
            toastr.warning('Vui lòng nhập tên lót của bạn', 'Thông báo', { timeOut: 3000 });
            return;
        }
        if ($("#inputLastName").val() === "" || $("#inputLastName").val() === undefined) {
            toastr.warning('Vui lòng nhập tên của bạn', 'Thông báo', { timeOut: 3000 });
            return;
        }
        if ($("#inputUserName").val() === "" || $("#inputUserName").val() === undefined) {
            toastr.warning('Vui lòng nhập tên tài khoản', 'Thông báo', { timeOut: 3000 });
            return;
        }
        if (pw === "" || pw === undefined || rePw === "" || rePw === undefined) {
            toastr.warning('Vui lòng nhập mật khẩu tài khoản', 'Thông báo', { timeOut: 3000 });
            return;
        }
        if (pw.length < 8) {
            toastr.warning('Mật khẩu phải có ít nhất 8 kí tự', 'Thông báo', { timeOut: 3000 });
            return;
        }
        if ($("#inputEmail").val() === "" || $("#inputEmail").val() === undefined) {
            toastr.warning('Vui lòng nhập email', 'Thông báo', { timeOut: 3000 });
            return;
        }
        if (!validateEmail($("#inputEmail").val())) {
            toastr.warning('Định dạng email không hợp lệ.!', 'Thông báo', { timeOut: 3000 });
            return;
        }

        if (pw == rePw) {
            var auth = new Object();
            auth.firstName = $("#inputFirstName").val();
            auth.middleName = $("#inputMiddleName").val();
            auth.lastName = $("#inputLastName").val();
            auth.doB = $("#inputDob").val();
            auth.userName = $("#inputUserName").val();
            auth.passWord = pw;
            auth.email = $("#inputEmail").val();

            PostAsync($http, "/register", auth).then(function (res) {
                if (res.data.IsSuccess) {
                    toastr.success('Đăng ký thành công', 'Thông báo', { timeOut: 3000 });
                    //location.href = "/";
                    document.getElementById("frmRegister").reset();
                    return;
                } else {
                    toastr.warning(res.data.Message, 'Cảnh báo', { timeOut: 3000 });
                    return;
                }
            }, function (err) {
                toastr.error('Hệ thống hiện đang lỗi', 'Lỗi hệ thống', { timeOut: 3000 });
                return;
            })
        } else {
            toastr.warning('Mật khẩu không trùng khớp', '', { timeOut: 3000 });
            return;
        }
    }
}