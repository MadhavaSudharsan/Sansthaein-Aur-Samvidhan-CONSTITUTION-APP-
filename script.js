var sidenav = document.querySelector(".side-navbar")


function shownavbar() {
    sidenav.style.left = "0%"

}

function closenavbar() {

    sidenav.style.left = "-60%"
}



document.addEventListener("DOMContentLoaded", function () {
    const closeBtn = document.querySelector(".close-btn");
    const overlay = document.querySelector(".overlay");

    closeBtn.addEventListener("click", () => {
        overlay.style.display = "none";
    });

});

var getbtn = document.querySelector(".getbtn")
getbtn.addEventListener("click",function(){
    window.location.href = "login.html";

})
var overlay = document.querySelector(".overlay")

getbtn.addEventListener("click", function () {
    overlay.style.display = "flex";

})


var logistics = document.querySelector(".logistics");
var logisticss = document.querySelector(".logisticss");
var log = document.getElementById("log");

log.addEventListener("click", function () {
    if (logistics.style.display === "block" && logisticss.style.display === "block") {
        logistics.style.display = "none";
        logisticss.style.display = "none";
    } else {
        logistics.style.display = "block";
        logisticss.style.display = "block";
    }
});

var buyer = document.querySelector(".buyer");
var buyers = document.querySelector(".buyers");
var buy = document.getElementById("buy");

buy.addEventListener("click", function () {
    if (buyer.style.display === "block" && buyers.style.display === "block") {
        buyer.style.display = "none";
        buyers.style.display = "none";
    } else {
        buyer.style.display = "block";
        buyers.style.display = "block";
    }
});

var seller = document.querySelector(".seller");
var sellers = document.querySelector(".sellers");
var sell = document.getElementById("sell");

sell.addEventListener("click", function () {
    if (seller.style.display === "block" && sellers.style.display === "block") {
        seller.style.display = "none";
        sellers.style.display = "none";
    } else {
        seller.style.display = "block";
        sellers.style.display = "block";
    }
});






