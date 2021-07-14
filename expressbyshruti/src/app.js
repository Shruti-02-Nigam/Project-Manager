const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//const bodyParser = require("body-parser");
//const multer = require("multer");
var fs = require('fs');


const Upload = require('./models/uploads');

// require("./db/conn2");
require("./db/conn");
const Register = require("./models/registers");
const { json } = require("express");

const port = process.env.PORT || 3000;


const static_path = path.join(__dirname,"../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));


const JWT_SECRET = "some super secret";

app.use(express.static(static_path));


app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

// getting all the hbs files
app.get("/",(req,res) =>{
    res.render("index");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.get("/forgotpass",(req,res) =>{
    res.render("forgotpass");
});

app.get("/fileupload",(req,res)=>{
    res.render("fileupload");
});

app.get("/datafiles",(req,res)=>{
    res.render("datafiles");
});

app.get("/resetpass/:id/:token/:useremail",(req,res)=>{
    const {id,token,useremail} = req.params;
   res.send(req.params);
   
    
    if(id !== useremail.id){
        res.send("invalid email id");
        return;
    
    }

    //we have a valid id and we have a valid user with this id
    const secret = JWT_SECRET + useremail.password;
    try{
        const payload = jwt.verify(token,secret);
        res.render("resetpass",{emailaddress:useremail})
    }
    catch(error){
        console.log(error.message);
        res.send(error.message);
    }

})

// create new user in database
app.post("/register" , async (req,res) =>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if(password === cpassword){
            const registerStudent = new Register({
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                emailaddress : req.body.emailaddress,
                password : password,
                confirmpassword : cpassword
            })
            const registered = await registerStudent.save();
            res.status(201).render("index");
        }
        else{
            res.send("password are not matching");
        }

    }
    catch(error){
        res.status(400).send(error);
    }

    })

    //login user
    app.post("/login", async (req,res)=>{
        try {
            const emailaddress = req.body.emailaddress;
            const password = req.body.password;

            const useremail = await Register.findOne({emailaddress:emailaddress});
            const isMatch = await bcrypt.compare(password,useremail.password);
            
            if(isMatch){
                res.status(201).render("index");
            }else{
                res.send("INVALID LOGIN DETAILS");
            }
        } catch (error) {
            res.status(400).send("INVALID EMAIL");
        }
    })
    

app.post("/forgotpass",async(req,res)=>{
    try{
    const emailaddress = req.body.emailaddress;
    const useremail = await Register.findOne({emailaddress});
    if(!useremail){
        res.send("USER NOT FOUND");
        return
    }
    //user exists and now create a one time reset link
    const secret = JWT_SECRET + useremail.password;
    const payload ={
        emailaddress: useremail,
        id: useremail.id
    };
    const token = jwt.sign(payload,secret,{expiresIn:'15m'})
    const link = `http://localhost:3000/resetpass/${useremail.id}/${token}/${emailaddress}`;
    console.log(link);
    res.send("PASSWORD RESET LINK HAS BEEN SENT");

 }
catch{
    res.status(400).send("INVALID EMAIL");
}
});

app.post("/resetpass/:id/:token/:emailaddress",async(req,res)=>{
    const {id,token} = req.params;
    
    const{password,password2} = req.body;
    
    if(id !== emailaddress.id){
        res.send("invalid email id");
        return;
    }

    //we have a valid id and we have a valid user with this id
    const secret = JWT_SECRET + emailaddress.password;
    try{
        const payload = jwt.verify(token,secret);
        emailaddress.password = password;
        res.send("password changed");
    }
    catch(error){
        console.log(error.message);
        res.send(error.message);
    }
});

//file upload feature
app.post("/fileupload",async(req,res)=>{
    
    try{
        // const path1 = req.files.myFile.path;
        const file =  req.body.myFile;
        
        var DocData = fs.readFileSync(__dirname + '\\'+ file);
        
		const doc1 = new Upload({
							type: 'pdf',
                            fname: file,
							data: DocData
					});	
		doc1.save()
        
		.then(docu => {
				console.log("Saved a document to MongoDB.");
				try{
                    // res.send("Successfully uploaded");
                    res.render("datafiles");
					console.log("Exit!");
					process.exit(0);
				}catch(e){
					console.log(e);
                    
				}
		})
        .catch(error =>{
            res.send("Invalid type");
        })
    }
    catch(error){
            res.send("INVALID TYPE");
        }
});




app.listen(port,()=>{
    console.log(`successfully receiving data from port ${port}`);
});