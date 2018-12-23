//Inside Database we will have two object stores one is to store name of formular with idForm as a key and other field 
//will be name of the formular 
//Second store will hold elemens of formular with id, input, type of input, number of lines and value
//key of this store name  
//searchbyformname()-missing SELECT formName FROM FormularName WHERE value = passed value;
//getallformname()-missing SELECT formName FROM FOrmularName ;
//getallelem(let nameofform)-missing SELECT * FROM FormularElements WHERE name = passed value;
//add()-missing INSERT INTO table_name VALUES passed array
//store for answers and function for it-missing INSERT INTO table_answers VALUES passed array
// 

window.indexedDB = window.indexedDB || window.mozIndexDB || window.webkitIndexDB || window.msIndexDB;

//database version
var version = 1;

let request = window.indexedDB.open("FormularDB", 1);
let db, tx_name, tx_elem, storeForm, storeElem, indexFormName, indexFrmNm, indexElemID, indexElemType, indexElemValue;

let sizeofFormName;
let cursorForm,cursorElem;
let newFormName,newFormElem;
let existingForms,formNamecursor;
let storeAnswers;

var retValues = [];//array to hold formular names from FormularName for easier search and load
var formValues = [];// array to hold values of formular name field must be send
var ansArray = [];//storing answers from selected formulars

request.onupgradeneeded = function(e){
	let db = request.result,
	storeForm = db.createObjectStore("FormularName", {
		keyPath: "formID"
	});
		
	storeElem = db.createObjectStore("FormularElements", {
		keyPath: "elemID"
	});

	//creating table for answers
	storeAnswers = db.createObjectStore("Answers", {
		keyPath: "qID"
	});

	indexFormName = storeForm.createIndex("formName", "formName", {unique : false});
	indexFrmNm = storeElem.createIndex("name", "name", {unique : false});
}

request.onerror = function(e){
	console.log("There was an error :" + e.target.errorCode);
}

request.onsuccess = function(e){
	db = request.result;
	tx_name = db.transaction("FormularName", "readwrite");
	tx_elem = db.transaction("FormularElements", "readwrite");
	storeForm = tx_name.objectStore("FormularName");
	storeElem = tx_elem.objectStore("FormularElements");
	indexFormName = storeForm.index("formName");
	indexFrmNm = storeElem.index("name");

	/*formNamecursor = indexFormName.get('formular one test');
	formNamecursor.onsuccess = function(e){
		console.log("formNamecursor value " + formNamecursor.result);
		if(formNamecursor.result){
			var parent = document.getElementById("formulars-dropdown");
			var newOption = document.createElement("option");
			newOption.value = formNamecursor.result.formName;
			var newOptionText = document.createTextNode(formNamecursor.result.formName);
			newOption.appendChild(newOptionText);
			parent.appendChild(newOption);
			console.log("element of cursorElem" + formNamecursor.result.formName);
		}else{
			console.log("cursor ends here");
		}
		console.log("creating dropdown with elements done...");
	}*/

	sizeofFormName = storeForm.count();
	sizeofFormName.onerror = function(e){
		console.log("error is:" + e.target.errorCode);
	};
	sizeofFormName.onsuccess = function(e){
		console.log("size of formname is:" + sizeofFormName.result);
	};

	db.onerror = function(e){
		console.log(" ERROR :" + e.target.errorCode);
	}

	storeForm.put({formID: 1, formName: "formular one test"});
	storeForm.put({formID: 2, formName: "frm two test"});

	storeElem.put({name:"formular one test", elemID: 1, input: "input", type: "Textbox", numline: 0, value: "Mandatory"});
	storeElem.put({name:"formular one test", elemID: 2, input: "input", type: "Textbox", numline: 0, value: "None"});
	storeElem.put({name:"formular one test", elemID: 3, input: "input", type: "Textbox", numline: 0, value: "Numeric"});
	storeElem.put({name:"formular one test", elemID: 4, input: "input", type: "Radio button", numline: 3, value: "Mandatory"});
	storeElem.put({name:"formular one test", elemID: 5, input: "Checkbox", type: "Checkbox", numline: 0, value: "None"});
	storeElem.put({name:"frm two test", elemID: 1, input: "input", type: "Textbox", numline: 0, value: "None"});
	storeElem.put({name:"frm two test", elemID: 2, input: "input", type: "Textbox", numline: 0, value: "Numeric"});
	storeElem.put({name:"frm two test", elemID: 3, input: "input", type: "Checkbox", numline: 0, value: "None"});

	tx_name.oncomplete = function(){
		db.close();
		console.log("data closed tx_name");
	}
	
	tx_elem.oncomplete = function(){
		db.close();
		console.log("data closed tx_elem");
	}

}

function getFormularByName(value){
	console.log("called ....");
	var index;
	var retval = true;
	index = storeForm.get("value");
	index.onerror = function(e){
		console.log("element not found ...");
	}
	index.onsuccess = function(e){
		console.log("Formular found ..." + index.result);
		callback(retval);
	} 
}

//funciton for existing formulars in FOrmular.html
function onLoadFormular(){
	console.log("entering onLoad function...");
}

//function for displaying searched results
function displayResults(){
	let searchedFormular;
	let form;
	searchedFormular = document.getElementById("formname").value;
	console.log("searched value is:" + searchedFormular);

	if(getFormularByName(searchedFormular)){
		displaySearchedFormular(searchedFormular);
	}else{
		displayNew();
	}

}

//This function get called when we want to display selected formular first it div elem visible and then loops
//over storeElem where val(name of formular) is == name and appends it to div then it calles function that will get 
//other values from storeElem and set them 
function displaySearchedFormular(val){
	console.log("displaySearchedFormular called...");
	document.getElementById("dispform-inline").style.visibility = 'visble';
	let chiled = document.getElementById("dispform-inline");
	let newChld = chiled.cloneNode(true);
	document.getElementById("elem-holder").appendChild(newChld);

}

//save any changes to existing or new form
//must work with temp array to hold all information if its new form and store it in db indexeddb .add() method
//if its existing form call update indexeddb .put() method
function saveForm(){
	console.log("Saving ...");
}

//Function calls it self if there is no formular with the entered name and we need to unhide existing div 
//in side Home.html page div id = "body"
function displayNew(){
	console.log("displyNew called...");
	document.getElementById("dispform-inline").style.visibility = 'visible';
	console.log("displayNew done...");
}

//Function for adding more forms in new formular
function addMore(){
	console.log("Adding more elements...");

	let chiled = document.getElementById("dispform-inline");
	let newChld = chiled.cloneNode(true);
	document.getElementById("elem-holder").appendChild(newChld);
	console.log("adding done...");
}

//show hidden selector if radio button is selected
function showHidden(){
	console.log("showHidden called...");
	let isHidden = document.getElementById("type-element").value;
	let elem = document.getElementById("select-radio-number");
	if(isHidden == "Radio button"){
		if(elem.style.visibility === 'hidden'){	
		document.getElementById("select-radio-number").style.visibility = 'visible';
		console.log("vissible...");
		}
	}else{
		document.getElementById("select-radio-number").style.visibility = 'hidden';
		console.log("still hidden...");
	}
}

//Creating input elements when we select number of radio buttons
function selectRadBtn(){
	console.log("select radio button ...");
	let selectedRadBtnNo = document.getElementById("select-radio-number").value;
	let iter = 0;
	for(iter ; iter <= selectedRadBtnNo; iter++){
		var parent = document.getElementById("formulars-dropdown");
			var newInput = document.createElement("input");
			newInput.value = "";
			var newInputText = document.createTextNode("Radio button value " + i);
			newOption.appendChild(newInputText);
			parent.appendChild(newInput);
	}
}

//Save answers in array and .add() to answers table 
function saveRes(){
	console.log("Saveing answers ...");
}
//Missing functiong for checking is value mandatory and is it correct type
//Missing on radio button select 