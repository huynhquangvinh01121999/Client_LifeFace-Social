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
        $scope.listPost;
        $scope.listAllPeople;
        $scope.userInfo = "";
        $scope.listPostHeartOfUserId;

        toastr.options.preventDuplicates = true;
        $("#loader").show();

        // get UserInfo
        $scope.decodeToken = parseJwt(localStorage.getItem("Access_token"));
        GetAsync($http, "/getInfo?userName=" + $scope.decodeToken.username, []).then(function (res) {
            $scope.userInfo = res.data[0];
        }, function (err) {
            console.log("error");
        });
        let offSet = 0;

        $scope.LoadInit = async function () {
            $scope.GetPosts();
            //console.log(1)
            //$scope.userInfo = await $scope.GetInfo();
            //console.log($scope.userInfo);
            //console.log(2)
            $scope.GetAllPeoples();
        }

        function showImage(arr, index) {
            var html = '';
            arr.forEach(image => html += '<img style="border-radius: 10px;margin-top: -5px;" src="' + image.ImageBase + '" alt="error">');
            $(".loadImage" + index).append(html);
        }

        $scope.GetInfo = function () {
            return new Promise(resolve => {
                setTimeout(() => {
                    GetAsync($http, "/getInfo?userName=" + $scope.decodeToken.username, []).then(function (res) {
                        resolve(res.data[0]);
                        $("#loader").hide();
                    }, function (err) {
                        console.log("error");
                    });
                }, 2000);
            });
        }

        $scope.GetPosts = async function () {
            $("#loader").show();
            await GetAsync($http, "?offSet=" + offSet, []).then(function (res) {
                $scope.listPost = res.data.ReturnData;
                //console.log($scope.listPost);

                //angular.forEach($scope.listPost, function (post) {
                //    console.log(post.UserId);
                //});
                //$scope.listPost.forEach(function (post, index) {
                //    $(".loadMore").append('<div class="central-meta item"><div class="user-post"><div class="friend-info"><figure><img src="' + post.Avatar + '" alt=""></figure><div class="friend-name"><ins><a href="time-line.html" title="">' + post.FullName + '</a></ins><span>' + post.CreateAt + '</span></div><div class="post-meta"><div class="description"><p style="color: black;font-size: 15px">' + post.Content + '</p></div><div class="loadImage' + post.AutoId + '"></div><div class="we-video-info"><ul><li><span class="like" data-toggle="tooltip" title="like"><i class="ti-heart" id="like' + post.AutoId + '" onclick="heart(' + post.AutoId + ')"></i><ins>0</ins></span></li><li><span class="comment" data-toggle="tooltip" title="Comments"><i class="fa fa-comments-o"></i><ins>0</ins></span></li><li><span class="comment" data-toggle="tooltip" title="Comments"><i class="fa fa-share-alt"></i><ins>0</ins></span></li></ul></div></div></div></div ></div >')
                //});
                //$scope.listPost.map((post, index) => showImage(post.ListImage, post.AutoId));

                offSet += 10;
                $("#loader").hide();
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
            })
        }

        $scope.GetAllPeoples = function () {
            //console.log($scope.decodeToken.username);
            GetAsync($http, "/getUserNotMe?userName=" + $scope.decodeToken.username, []).then(function (res) {
                $scope.listAllPeople = res.data.ReturnData;
                //console.log($scope.listAllPeople);
                $("#loader").hide();
            }, function (err) {
                console.log("error");
            });
        }

        $scope.NewPost = function () {
            $("#loader").show()
            //console.log($scope.image);
            const newPost = {
                userId: $scope.userInfo.UserId,
                content: $("#inputContent").val(),
                fullName: $scope.userInfo.FirstName + " " + $scope.userInfo.MiddleName + " " + $scope.userInfo.LastName,
                imageBase: $scope.image
            }

            PostAsync($http, "/createPost", newPost).then(function (res) {
                toastr.success('Bài viết đã được đăng lên dòng thời gian', '', { timeOut: 3000 });
                //console.log(res.data);
                //location.reload();
                document.getElementById("frmNewPost").reset();
                $("#loader").hide();
            }, function (error) {
            })

            // call socket
            client.emit('createNewPost', $scope.userInfo.FirstName + " " + $scope.userInfo.MiddleName + " " + $scope.userInfo.LastName);
        }

        // load them data khi scroll tới vùng quy định
        var scrollHeight = 3000;
        $window.onscroll = async function () {
            //console.log($(document).scrollTop() + "-" + scrollHeight);
            if ($(document).scrollTop() >= scrollHeight) {
                $("#loader").show();
                //console.log($(document).scrollTop() + "-" + scrollHeight);
                scrollHeight += 3000;

                await GetAsync($http, "?offSet=" + offSet, []).then(function (res) {
                    $scope.listTemp = res.data.ReturnData;

                    $scope.listTemp.map(data => $scope.listPost.push(data));

                    $scope.listPost.sort(function (a, b) {
                        return b.AutoId - a.AutoId;
                    });
                    //console.log($scope.listPost);

                    offSet += 10;

                    //$scope.listPost.map(function (post, index) {
                    //    $(".loadMore").append('<div class="central-meta item"><div class="user-post"><div class="friend-info"><figure><img src="' + post.Avatar + '" alt=""></figure><div class="friend-name"><ins><a href="time-line.html" title="">' + post.FullName + '</a></ins><span>' + post.CreateAt + '</span></div><div class="post-meta"><div class="description"><p>' + post.Content + '</p></div><div class="loadImage' + post.AutoId + '"></div><div class="we-video-info"><ul><li><span class="like" data-toggle="tooltip" title="like"><i class="ti-heart"></i><ins>0</ins></span></li><li><span class="comment" data-toggle="tooltip" title="Comments"><i class="fa fa-comments-o"></i><ins>0</ins></span></li><li><span class="comment" data-toggle="tooltip" title="Comments"><i class="fa fa-share-alt"></i><ins>0</ins></span></li></ul></div></div></div></div ></div >')
                    //});
                    //$scope.listPost.map((post, index) => showImage(post.ListImage, post.AutoId));
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
                })
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
                //console.log(res);
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

        $scope.LoadCommentArea = (autoId) => {
            var result = checkDisplayCommentArea(autoId);
            if (result == null) {
                $("#coment_area" + autoId).css("display", "inline-block");
                $scope.CommentHanleArr.push({ Id: autoId, Status: true });
                return;
            } else {
                if (result.Status == true) {
                    $("#coment_area" + autoId).css("display", "none");
                    result.Status = false;
                    return;
                } else {
                    $("#coment_area" + autoId).css("display", "inline-block");
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

                // xử lý trả lời comment
                //for (var j = 0; j < $scope.listPost[i].Comments.length; j++) {  // duyệt ds comment của bài viết
                //    var postId = $scope.listPost[i].PostId;
                //    var autoPostId = $scope.listPost[i].AutoId;

                //    if (postId === $scope.listPost[i].Comments[j].PostId && autoPostId === post.autoId) {
                //        $scope.listPost[i].Comments.push({
                //            FullName: post.FullName,
                //            CreateAt: new Date(),
                //            Content: content,
                //            Avatar: post.Avatar
                //        });
                //        document.getElementById("frmPostComment").reset();
                //        console.log("ok")
                //        break;
                //    } else {
                //        console.log("ko")
                //    }
                //}
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

        setTimeout(() => {
            client.emit('notifiOnline', $scope.userInfo.FirstName + " " + $scope.userInfo.MiddleName + " " + $scope.userInfo.LastName);
            client.on('reSentNotifiOnline', (data) => {
                toastr.success(data, '', { timeOut: 3000 });
            })
        }, 3000);
        client.on('reSentCreatePost', (data) => {
            toastr.success(data, '', { timeOut: 3000 });
        })
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