const express = require("express");

const app = express();

const request = require("request");

const BodyParser = require("body-parser");
const https = require("https");

app.use(express.static("static"));

app.use(BodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {

    res.sendFile(__dirname + "/signup.html");
});


app.listen(3000, function () {
    console.log("server is running on port 3000");
});


app.post("/", function (req, res) {

    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const email = req.body.eMail;

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
    }
    const JsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/e11133281a";
    const options = {
        method: "POST",
        auth: "shaanakhtarkhan:ea68baa675b9ea882cec0044cd9c437e-us9"
    }

   const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
        res.sendFile(__dirname +"/success.html");
        
    }else{
        res.sendFile(__dirname+ "/failure.html");
    }

        response.on("data", function (data) {
            console.log(JSON.parse(data));

        });

    });


    app.post("/failure",function(req,res){
        res.redirect("/");
    });

    //sends us to the signup page by triggereing a post request in the form which will be caught by this app.post and redirect us 
    //to root page which (as specified in app.get) takes us to the signup form again 

    request.write(JsonData);
    request.end();


});

// api key
//  ea68baa675b9ea882cec0044cd9c437e-us9 
// list id
//  e11133281a