import express from "express"
import {jwt,bcrypt,nodemailer} from "../index.js"
import { creatingUser, getingUserName, creatingAndStoreUserToken, resetPassword, logoutUserAndDeleteToken } from "../service/user.service.js";

const Router = express.Router()

var transporter = nodemailer.createTransport({
    service: 'gmail' ,
    auth: {
      user: 'zenclass1234@gmail.com',
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
 


async function genHashedPassword (password){
  const NO_OF_ROUNDS = 10
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS)
  const hashPassword = await bcrypt.hash(password,salt)

  return hashPassword
}

//creating user in database
async function createUser(userDetails){
    const user = await creatingUser(userDetails)
   // returning boolean value
    return user
   }
   


   //geting username from database
   async function getUserName(email){
       const users = await getingUserName(email)
       //returning a username
       return users
   }
   
   // geting user details 
   Router.post("/signup",async function (request,response){
      const {username,password,email} = request.body
   
    
      // getting username from database to check it already exit
      const userFromDB = await getUserName(email)
   
      //validating if username is already exit
      if(userFromDB){
       response.status(400).send("username alreay exists")
      }
      //validating is password is not lesser then 8 character
      else if(password.length < 8){
       response.status(400).send("password must be 8 characters")
      }
      
      else{
       // getting send and geting hash password
       const hashedPassword=await genHashedPassword(password)
       
       //creating a user by name and hash password
       const result = await createUser({
           username:username,
           password:hashedPassword,
           email:email
       })
       response.send(result)
      }
   })

   Router.post("/signin",async function (request,response){
    const {email,password}=request.body
    

    // getting username from database to check it already exit
    const userFromDB = await getUserName(email)

    if(! userFromDB){
        response.status(401).send("Invalid credentials")
    }
    else{
        const storedDBPassword = userFromDB.password

        const isPasswordMatch= await bcrypt.compare(password,storedDBPassword)

        if(isPasswordMatch){
            const token = jwt.sign({id:userFromDB._id},process.env.SECRET_KEY)

            const storeTokenInDB = await creatingAndStoreUserToken(userFromDB, token)
            response.send({message : "successful login",
        token:token})


        }
        else{
            response.status(401).send("Invalid credentials")
        }


    }
})

Router.post('/forgottenpassword',async function (request,response){
   
    
    const {email} = request.body
  
      var getUserFromDB = await getUserName(email)
  
  
    
    if(getUserFromDB ){
     
      var mailOptions = {
        from: 'Rest-password',
        to: email,
        subject: 'Change password',
        text: `http://localhost:3000/forgottenpassword/${getUserFromDB.email}`
      };
      
      transporter.sendMail(mailOptions);
     response.send({message:"done"})
      
    }else{
      response.status(401).send({message:"Username not exist"})
    }
  })



  async function changepassword (data){
         
    const changedPassword= await resetPassword(data);

    return changedPassword
   }

   Router.put('/changeforgottenpassword/:email',async function (request,response){

 
    const {password} = request.body
  const {email} = request.params
    
 
  
      var getManagerFromDB = await getUserName(email)
  
    
    if(getManagerFromDB ){
     
       
        const hashedPassword = await genHashedPassword(password)
    
   const  handleChange = changepassword({email:email,password:hashedPassword})
    
    response.send(handleChange)
     
      
    }
  })



  Router.delete('/logout/:email',async function(request,response){
    const {email} = request.params
    
    const token = await logoutUserAndDeleteToken(email);
        
          response.send("done")
    
        
        })

    export default Router

