const token_info = parseJwt(localStorage.getItem("Access_token"));
const userInfo = await GetAjax("/getInfo?userName=" + token_info.username, null);

async function heart(elementId) {
    $("#like" + elementId).removeClass("ti-heart");
    $("#like" + elementId).addClass("fa fa-heart");
    $(".fa-heart").css("color", "red");

    const res = await GetAjax("/getInfo?userName=" + userInfo.username, null);
    const res = await PostAjax("/getInfo?userName=" + userInfo.username, null);

    console.log(res);
}