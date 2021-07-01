let decorationSpans = document.querySelectorAll(".bui span");
let alignmentSpans = document.querySelectorAll(".alignment span");
let colorSpans = document.querySelectorAll(".colors span");
let font_family = document.querySelector("#cell-font-family");
let increase=document.querySelector(".increase");
let decrease=document.querySelector(".decrease");

let currentSize=document.querySelector(".current");



decorationSpans[0].addEventListener("click", (e) => {

    oldCell.style.fontWeight = "bold";
    let cellAdress = oldCell.getAttribute("data-address");
    dataObj[cellAdress].fontWeight = "bold";
});

decorationSpans[1].addEventListener("click", (e) => {
    oldCell.style.fontStyle = "Italic";
    let cellAdress = oldCell.getAttribute("data-address");
    dataObj[cellAdress].italics = "italic";

});

decorationSpans[2].addEventListener("click", (e) => {
    oldCell.style.textDecoration = "underline";
    let cellAdress = oldCell.getAttribute("data-address");
    dataObj[cellAdress].underline = "underline";

});

alignmentSpans[0].addEventListener("click", (e) => {
    oldCell.style.textAlign = "left";
    let cellAdress = oldCell.getAttribute("data-address");
    dataObj[cellAdress].textAlign = "left";



});
alignmentSpans[1].addEventListener("click", (e) => {

    oldCell.style.textAlign = "center";
    let cellAdress = oldCell.getAttribute("data-address");
    dataObj[cellAdress].textAlign = "center";


});
alignmentSpans[2].addEventListener("click", (e) => {

    oldCell.style.textAlign = "right";
    let cellAdress = oldCell.getAttribute("data-address");
    dataObj[cellAdress].textAlign = "right";


});

colorSpans[0].addEventListener("click", function () {
    let colorPicker = document.createElement("input");
    colorPicker.type = "color";

    colorPicker.addEventListener("change", function (e) {
        oldCell.style.color = e.currentTarget.value;
        let address = oldCell.getAttribute("data-address");
        dataObj[address].fontColor = e.currentTarget.value;
    });

    colorPicker.click();
});

colorSpans[1].addEventListener("click", function () {
    let colorPicker = document.createElement("input");
    colorPicker.type = "color";

    colorPicker.addEventListener("change", function (e) {
        oldCell.style.backgroundColor = e.currentTarget.value;
        let address = oldCell.getAttribute("data-address");
        dataObj[address].backgroundColor = e.currentTarget.value;


    });

    colorPicker.click();
});


font_family.addEventListener("click", (e) => {
    oldCell.style.fontFamily = e.currentTarget.value;
    let address = oldCell.getAttribute("data-address");
    dataObj[address].fontFamily = e.currentTarget.value;

});

increase.addEventListener("click",(e)=>{

    let curr=Number(currentSize.innerText);
    if(curr<50)
    {
    currentSize.innerText=curr+1;
    oldCell.style.fontSize=`${curr+1}px`;
    }
   
});
decrease.addEventListener("click",(e)=>{

    let curr=Number(currentSize.innerText);

    if(curr>0)
    {
    currentSize.innerText=curr-1;
    oldCell.style.fontSize=`${curr-1}px`;
    
    
    }
});