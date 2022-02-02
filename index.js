const express = require("express")
const bodyparser = require('body-parser')
const port = 3000
const app = express()
const jwt = require('jsonwebtoken')
app.use(bodyparser.json({entended : true}))
const fs = require('fs')
const bcrypt = require("bcrypt")
let aa;
let salt = 5;
let hash_pass;
let secretkey = "CFEWFWEWEhtfddh984734fdgfdg"
let my_id;

////////////////////////////////////////////////////////////////////////////////////////////
app.get("/",(req,res)=>{
    console.log("Welcome to get page")
    console.log(req.headers.token)
    res.status(200).json({
        success:true,
        message:"Welcome to GET home page"
    })
})
app.post("/",(req,res)=>{
    console.log("Welcome to post page")
    res.status(200).json({
        success:true,
        message:"Welcome to POST home page"
    })
})

//////////////////////////////////////////////////////////////////////////////////////////////


app.post("/register", (req,res) =>{
    fs.readFile("data.json", "utf8", (err, data) =>{
    if(err){
        res.status(400).json({
            success:false,
            message:"Couldn't find information, please contact admin"
        })
    
    }
    else{      let hash_data_obt = bcrypt.hashSync(req.body.Password, salt);
                req.body.Password = hash_data_obt
                
                let final_data = JSON.stringify([req.body]);
                console.log(final_data);

                fs.writeFile("data.json", final_data, (err)=>{
                    if(err){
                        res.status(400).json({
                        success:false,
                        message:"Couldn't find information, please contact admin"
        })
                    }
                    else{
                        return res.send({Message:"User Registered Successfully"});
                    }
                })
            
            const data_db = JSON.parse(data); 
            
               let hash_data_obt1 = bcrypt.hashSync(req.body.Password, salt);
                req.body.Password = hash_data_obt1
                data_db[data_db.length] = req.body;
                const d1 = JSON.stringify(data_db);
                fs.writeFile("data.json", d1, (err)=>{

                    if(err){
                        res.status(400).json({
                        success:false,
                        message:"Couldn't find information, please contact admin"
                    })
                    }
                    else{
                        
                            res.status(200).json({
                            success:true,
                            message:"User registered successfully in data.json file/ db"
                        })
                    }
            })
    }
})
});

////////////////////////////////////////////////////////////////////////////////////////////////

app.post("/login" ,(req,res)=>{
    fs.readFile("data.json", "utf8", (error, data) =>{
        if(error){
            
            res.status(400).json({
                success:false,
                message:"Couldn't find information, please contact admin"
            })
        }
        else{
            const data_db = JSON.parse(data); 
            for(let i=0; i<data_db.length; i++){
                if (data_db[i].Email === req.body.Email && bcrypt.compareSync(req.body.Password, data_db[i].Password ) )
                {    
                    let token = jwt.sign( {Email:req.body.Email} , "vddsvEWFbcxbgjf43543", { expiresIn:"2h"})
                    return res.send({Status: " User Logged in Successfully in data.json / db", Token:token}); 
                }   
            }
            res.status(400).json({
                success:false,
                message:"Credentials not valid"
            }) 
        }     
} )
});

/////////////////////////////////////////////////////////////////////////////////////////////////////



app.get("/userlist" ,(req,res)=>{
    fs.readFile("data.json" , "utf8", (error, data) =>{
        if(error){
            
            res.status(400).json({
                success:false,
                message:"Couldn't find information, please contact admin"
            })
        }
        else{
            let token = req.headers.token.split(' ')[1]
            var decoded = jwt.verify(token, 'vddsvEWFbcxbgjf43543');

            const data_db = JSON.parse(data);
            const ind = data_db.findIndex((index) => index.Email == decoded.Email);
            data_db.splice(ind, 1);
            
            return res.send(data_db);       
        }
    })
})

app.use(express.json())

///////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/selfdata", (req,res)=>{
    fs.readFile("data.json", "utf8", (error, data) =>{
        if(error){
            
            res.status(400).json({
                success:false,
                message:"Couldn't find information, please contact admin"
            })
        }
        else{
            let token = req.headers.token.split(' ')[1]
            var decoded = jwt.verify(token, 'vddsvEWFbcxbgjf43543');
            
            const data_db = JSON.parse(data);
            const index_reqd_obt = data_db.findIndex((index) => index.Email == decoded.Email);
            let  self = data_db.splice(index_reqd_obt, 1);
            return res.send(self);       
        }
    })
})

/////////////////////////////////////////////////////////////////////////////////////////////////////

app.put("/updatedata", (req,res)=>{
    
    fs.readFile("data.json", "utf8", (error, data) =>{
        if(error){
            res.status(400).json({
                success:false,
                message:"Couldn't find information, please contact admin"
            })
        }
        else{
            let token = req.headers.token.split(' ')[1]
            var decoded = jwt.verify(token, 'vddsvEWFbcxbgjf43543')
            const data_db = JSON.parse(data)
            const index_reqd = data_db.findIndex((index )=> index.Email == decoded.Email)

            var dat = data_db.splice(index_reqd, 1);
            const key =  Object.keys(req.body)

            for(let i=0; i<key.length; i++){
                if (key[i] == "Name"){
                    dat[0].Name = req.body.Name;
                }
                else if (key[i] == "Mobile"){
                    dat[0].Mobile = req.body.Mobile;
                }
            }
            data_db[ind] = dat[0];
            let final_data = JSON.stringify(d);
            fs.writeFile("data.json", final_data, (err)=>{
                if(err){
                    res.status(400).json({
                    success:false,
                    message:"Couldn't find information, please contact admin"
        })
                }
                else{
                    res.status(200).json({
                        success:false,
                        message:"Our Information updated successfully"
                    })
                }
            })
        }
    })
})

/////////////////////////////////////////////////////////////////////////////////////////////////////

// It is used to update the password
app.put("/updatepassword", (req,res)=>{
    
    fs.readFile("data.json", "utf8", (error, data) =>{
        if(error){
            
            res.status(400).json({
                success:false,
                message:"Couldn't find information, please contact admin"
            })
        }
        else{
            let token = req.headers.token.split(' ')[1]
            var decoded = jwt.verify(token, 'vddsvEWFbcxbgjf43543');
            const data_db = JSON.parse(data);
            const ind = data_db.findIndex((index) => index.Email == decoded.Email);
            var dat = data_db.splice(ind, 1);
            

            if (bcrypt.compareSync(req.body.CurPass, dat[0].Password )  && req.body.NewPass == req.body.ConfirmPass) {
               let hash_data_obt = bcrypt.hashSync(req.body.NewPass, salt);
                dat[0].Password = hash_data_obt;
                data_db[ind] = dat[0];
                let final_data = JSON.stringify(data_db);
                fs.writeFile("data.json", final_data, (err)=>{
                    if(err){
                        res.status(400).json({
                        success:false,
                        message:"Couldn't find information, please contact admin"
        })
                    }
                    else{
                        res.status(200).json({
                            success:false,
                            message:"Our Password update is success"
                        })
                        }
                    }) 
                }
            else{
                res.status(400).json({
                    success:false,
                    message:"Couldn't find information, please contact admin"
        })   
                }
    }})});

////////////////////////////////////////////////////////////////////////////////////////////////////
app.listen(port,(req,res)=>{
    console.log("server started at poort 3000")
});
