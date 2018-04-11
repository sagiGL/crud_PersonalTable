'use strict';

let jsonDataObject;
let tableContent ;
let currentItemUsed;
let objectJsonInfo = ['id','firstName','lastName','address','imageLink'];

window.onload=function() {
    tableContent = document.getElementById("tableItems");
    if (localStorage.getItem('data')){
        jsonDataObject = JSON.parse(localStorage.getItem('data'));
    } else {
        jsonDataObject = data;
    }

    loadTable(jsonDataObject,tableContent);
    jsonDataObject = tableToJson(tableContent,jsonDataObject);

    document.getElementById("addButton").addEventListener("click", function(event) {
        clearAddForm();
        currentItemUsed = this;
    });

    document.getElementById("submitAdd").addEventListener("click", function(event) {
        let newInput = getAddFormInput();
        jsonDataObject = addJsonData(getAddFormInput(),jsonDataObject);
        loadTable(jsonDataObject,tableContent);
    });

    document.getElementById("submitEdit").addEventListener("click", function(event) {
       let newInput = getEditFormInput();
       let trElement = document.getElementById("tr" + currentItemUsed.parentElement.getAttribute("gBtnID"));
       editItemVal(newInput,trElement);
       jsonDataObject = tableToJson(tableContent,jsonDataObject);
       loadTable(jsonDataObject,tableContent);
    });

    document.getElementById("loadDataButton").addEventListener("click", function(event) {
        jsonDataObject = data;
        localStorage.setItem('data',JSON.stringify(jsonDataObject));
        loadTable(jsonDataObject,tableContent);
    });

};

function saveDataOnCookie(jsonData){

}

function addJsonData(newObjectData,jsonDataFile){
    let dataLength = jsonDataFile.length;
    let obj = {};
    obj[objectJsonInfo[0]]= dataLength + 1;
    for (let i=0; i < objectJsonInfo.length -1; i++){
        obj[objectJsonInfo[i+1]]= newObjectData[i];
    }
    jsonDataFile[dataLength] = obj;
    return jsonDataFile;
}

function fixNo(){
    let idList = document.querySelectorAll("td[role=id]");
    for (let k = 0; k < idList.length;k++){
        idList[k].innerHTML = k+1;
    }
}
function getAddFormInput(){
    let newFName = document.getElementById("firstNameAdd").value;
    let newLName = document.getElementById("lastNameAdd").value;
    let newAddress = document.getElementById("addressAdd").value;
    let newImage = document.getElementById("imageLinkAdd").value;
    return [newFName,newLName,newAddress,newImage];
}

function getEditFormInput(){
    let newFName = document.getElementById("firstNameEdit").value;
    let newLName = document.getElementById("lastNameEdit").value;
    let newAddress = document.getElementById("addressEdit").value;
    let newImage = document.getElementById("imageLinkEdit").value;
    return [newFName,newLName,newAddress,newImage];
}

function editItemVal([nfName,nlName,nAddress,nImage],tableItemElement){
    tableItemElement.children[1].setAttribute("value",nfName);
    tableItemElement.children[2].setAttribute("value",nlName);
    tableItemElement.children[3].setAttribute("value",nAddress);
    tableItemElement.children[4].setAttribute("value",nImage);
}
function clearAddForm() {
    document.getElementById("firstNameAdd").value ="";
    document.getElementById("lastNameAdd").value = "";
    document.getElementById("addressAdd").value = "";
    document.getElementById("imageLinkAdd").value = "";
}

function clearEditForm() {
    document.getElementById("firstNameEdit").value ="";
    document.getElementById("lastNameEdit").value = "";
    document.getElementById("addressEdit").value = "";
    document.getElementById("imageLinkEdit").value = "";
}
function fillForm(tableItemElement){
    document.getElementById("firstNameEdit").value = tableItemElement.children[1].getAttribute('value');
    document.getElementById("lastNameEdit").value = tableItemElement.children[2].getAttribute('value');
    document.getElementById("addressEdit").value = tableItemElement.children[3].getAttribute('value');
    document.getElementById("imageLinkEdit").value = tableItemElement.children[4].getAttribute('value');
}

function tableToJson(tableElement,jsonDataFile){

    jsonDataFile = [];
    for (let m = 0; m < tableElement.childElementCount;m++) {
        let object = {};
        for (let n = 0; n < tableElement.children[m].childElementCount - 1; n++) {
            object[tableElement.children[m].children[n].getAttribute('role')] = tableElement.children[m].children[n].getAttribute('value');
    }
        jsonDataFile[m] = object;
    }

    localStorage.setItem('data',JSON.stringify(jsonDataFile));
    return jsonDataFile;
}

function loadTable(tableData,tBodyElement){
    while (tBodyElement.firstChild) {
        tBodyElement.removeChild(tBodyElement.firstChild);
    }

    for (let i = 0; i < tableData.length; i++){
        let tr = document.createElement("tr");
        tr.setAttribute("id","tr" + i);

        for(let key in tableData[i]){
            let td = document.createElement("td");
            td.setAttribute("role",key);
            td.setAttribute("value",tableData[i][key]);
            if (key === "imageLink"){
                let imageLink = document.createElement("img");
                imageLink.src = tableData[i].imageLink;
                tr.appendChild(td).appendChild(imageLink);
            }
            else{
                td.innerHTML = tableData[i][key];
                tr.appendChild(td);
            }
        }

        let controlContainer = document.createElement("td");
        addGBtn(controlContainer,tBodyElement,tr,i);
        tBodyElement.appendChild(tr);
    }
    fixNo();
}


function addGBtn(parentTd,parentTBody,parentItem,c){
    let gBtn =document.createElement("div");
    let editBtn = document.createElement("button");
    let deleteBtn = document.createElement("button");
    gBtn.setAttribute("class","btn-group");
    gBtn.setAttribute("gBtnID",c);
    deleteBtn.setAttribute("class","btn btn-danger");
    editBtn.setAttribute("class","btn btn-warning");
    editBtn.setAttribute("data-toggle","modal");
    editBtn.setAttribute("data-target","#editPopUp");
    editBtn.type = "button";
    editBtn.innerHTML = "edit";
    deleteBtn.type = "button";
    deleteBtn.innerHTML = "delete";
    gBtn.appendChild(editBtn);
    gBtn.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", function(event) {
        let result = confirm("you sure want to delete?");
        if (result) {
            parentTBody.removeChild(document.getElementById("tr" + this.parentElement.getAttribute("gBtnID")));
        }
        jsonDataObject = tableToJson(tableContent,jsonDataObject);
        loadTable(jsonDataObject,tableContent);
    });

    editBtn.addEventListener("click", function(event) {
        fillForm(document.getElementById("tr" + this.parentElement.getAttribute("gBtnID")));
        currentItemUsed = this;
    });

    parentItem.appendChild(parentTd).appendChild(gBtn);
}

function bake_cookie(name, value) {
    var cookie = [name, '=', JSON.stringify(value), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
    document.cookie = cookie;
}

function read_cookie(name) {
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    result && (result = JSON.parse(result[1]));
    return result;
}

function delete_cookie(name) {
    document.cookie = [name, '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
}
function userConstructor(name, street, city) {
    // ... your code
    this.dumpData = function () {
        return {
            'userConstructorUser': {
                name: this.name,
                street: this.street,
                city: this.city
            }
        }
    }
}