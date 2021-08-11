app.controller('HomeController', HomeController);
function HomeController($scope, $http, $timeout, $interval, $window) {
    toastr.options.preventDuplicates = true;
    $scope.LoadInit = function () {
        $scope.carname = "Volvo";
    }

    $scope.click = function () {
        console.log("a");
        //toastr["success"]("Hello", "Thông báo");
        toastr.success('Nội dung thông báo thông tin', '', { timeOut: 3000 });
        //swal({
        //    title: "Bạn có muốn ... ?",
        //    text: "Đây là đoạn text mô tả!.",
        //    type: "warning",
        //    showCancelButton: true,
        //    confirmButtonClass: "btn-success",
        //    cancelButtonClass: "btn-warning",
        //    confirmButtonText: "Có !",
        //    cancelButtonText: "Không !",
        //},
        //    function (isConfirm) {
        //        if (isConfirm) {
        //        }
        //    });
    }
}