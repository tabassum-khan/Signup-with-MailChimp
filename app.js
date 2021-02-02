//jshint esversion:6

const express = require('express');
const bodyparser = require('body-parser');
const request = require('request');
const https = require('https');

const app =  express();
const port = 3000;

/*For serving static files */
app.use(express.static("public"));

//applying bodyparser
app.use(bodyparser.urlencoded({extended: true}));

app.get ("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname, 
                    LNAME: lname
                }
            }
        ] 
    };

    const jsonData = JSON.stringify(data);
    const url = 'https://us7.api.mailchimp.com/3.0/lists/67880e1947';
    const options = {
        method: "POST",
        auth: "tabassum_k:e05e6d645c19317a1048d2cc3f74aa9c-us7"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on('data', function(data){
            console.log(JSON.parse(data));
        });

        response.on("error", function(e){
            console.log(e);
        });

    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    console.log("Reached to failure route");
    res.redirect("/");
});

app.listen (port, function(){
    console.log(`Server is running on port ${port}`);
});


//API KEY: e05e6d645c19317a1048d2cc3f74aa9c-us7

//list id: 67880e1947