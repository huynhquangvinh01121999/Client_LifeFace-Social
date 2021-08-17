//toastr["success"]("Hello", "Thông báo");
//toastr.success('Nội dung thông báo thông tin', '', { timeOut: 3000 });

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

app.controller('HomeController', HomeController);
function HomeController($scope, $http, $timeout, $interval, $window) {
    toastr.options.preventDuplicates = true;
    $scope.listProduct;
    $scope.decodeToken;
    $scope.LoadInit = async function () {
        await $scope.getData();
    }

    var products = new Object();
    products.userId = 103;
    products.id = 103;
    products.title = "title";
    products.body = "title";

    $scope.getData = function () {
        GetAsync($http, "http://localhost:3000/",[]).then(function (res) {
            $scope.listProduct = res.data;
            console.log($scope.listProduct);
        }, function (err) {
            console.log("error");
        });

        $scope.decodeToken = parseJwt(localStorage.getItem("Access_token"));
        console.log($scope.decodeToken)
    }

    $scope.load = function () {
        console.log($scope.image);
    }
}

app.directive('imgUpload', ['$rootScope', function () {
    return {
        restrict: 'A',
        link: function (scope, element) {
            // tạo extension chỉ nhận file
            var extensions = 'jpeg ,jpg, png, gif';

            element.on('change', function () {
                reader.readAsDataURL(element[0].files[0]);
                var filename = element[0].files[0].name;

                var extensionlist = filename.split('.');
                var extension = extensionlist[extensionlist.length - 1];
                if (extensions.indexOf(extension) == -1) {
                    alert("File extension , Only 'jpeg', 'jpg', 'png', 'gif', 'bmp' are allowed.");
                } else {
                    scope.file = element[0].files[0];
                    scope.imageName = filename;
                }
            });

            var reader = new FileReader();
            reader.onload = function (e) {
                scope.image = e.target.result;
                scope.$apply();
            }
        }
    }
}]);

// sau khi dùng app.directive thì dán các html bên dưới vào file html
//<div class="input-group">
//    <input id="image" class="hidden" type="file" img-upload ng-model="imageName" name="imageName">
//    <img ng-src="{{image}}" height="100" width="100" ng-show="image" />
//</div>