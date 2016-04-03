$(document).ready(function() {
	reset();
});


var occupationTree = {
	"arts": {
		"salary": 60000,
		"loans": 15000,
	},
	"education": {
		"salary": 80000,
		"loans": 20000,
	},
	"engineering": {
		"salary": 150000,
		"loans": 60000,
	},
	"medicine": {
		"salary": 250000,
		"salary": 250000,
		"loans": 100000
	},
}

var decisionTree = [
	[["7%", .07],["10%", .1],["15%", .15],["How much of your monthly paycheck would you like to spend on food and furniture?", "Make sure to spend enough that you live comfortably."], true],
	[["$500", 500], ["$1000",1000], ["$2500", 2500], ["How much would you like to apply towards your college loan this month?", "The less your pay on your loan now, the more interest you'll need to pay later."], false],
	[["An apartment near my work", 1000],["A townhouse in biking distance from my work", 900],["An apartment far from my work", 850],["Where would you like to live?", "The closer you are to work, the higher your rent and the cheaper your transportation costs."], false],
];



var currentQuestion = 0;
var apikey = 'db8ac95e83b2dee47c29879b2f23d8ae';
var playerInfo = {
	playerFirstName: "John",
	playerLastName: "Doe"
}
var custId = '56c66be6a73e49274150758c';
var userAccountId = generateUserAccountId();
var userAccount;
var startingMoney = 0;
var balance = startingMoney;
var remainingCollegeLoan;
var salary = 0;
var multiplier = 0.77;
var spending = 0;

function generateUserAccountId(){
	var id = "";
	for(var i = 0; i<16; i++){
		id += Math.floor(Math.random()*10).toString();
	}
	console.log(id);
	return id;
}


function createAccountAndCustomer(){
	var accountDetails = {
		custId: '56c66be6a73e49274150758a',
	}
	console.log("Creating account");
	
	$.ajax({
		type: "POST",
		url: "http://api.reimaginebanking.com/customers/" +custId + "/accounts?key=db8ac95e83b2dee47c29879b2f23d8ae",
		data: JSON.stringify({
			"nickname": "a",
			"account_number": userAccountId,
			"type": "Checking",
			"rewards": 0,
			"balance": startingMoney
		}),
		contentType: "application/json",
		dataType: "json",
		success: function (msg) {
			console.log("Account Created");
			$.ajax({ 
				type: "GET",
				url: "http://api.reimaginebanking.com/customers/" +custId + "/accounts?key=db8ac95e83b2dee47c29879b2f23d8ae",
				//data: 'key='+apikey,
				dataType: 'json',
			success: function (accounts) {
				console.log("New ID" + accounts);
				userAccountId = accounts[accounts.length-1]["_id"];
				console.log(userAccountId);
			},
			error: function (errormessage) {
				console.log(errormessage);
				//do something else

			}
		});
		},
		error: function (errormessage) {
			console.log(errormessage);
			//do something else

		}
    });
}

function getAccount(){
	console.log("Getting account");
	$.ajax({
		url: "http://api.reimaginebanking.com/accounts/" + userAccountId + "?key=" + apikey,
		//data: 'key=db8ac95e83b2dee47c29879b2f23d8ae',
		async: false,
		dataType: 'json',
		success: function (msg) {
		   console.log("Got Account")
		   console.log(msg);
		   userAccount = msg;
		},
		error: function (errormessage) {
			console.log(errormessage);
			//do something else

		}
	});
}

function getBalance(){
	getAccount();
	balance = userAccount["balance"];
	console.log(balance);
	return balance;
}
	
function makeWithdrawal(amount, description){
	console.log("Creating Withdrawal");
	$.ajax({
		url: "http://api.reimaginebanking.com/accounts/" + userAccountId + "/withdrawals?key=" + apikey,
		type: "POST",
		data: JSON.stringify({
			"medium": "balance",
			"transaction_date": "2016-04-02",
			"status": "completed",
			"amount": amount,
			"description": description
		}),
		contentType: "application/json",
		dataType: "json",
		success: function (msg) {
		   console.log("Withdrawal Created")
		   console.log(msg);
		},
		error: function (errormessage) {
			console.log(errormessage);
			//do something else
		}
	});
}

function makePurchase(amount, description){
	console.log("Creating Purchase");
	//console.log(userAccountId);
	$.ajax({
		url: "http://api.reimaginebanking.com/accounts/" + userAccountId + "/purchases?key=" + apikey,
		type: "POST",
		data: JSON.stringify({
		  "merchant_id": "56c66be6a73e492741507624",
		  "medium": "balance",
		  "purchase_date": "2016-04-03",
		  "amount": amount,
		  "status": "completed",
		  "description": description
		}),
		contentType: "application/json",
		dataType: "json",
		success: function (msg) {
		   console.log(msg);
		},
		error: function (errormessage) {
			console.log(errormessage);
			//do something else
		}
    });
}

function makeDeposit(amount, description){
	console.log("Creating Deposit");
	console.log(userAccountId);
	$.ajax({
		url: "http://api.reimaginebanking.com/accounts/" + userAccountId + "/deposits?key=" + apikey,
		type: "POST",
		data: JSON.stringify({
			"medium": "balance",
			"transaction_date": "2016-04-02",
			"status": "completed",
			"amount": amount,
			"description": description
		}),
		contentType: "application/json",
		dataType: "json",
		success: function (msg) {
		   console.log(msg);
		},
		error: function (errormessage) {
			console.log(errormessage);
			//do something else
		}
    });
}	

function makeAction(numberClicked){
	var actOn = decisionTree[currentQuestion];
	console.log(actOn);
	if(actOn[4]){
		var salaryMult = Math.floor((salary)*(multiplier));
		makeWithdrawal(Math.floor(salaryMult*(actOn[numberClicked][1])), actOn[3]);
		spending += Math.floor(salaryMult*(multiplier)*(actOn[numberClicked][1]));
		balance -= Math.floor(salaryMult*(multiplier))*(actOn[numberClicked][1]);
	}
	else{
		makePurchase(actOn[numberClicked][1], actOn[3])
		spending += actOn[numberClicked][1]
		balance -= actOn[numberClicked][1];
		if(currentQuestion == 1){
			remainingCollegeLoan -= actOn[numberClicked][1];
		}
	}
	currentQuestion +=1;
	if(currentQuestion < decisionTree.length){
		writeQuestion();
	}
	else{
		console.log("Finished");
		finish();
		getBalance();
	}
}

function writeQuestion(){
	document.getElementById('question').innerHTML = decisionTree[currentQuestion][3][0];
	document.getElementById('blurb').innerHTML = decisionTree[currentQuestion][3][1];
	for(var i = 0; i<3; i++){
		document.getElementById('bubble' + i).innerHTML = decisionTree[currentQuestion][i][0];
	}
}

function finish(){
	document.getElementById("everything").innerHTML = '<p>You have completed the game. You spent $' + spending + ' and have $' + balance + ' remaining.</p>'  + 
	'<p>Your annual salary was $' + (salary*multiplier) + ' and have $' + Math.floor((remainingCollegeLoan*1.05)) + ' left of your college loan.</p>' +
	'<p>We hope this game has encouraged you to think about your choices and spending, as well as the impact it has on your financial situation.</p>';
}

function careerChoice(career){
	salary = occupationTree[career]['salary'];
	remainingCollegeLoan = occupationTree[career]['loans'];
	makeDeposit(salary, "paycheck");
	balance += Math.floor((salary)*(multiplier));
	$("#careerChoice").hide();
	$("#choice").show();
	writeQuestion();
}

function genderSubmit(gender){
	if(gender == "MALE"){
		multiplier = 1;
	}
	else if(gender == "FEMALE"){
		multiplier = .77;
	}
	else{
		multiplier = .6
	}
	$("#genderChoice").hide();
	$("#careerChoice").show();
	
}
function reset(){
	createAccountAndCustomer();
	$("#choice").hide();
	$("#careerChoice").hide();
	$("#genderChoice").show();
}
function restart(){
	window.location = "index.html";
}
