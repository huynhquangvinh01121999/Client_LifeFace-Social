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
        GetAsync($http, "/getInfo?userName=" + $scope.decodeToken.username, []).then(function (res) {
            $scope.userInfo = res.data[0];
        }, function (err) {
            console.log("error");
        });
        var offSet = 0;

        $scope.LoadList = function () {
            $scope.GetProfile();
        }
        //setTimeout(() => {
        //    $scope.GetProfile();
        //}, 3000);

        $scope.GetProfile = async function () {
            $("#loader").show();
            await GetAsync($http, "/profile?userName=" + $scope.decodeToken.username + "&offSet=" + offSet, []).then(function (res) {
                $scope.profileInfo = res.data.ReturnData.UserInfo[0];
                $scope.listPeople = res.data.ReturnData.ListPeople;
                $scope.listPost = res.data.ReturnData.ListPost;
                $scope.totalHeart = res.data.ReturnData.TotalHeart;
                $("#loader").hide();
            }, function (err) {
                console.log("error");
            });
            offSet += 10;

            await GetAsync($http, "/getPostHeart_By_AutoPostId?userName=" + $scope.decodeToken.username, []).then(async function (res) {
                $scope.listPostHeartOfUserId = await res.data;
                //console.log($scope.listPostHeartOfUserId);
            }, function (err) {
                console.log("error");
            });

            $scope.listPostHeartOfUserId.map((postHeart) => {
                $scope.listPost.map((post) => {
                    if (post.AutoId === postHeart.AutoPostId) {
                        $("#heart_" + post.AutoId).removeClass("ti-heart");
                        $("#heart_" + post.AutoId).removeClass("fa fa-heart");
                        $("#heart_" + post.AutoId).addClass("fa fa-heart");
                        $(".fa-heart").css("color", "red");
                    }
                })
            })
        }

        // load them data khi scroll tới vùng quy định
        var scrollHeight = 3000;
        $window.onscroll = async function () {
            if ($(document).scrollTop() >= scrollHeight) {
                $("#loader").show();
                scrollHeight += 3000;

                await GetAsync($http, "/profile?userName=" + $scope.decodeToken.username + "&offSet=" + offSet, []).then(function (res) {
                    $scope.listTemp = res.data.ReturnData.ListPost;

                    $scope.listTemp.map(data => $scope.listPost.push(data));

                    $scope.listPost.sort(function (a, b) {
                        return b.AutoId - a.AutoId;
                    });

                    offSet += 10;
                }, function (err) {
                    console.log("error");
                });

                await GetAsync($http, "/getPostHeart_By_AutoPostId?userName=" + $scope.decodeToken.username, []).then(async function (res) {
                    $scope.listPostHeartOfUserId = await res.data;
                    //console.log($scope.listPostHeartOfUserId);
                }, function (err) {
                    console.log("error");
                });

                $scope.listPostHeartOfUserId.map((postHeart) => {
                    $scope.listPost.map((post) => {
                        if (post.AutoId === postHeart.AutoPostId) {
                            $("#heart_" + post.AutoId).removeClass("ti-heart");
                            $("#heart_" + post.AutoId).removeClass("fa fa-heart");
                            $("#heart_" + post.AutoId).addClass("fa fa-heart");
                            $(".fa-heart").css("color", "red");
                        }
                    })
                });

                $("#loader").hide();
            }
        };

        // thả tim
        $scope.heart = (autoId) => {
            const data = {
                userId: $scope.userInfo.UserId,
                autoPostId: autoId
            }
            PostAsync($http, "/heart", data).then(function (res) {
                if (res.data.ReturnData.Action == "heart") {
                    $("#heart_" + autoId).removeClass("ti-heart");
                    $("#heart_" + autoId).addClass("fa fa-heart");
                    $(".fa-heart").css("color", "red");
                    $("#heartCount_" + autoId).html(res.data.ReturnData.HeartCount);
                    return;
                }
                $("#heart_" + autoId).removeClass("fa fa-heart");
                $("#heart_" + autoId).addClass("ti-heart");
                $(".fa-heart").css("color", "black");
                $("#heartCount_" + autoId).html(res.data.ReturnData.HeartCount);
                return;
            }, function (err) { })
        }

        // show modal comment
        $scope.CommentHanleArr = [];    // mảng dùng để xử lý tắt mở vùng comment

        // hàm check vùng comment của post đó đang hiển thị hay ẩn
        function checkDisplayCommentArea(id) {
            if ($scope.CommentHanleArr.length != 0) {
                var result = $scope.CommentHanleArr.find(comment => comment.Id === id);
                if (result) return result;
            }
            return null;
        }

        $scope.LoadProfileCommentArea = (autoId) => {
            var result = checkDisplayCommentArea(autoId);
            if (result == null) {
                $("#coment_area_profile" + autoId).css("display", "inline-block");
                $scope.CommentHanleArr.push({ Id: autoId, Status: true });
                return;
            } else {
                if (result.Status == true) {
                    $("#coment_area_profile" + autoId).css("display", "none");
                    result.Status = false;
                    return;
                } else {
                    $("#coment_area_profile" + autoId).css("display", "inline-block");
                    result.Status = true;
                    return;
                }
            }
        }

        function SendComment(post) {
            var content = $("#inputComment" + post.AutoId).val().trim();
            if (content === null || content === "" || content === undefined) {
                toastr.warning("Vui lòng nhập bình luận", 'Nhắc nhở', { timeOut: 3000 });
                $("#inputComment" + post.AutoId).val("");
                return;
            }
            $("#loader").show();
            // push data vào mảng bình luận của bài viết
            for (var i = 0; i < $scope.listPost.length; i++) {  // duyệt ds bài viết
                var postId = $scope.listPost[i].PostId;
                if (postId === post.PostId) {
                    $scope.listPost[i].Comments.push({
                        FullName: post.FullName,
                        CreateAt: timeNow(),
                        Content: content,
                        Avatar: $scope.userInfo.ImageBase
                    });
                    $scope.listPost[i].CommentCount += 1;
                    break;
                }
            }

            // thực hiện post bài viết lên api
            PostAsync($http, "/postComment", {
                autoPostId: post.AutoId,
                userId: $scope.userInfo.UserId,
                postId: post.PostId,
                content: content
            }).then(function (res) {
                toastr.success(res.data.ReturnData, '', { timeOut: 3000 });
            }, function (err) {
                toastr.error(err, 'Đã xảy ra lỗi', { timeOut: 3000 });
            });
            $("#inputComment" + post.AutoId).val("");
            $("#loader").hide();
        }

        $scope.EnterPostComment = (keyEvent, post) => {
            if (keyEvent.which === 13) {
                SendComment(post);
            }
        }

        $scope.PostComment = (post) => {
            SendComment(post);
        }

        $scope.uploadAvatar = () => {
            $("#loader").show();
            setTimeout(async () => {
                console.log($scope.profileInfo.ImageBase);
                const data = {
                    userId: $scope.userInfo.UserId,
                    imageBase: $scope.profileInfo.ImageBase,
                }
                await PostAsync($http, "/updateAvatar", data).then(function (res) {
                    toastr.success(res.data.Message, '', { timeOut: 3000 });
                }, function (err) { });
            }, 2000);
            $("#loader").hide();
        }

        $scope.uploadBackground = () => {
            $("#loader").show();
                setTimeout(async () => {
                const data = {
                    userId: $scope.userInfo.UserId,
                    backgroundBase: $scope.profileInfo.BackgroundBase,
                }
                await PostAsync($http, "/updateBackground", data).then(function (res) {
                    toastr.success(res.data.Message, '', { timeOut: 3000 });
                }, function (err) { });
            }, 2000);
            $("#loader").hide();
        }
    }
}

app.directive('uploadAvatar', ['$rootScope', function () {
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
                    scope.avatarName = filename;
                }
            });

            var reader = new FileReader();
            reader.onload = function (e) {
                scope.profileInfo.ImageBase = e.target.result;
                scope.$apply();
            }
        }
    }
}]);

app.directive('uploadBackground', ['$rootScope', function () {
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
                    scope.backgroundName = filename;
                }
            });

            var reader = new FileReader();
            reader.onload = function (e) {
                scope.profileInfo.BackgroundBase = e.target.result;
                scope.$apply();
            }
        }
    }
}]);