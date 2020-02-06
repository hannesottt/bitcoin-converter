import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as request from 'request';

const app = express();
const port : number = 3000;
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response) {
	response.sendfile(__dirname + "/index.html");
});

app.post('/', function(req, res) {
	let currency : string = req.body.currency;
	let amount : number = req.body.amount;
	let url : string = 'https://api.coindesk.com/v1/bpi/currentprice/' + currency + '.json';
	request(url, function(error, response, body) {
		console.log('status: ' + response.statusMessage + 
		'\nstatusCode: ' + response.statusCode);
		let data : any = JSON.parse(body);
		let rate : number = 0;
		let calcAmount : number;
		switch (currency) {
			case "usd":
				rate = data.bpi.USD.rate_float;
				break;
			case "eur":
				rate = data.bpi.EUR.rate_float;
				break;
			case "jpy":
				rate = data.bpi.JPY.rate_float;
				break;
		}
		if (rate != 0) {
			calcAmount = amount*rate;
		}
		res.send(`${amount} bitcoin price in ${currency} is ${calcAmount}`);
	});
});

app.listen(port, function() {
	console.log('started on port ' + 3000);
})