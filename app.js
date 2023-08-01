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


app.listen(process.env.PORT || 3000, function () {
    console.log("server is running on port 3000");
});
// check if we have git heroku and npm installed  
// we have mae a procfile with no extesion as specified in heroku in the root directory and chanegd the local port 3000 to 
// process.env.PORT || 3000 so that both heroku and local servers be used.

// procfile contains(web: node app.js) i.e. the command used to start the file 

//now init git in the root directory
//alllows us to save all the version of our app or code by saving each insatance of change to our code( we have to tell it to do it)
// this constitutes version control

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
        auth: "shaanakhtarkhan:5ae34b8ffe12cf930ccabfad6de4d1a5-us9"
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
// 5ae34b8ffe12cf930ccabfad6de4d1a5-us9

