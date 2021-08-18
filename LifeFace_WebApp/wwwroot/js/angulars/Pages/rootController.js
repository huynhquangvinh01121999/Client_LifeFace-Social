const BASE_URL = "http://localhost:3000";
function GetAsync($http, Url, Data) {
    return $http({
        url: BASE_URL + Url,
        dataType: 'json',
        method: "get",
        data: Data,
        headers: {
            "Content-Type": "application/json"
        },
        async: true
    });
};

function PostAsync($http, Url, Data) {
    return $http({
        url: Url,
        dataType: 'json',
        method: "post",
        data: Data,
        headers: {
            "Content-Type": "application/json"
        },
        async: true
    });
};

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

var app = angular.module('myApp', []);