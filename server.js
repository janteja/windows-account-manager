const express = require('express');
var spawn = require("child_process").spawn,child;
const { parse } = require('querystring');
const csv = require('csv-parser');
var bodyParser     =         require("body-parser");
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())

var myData = [];
var i = 0;
var array = []





app.listen(8080);



app.get('/', function (req, res){
res.sendFile("C:\\Users\\Administrator\\Desktop\\index.html");
});

app.post('/logins', function (req,res){
var username= req.body.username;
child = spawn("powershell.exe",["C:\\users\\administrator\\desktop\\script.ps1 \-LastLogonOnly \| Export-Csv result.csv"]);
child.stdout.on("data",function(data){
    myData.push(" " + data);
});
child.stderr.on("data",function(data){
    console.log("Powershell Errors: " + data);
});
child.on("exit",function(){
array = [];
i=0;
fs.createReadStream('result.csv')
  .pipe(csv())
  .on('data', (row) => {
    array[i]=row;
    i++;
  })
  .on('end', () => {
   res.write(`<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style type="text/css">
  table, td, th {  
  border: 1px solid #ddd;
  text-align: left;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  padding: 15px;
body {
  font-family: Arial;
}

* {
  box-sizing: border-box;
}

form.example input[type=text] {
  padding: 10px;
  font-size: 17px;
  border: 1px solid grey;
  float: left;
  width: 80%;
  background: #f1f1f1;
}

form.example button {
  float: left;
  width: 20%;
  padding: 10px;
  background: #2196F3;
  color: white;
  font-size: 17px;
  border: 1px solid grey;
  border-left: none;
  cursor: pointer;
}

form.example button:hover {
  background: #0b7dda;
}

form.example::after {
  content: "";
  clear: both;
  display: table;
}
</style>
</head>

<body>
<form class="example" method="POST" action="/logins" style="margin:auto;max-width:300px">
  <input type="text" placeholder="Search.." name="username">
  <button type="submit"><i class="fa fa-search"></i></button>
</form>

<table>
  <tr>
    <th>Time</th> 
    <th>User</th>
	<th>Workstation</th>
	<th>IP</th
  </tr> `);

for(let i = 1; i < array.length; i++){ 
if( (array[i][2].toString() == username) || (username == "*")|| (username == null)){
res.write("<tr>");
 res.write("<td>" + array[i][1] + "</td>");
 res.write("<td>" + array[i][2] + "</td>");
 res.write("<td>" + array[i][4] + "</td>");
 res.write("<td>" + array[i][5] + "</td>");
 res.write("</tr>");
}


}


res.end(`</html>`);

 });

});
child.stdin.end();
});

app.get('/locked', function(req,res) {

child = spawn("powershell.exe",["  Search-ADAccount -LockedOut | Export-Csv locked.csv"]);
child.stdout.on("data",function(data){
    myData.push(" " + data);
});
child.stderr.on("data",function(data){
    console.log("Powershell Errors: " + data);
});
child.on("exit",function(){
array = [];
i=0;
fs.createReadStream('locked.csv')
  .pipe(csv())
  .on('data', (row) => {
    array[i]=row;
    i++;
  })
  .on('end', () => {
   res.write(`<!doctype html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap - Prebuilt Layout</title>
<link href="style.css" rel="styleshee" type="text/css">
	   <!-- Bootstrap -->
</head>

<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark col-xl-12" style="padding-bottom: 10px;"><a class="navbar-brand" " href="#">Locked Accounts.</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
       <span class="navbar-toggler-icon"></span>
       </button>
</nav>
<div class="Menu">
    <table class="buttons">
		  <tr>
			  <td> <form method="POST" action="/logins"> <button type="submit" style="display:inline-block; background-color:slateblue; color:aliceblue;" > Logins</button> </form> </td>
			  <td> 	    <form method="GET" action="/locked">  <button style="display:inline-block; background-color:slateblue; color:aliceblue;" > Lockouts</button> </form> </td>
		  
		  </tr>
  </table>
		
  </div>
	  <div class="searchBar">
		  <form method="POST" action="/search" > 
		  <input  type="text" class="form-control mr-sm-2" name="username" type="search" placeholder="Search User" aria-label="Search"> 
	  <button style=" width: 100%; border:none; border-bottom:ridge; border-bottom-color:darkslateblue;"btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>  </div>
			</form>
  `);
console.log(array);
for(let i = 1; i < array.length; i++){ 

res.write(" <div class='results'> <table> <tr>");
 res.write("<td style='font-weight: bold;'> Username </td>");
 res.write("<td>" + array[i][5] + "</td>");
 res.write("</tr>");
 res.write("<tr>");
 res.write("<td style='font-weight: bold;'>Last Logon Date </td>");
res.write("<td>" + array[i][3] + "</td> </tr> <tr>");
res.write("<td style='font-weight: bold;'>Locked Out </td>");
	res.write("<td>" + array[i][4] + "</td>  </tr> <tr> ");
 res.write("<td style='font-weight: bold;'>Account Enabled </td>");
	res.write("<td>" + array[i][2] + "</td>  </tr> <tr> ");
 res.write("<td style='font-weight: bold;'>Password Expired </td>");
	res.write("<td>" + array[i][8] + "</td>  </tr> <tr> ");
 res.write("<td style='font-weight: bold;'>Account Expired </td>");
		res.write("<td>" + array[i][8] + "</td>  </tr> </table> <br><br>");



}


res.end(`</div></html>`);

 });

});
child.stdin.end()

});

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(parse(body));
        });
    }
    else {
        callback(null);
    }
}





