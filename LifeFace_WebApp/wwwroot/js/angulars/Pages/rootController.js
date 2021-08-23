//const BASE_URL = "https://lifeface-social-api.herokuapp.com";
const BASE_URL = "http://localhost:3000";
async function GetAsync($http, Url, Data) {
    return await $http({
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

async function PostAsync($http, Url, Data) {
    return await $http({
        url: BASE_URL + Url,
        dataType: 'json',
        method: "post",
        data: Data,
        headers: {
            "Content-Type": "application/json"
        },
        async: true
    });
};

async function GetAjax(Url, Data) {
    return await $.ajax({
        url: BASE_URL + Url,
        method: "get",
        async: true,
        data: Data,
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            return res;
        },
        error: function (err) {
            return err;
        }
    });
};

async function PostAjax(Url, Data) {
    return await $.ajax({
        url: BASE_URL + Url,
        method: "get",
        async: true,
        data: Data,
        dataType: "json",
        contentType: "application/json",
        success: function (res) {
            return res;
        },
        error: function (err) {
            return err
        }
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

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function formatDate(datetime) {
    return datetime.toISOString().slice(0, 10);
}

function timeNow() {
    var datetime = new Date();
    // current hours
    let hours = datetime.getHours();

    // current minutes
    let minutes = datetime.getMinutes();

    // current seconds
    let seconds = datetime.getSeconds();

    return formatDate(datetime) + " " + hours + ":" + minutes + ":" + seconds;
}

var app = angular.module('myApp', []);