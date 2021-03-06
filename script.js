
console.log("hi!!");

let body = document.querySelector("body");
let dataObj = {};
body.spellcheck = false;
let columnTags = document.querySelector(".column-tags");
let rowNumbers = document.querySelector(".row-numbers");
let grid = document.querySelector(".grid");
let formulaSelectCell = document.querySelector("#select-cell");
let formulaCell = document.querySelector("#complete-formula");
let menuBarPtags = document.querySelectorAll(".menu-bar p");

for (let i = 0; i < menuBarPtags.length; i++) {
  menuBarPtags[i].addEventListener("click", function (e) {
    if (e.currentTarget.classList.contains("menu-bar-option-selected")) {
      e.currentTarget.classList.remove("menu-bar-option-selected");
    } else {
      for (let j = 0; j < menuBarPtags.length; j++) {
        if (menuBarPtags[j].classList.contains("menu-bar-option-selected"))
          menuBarPtags[j].classList.remove("menu-bar-option-selected");
      }

      e.currentTarget.classList.add("menu-bar-option-selected");
    }
  });
}
for (let i = 0; i < 26; i++) {
  let div = document.createElement("div");
  div.classList.add("column-tag-cell");
  div.innerText = String.fromCharCode(65 + i);
  columnTags.append(div);
}

for (let i = 1; i <= 100; i++) {
  let div = document.createElement("div");
  div.classList.add("row-number-cell");
  div.innerText = i;
  rowNumbers.append(div);
}
let oldCell;
for (let j = 1; j <= 100; j++) {
  let row = document.createElement("div");
  row.classList.add("row");

  for (let i = 0; i < 26; i++) {
    let cell = document.createElement("div");
    cell.classList.add("cell");
    cell.contentEditable = true;
    let address = String.fromCharCode(i + 65) + j;
    cell.setAttribute("data-address", address);
    dataObj[address] = {
      value: "",
      formula: "",
      downstream: [],
      upstream: [],
      fontSize: 10,
      fontFamily: "Arial",
      fontWeight: "normal",
      color: "black",
      backgroundColor: "white",
      underline: "none",
      italics: "normal",
      textAlign: "left",
    };
    cell.addEventListener("click", (e) => {
      if (oldCell) {
        oldCell.classList.remove("grid-selected-cell");
      }
      e.currentTarget.classList.add("grid-selected-cell");

      let cellAddress = e.currentTarget.getAttribute("data-address");

      formulaSelectCell.value = cellAddress;

      oldCell = e.currentTarget;
      
    });
    cell.addEventListener("input", (e) => {
      let data = e.currentTarget.innerText;
      let addr = e.currentTarget.getAttribute("data-address");
      dataObj[addr].value = data;
      dataObj[addr].formula = "";
      let currCellUpstream = dataObj[addr].upstream;

      for (let i = 0; i < currCellUpstream.length; i++) {
        removeFromUpstream(address, currCellUpstream[i]);
      }

      dataObj[address].upstream = [];
      let currCellDownstream = dataObj[address].downstream;

      for (let i = 0; i < currCellDownstream.length; i++) {
        updateDownstreamElements(currCellDownstream[i]);
      }
    });
    row.append(cell);
  }
  grid.append(row);
}


formulaCell.addEventListener("change", (e) => {
  let formulae = e.currentTarget.value;
  AddFormula(formulae);
  formulaCell.value = "";
});
function addToDownstream(tobeAdded, inWhichWeAreAdding) {
  //get downstream of the cell in which we have to add
  let reqDownstream = dataObj[inWhichWeAreAdding].downstream;

  reqDownstream.push(tobeAdded);
}

function removeFromUpstream(dependent, onWhichItIsDepending) {
  let newDownstream = [];

  let oldDownstream = dataObj[onWhichItIsDepending].downstream;

  for (let i = 0; i < oldDownstream.length; i++) {
    if (oldDownstream[i] != dependent) newDownstream.push(oldDownstream[i]);
  }
  dataObj[onWhichItIsDepending].downstream = newDownstream;
}

function updateDownstreamElements(elementAddress) {
  //1- jis element ko update kr rhe hai unki upstream elements ki current value leao
  //unki upstream ke elements ka address use krke dataObj se unki value lao
  //unhe as key value pair store krdo valObj naam ke obj me
  let valObj = {};

  let currCellUpstream = dataObj[elementAddress].upstream;

  for (let i = 0; i < currCellUpstream.length; i++) {
    let upstreamCellAddress = currCellUpstream[i];
    let upstreamCellValue = dataObj[upstreamCellAddress].value;

    valObj[upstreamCellAddress] = upstreamCellValue;
  }

  //2- jis element ko update kr rhe hai uska formula leao
  let currFormula = dataObj[elementAddress].formula;
  //formula ko space ke basis pr split maro
  let formulaArr = currFormula.split(" ");
  //split marne ke baad jo array mili uspr loop ara and formula me jo variable h(cells) unko unki value se replace krdo using valObj
  for (let j = 0; j < formulaArr.length; j++) {
    if (valObj[formulaArr[j]]) {
      formulaArr[j] = valObj[formulaArr[j]];
    }
  }

  //3- Create krlo wapis formula from the array by joining it
  currFormula = formulaArr.join(" ");

  //4- evaluate the new value using eval function
  let newValue = eval(currFormula);

  //update the cell(jispr function call hua) in dataObj
  dataObj[elementAddress].value = newValue;

  //5- Ui pr update krdo new value
  let cellOnUI = document.querySelector(`[data-address=${elementAddress}]`);
  cellOnUI.innerText = newValue;

  //6- Downstream leke ao jis element ko update kra just abhi kuki uspr bhi kuch element depend kr sakte hai
  //unko bhi update krna padega
  let currCellDownstream = dataObj[elementAddress].downstream;

  //check kro ki downstream me elements hai kya agr han to un sab pr yehi function call krdo jise wo bhi update hojai with new value
  if (currCellDownstream.length > 0) {
    for (let k = 0; k < currCellDownstream.length; k++) {
      updateDownstreamElements(currCellDownstream[k]);
    }
  }
}

// =============================================== Detect Cycle ========================================
function cycle( cellAddress, formulaeArray){


  let downstream=dataObj[cellAddress].downstream;

if(formulaeArray.find((el)=>{

return cellAddress==el;

}))
{
  return true;
}


  for(let i=0;i<downstream.length;i++)
  {
    for(let j=0;j<formulaeArray.length;j++)
    {
      if(formulaeArray[j]==downstream[i])
      {
        //cycle Detected//
        return true;
      }
    }
  }

  for(let i=0;i<downstream.length;i++)
  {

    if(cycle(downstream[i],formulaeArray))
    {
      return true;
    }
  }

  return false;

}

// ==================================================== ADD Formula ===============================================

function AddFormula(formulae)
{
  let selectedCellAddress = oldCell.getAttribute("data-Address");
  

  dataObj[selectedCellAddress].formula = formulae;

  let formulaArr = formulae.split(" ");

  let elementsArray = [];

  for (let i = 0; i < formulaArr.length; i++) {
    if (
      formulaArr[i] != "+" &&
      formulaArr[i] != "-" &&
      formulaArr[i] != "*" &&
      formulaArr[i] != "/" &&
      isNaN(Number(formulaArr[i]))
    ) {
      elementsArray.push(formulaArr[i]);
    }
  }

  //BEFORE SETTING NEW UPSTREAM
  //CLEAR OLD UPSTREAM
  if(cycle(selectedCellAddress,elementsArray))
  {
    formulaCell.value="";
    alert("Circular Dependencies!! ");
    showErr(selectedCellAddress);
     return ;
  }  

  let oldUpstream = dataObj[selectedCellAddress].upstream;

  for (let k = 0; k < oldUpstream.length; k++) {
    removeFromUpstream(selectedCellAddress, oldUpstream[i]);
  }

  dataObj[selectedCellAddress].upstream = elementsArray;

  for (let j = 0; j < elementsArray.length; j++) {
    addToDownstream(selectedCellAddress, elementsArray[j]);
  }

  let valObj = {};
  for (let i = 0; i < elementsArray.length; i++) {
    valObj[elementsArray[i]] = dataObj[elementsArray[i]].value;
    if (valObj[elementsArray[i]] == "") {
      valObj[elementsArray[i]] = 0;
    }
  }

  for (let i = 0; i < formulaArr.length; i++) {
    if (valObj[formulaArr[i]]) {
      formulaArr[i] = valObj[formulaArr[i]];
    }
  }

  formulae = formulaArr.join(" ");
  let newValue = eval(formulae);
  dataObj[selectedCellAddress].value = newValue;
  let selectedCellDownstream = dataObj[selectedCellAddress].downstream;

  for (let i = 0; i < selectedCellDownstream.length; i++) {
    updateDownstreamElements(selectedCellDownstream[i]);
  }

  oldCell.innerText = newValue;
}

function showErr(cellAddress)
{

dataObj[cellAddress].value="err!!";
document.querySelector(`div[data-address=${cellAddress}]`).innerHTML="err!!";

let downStream=dataObj[cellAddress].downstream;
for(let i=0;i<downStream.length;i++)
{
  showErr(downStream[i]);
}

}