var express = require('express');
var app = express();
var fs = require("fs");
var braintree = require("braintree");
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
const cors=require('cors');//Cross-origin resource sharing
app.use(cors());

// globalId: 'cGF5bWVudG1ldGhvZF9obm05anM',
// token: 'hnm9js',
// uniqueNumberIdentifier: 'd9189fe23e7b8cdc08a0b1b5cb7309f4',

var customerId = 347;
var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "pkbfkxx3t926f7p5",
  publicKey: "fgrs8nqr7qvw9gp9",
  privateKey: "8d245aa8c25a7de55aebf8be4e7a7ec1"
});

// gateway.clientToken.generate({
//   customerId: 292540883
// }, function (err, response) {
//   var clientToken = response.clientToken
//   console.log(clientToken);
// });
// client for nipun : 292540883
// client for Vikrant : 292540883

/***
*  Get braintree token to open Dropin UI
*
******/
app.get('/payment/braintree-client-token', function (req, res) 
{	
	gateway.clientToken.generate({}, function (err, response) 
	{
		// console.log(response.clientToken);
		res.status(200).json(  
	    	{	
	    		"token" : response.clientToken
			}	
		);
	});
});


app.post("/payment/create-purchase", function (req, res) {

	var finalAmount = req.body.chargeAmount;
	var nonceFromTheClient = req.body.nonce;

	gateway.transaction.sale({
		amount: finalAmount,
		paymentMethodNonce: nonceFromTheClient,
		customerId: customerId,
		options: {
			storeInVaultOnSuccess: true,
			submitForSettlement: true
		}
	}, function (err, result) {
		console.log(result);
		res.status(200).json({   
	    	"response": result
		});
	});

});













app.post("/client_token", function (req, res) {
	console.log('braintree token fxn');
	gateway.clientToken.generate({ customerId:req.body.id }, function (err, response) {
		// console.log(response.clientToken);
		res.status(200).json({   
	    	"response": {	
	    		"token" : response.clientToken
			}	
		});
	});
});



app.post("/creaeteCustomer", function (req, res) {
	gateway.customer.create({
		firstName: "Jen",
		lastName: "Smith",
		company: "Braintree",
		email: "jen@example.com",
		phone: "312.555.1234",
		fax: "614.555.5678",
		website: "www.example.com",
		id:"" + customerId
	}, function (err, result) {
		console.log(result);
	  // result.success;
	  // result.customer.id;
	});

});

app.post("/checkout", function (req, res) {
  	var nonceFromTheClient = req.body.payload.nonce;
  	console.log(nonceFromTheClient);
	/*gateway.transaction.sale({
		amount: "110.30",
		paymentMethodNonce: nonceFromTheClient,
		customerId: customerId,
		options: {
			storeInVaultOnSuccess: true,
			submitForSettlement: true
		}
	}, function (err, result) {
		//console.log(result.response);
        if (result.success) {
        	console.log('---------success response-----------');
			console.log(result.transaction);
        } else {
            // Handle errors
			console.log('--------------error response-----------');
			console.log(err);
        }
	});*/
    gateway.transaction.sale({
        amount: "10.00",
        paymentMethodNonce: nonceFromTheClient,
        customerId: customerId,
        options: {
            submitForSettlement: true
        }
    }, function (err, result) {
    	console.log('----err---');
    	console.log(err);
    	console.log('----result---');
    	console.log(result);
    });

	/*res.status(200).json({   
		"response": {	
			"token" : response.clientToken
		}	
	});*/
  // Use payment method nonce here
  // res.send(nonceFromTheClient);
  console.log(nonceFromTheClient);
});

app.post("/create-payment-method", function (req, res) {
	// console.log(req.body.newCustNonce);
	var customerNonce = req.body.newCustNonce;
	gateway.paymentMethod.create({
		customerId: customerId,
		paymentMethodNonce: customerNonce
	}, function (err, result) { 

		// console.log(result);
		// console.log(result.creditCard);
		// console.log(result.creditCard.token);
		res.status(200).json({   
	    	"response": {	
	    		"ccToken" : result.creditCard.token
			}	
		});

	});

});

// --------------------------- Subscription Api's -------------------------------
app.post("/get-all-plans", function (req, res) {
	var plans = gateway.plan.all(function(err, result) { 
		res.status(200).json({   
	    	"response": {	
	    		"plansData" : result
			}	
		});
	});

});

app.post("/create-subscription", function (req, res) {
	console.log(req.body);
	var planId = req.body.planId;
	var ccToken = req.body.ccToken;
	var ccToken = "gcjczc";
	var planId = "1";
	gateway.subscription.create({
		paymentMethodToken: ccToken,
		planId: planId
	}, function (err, result) {
		res.status(200).json({   
	    	"response": {	
	    		"subsData" : result
			}	
		});
	});
	
	

});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})