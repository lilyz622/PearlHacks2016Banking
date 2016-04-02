$(document).ready(function() {
    console.log("Starting");
	makeNessieRequests();
});

var apikey = 'db8ac95e83b2dee47c29879b2f23d8ae';
var playerInfo = {
	playerFirstName: "John",
	playerLastName: "Doe",
}
var custId = '56c66be6a73e49274150758a';
var userAccount;
var userCustomer;


function makeNessieRequests(){
	//which of these functions do we want to use?
	require(['account', 'customer', 'deposit', 'withdrawal', 'bills'], function (account, customer, deposit, withdrawal, bills) {
		createAccountAndCustomer(account, customer);
		//accounts(apikey, account);
		//deposit(apikey, deposit);
		//withdrawal(apikey, withdrawal);
		//billsDemo(apikey, bills);
		/*atmDemo(apikey, atm); 
		branchDemo(apikey, branch);
		customerDemo(apikey, customer);
		merchantDemo(apikey, merchant); 	
		purchaseDemo(apikey, purchase);*/
	});
};



/*$.ajax({
   url: 'http://api.reimaginebanking.com/customers' + customer_id + '/bills?key=db8ac95e83b2dee47c29879b2f23d8ae',
   contentType: 'application/json',
   success: function(results){
        console.log(results);
    }
});*/

/*function makeNessieRequest(requestUrl){
	$.ajax({
		url: requestUrl,
		success: function(results){
			console.log(results);
		}
	});

}
	*/
function urlGen(account_id, type){
	return 'http://api.reimaginebanking.com/customers/' + account_id + '/'+ type + '?key=db8ac95e83b2dee47c29879b2f23d8ae';
}


function createAccountAndCustomer(account, customer){
	var custAccount = account.initWithKey(apikey);
	var accountDetails = {
		custId: '56c66be6a73e49274150758a',
		initialInfo: {
			AccountInfo: {
			  "type": "Checking",
			  "nickname": "string",
			  "rewards": 0,
			  "balance": 0,
			  "account_number": "56c66be7a73e4927415082e6",
			},
			CustomerInfo: {
				"first_name": playerInfo["playerFirstName"],
				"last_name":  playerInfo["playerLastName"],
				"address": {
					"street_number": "200",
					"street_name": "Sesame Street",
					"city": "New York City",
					"state": "New York",
					"zip": "10002"
				}
			}
		}
	}
	
	var account = account.initWithKey(apikey);
	console.log(account);
	var customer = customer.initWithKey(apikey);
	console.log(customer);
	account = account.getAllByCustomerId(accountDetails['custId']);
	customer.updateCustomer(accountDetails["custId"], accountDetails["CusomerInfo"]);
	console.log("Account: " + account);
	console.log("Customer " + customer.getCustomerById(accountDetails["custId"]));
}




