
$(document).ready(function() {
	createAccountAndCustomer();
});


var apikey = 'db8ac95e83b2dee47c29879b2f23d8ae';
var playerInfo = {
	playerFirstName: "John",
	playerLastName: "Doe",
}
var custId = '56c66be6a73e49274150758c';
var userAccountId = generateUserAccountId();
var userAccount;
var startingMoney = 0;


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

			/*request.complete(function(results) {
				accounts = results.responseJSON;
				userAccountId = accounts[accounts.length-1];
				console.log(userAccountId);
			});
			return accounts;*/
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
		data: 'key=db8ac95e83b2dee47c29879b2f23d8ae',
		async: false,
		dataType: 'json',
		success: function (msg) {
		   console.log("Got Account")
		   console.log(msg);
		},
		error: function (errormessage) {
			console.log(errormessage);
			//do something else

		}
	});
}
	
function makeWithdrawal(account, withdrawal, amount, description){
	console.log("Creating Withdrawal");
	$.ajax({
		url: "http://api.reimaginebanking.com/accounts/" + userAccountId + "/withdrawals?key=" + apikey,
		type: "POST",
		data: JSON.stringify({
			"medium": "balance",
			"transaction_date": "2016-04-02",
			"status": "pending",
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

function makeDeposit(amount, description){
	console.log("Creating Deposit");
	console.log(userAccountId);
	$.ajax({
		url: "http://api.reimaginebanking.com/accounts/" + userAccountId + "/deposits?key=" + apikey,
		type: "POST",
		data: JSON.stringify({
			"medium": "balance",
			"transaction_date": "2016-04-02",
			"status": "pending",
			"amount": amount,
			"description": description
		}),
		contentType: "application/json",
		dataType: "json",
		success: function (msg) {
		   console.log("Deposit Created")
		   console.log(msg);
		},
		error: function (errormessage) {
			console.log(errormessage);
			//do something else
		}
    });
}	




