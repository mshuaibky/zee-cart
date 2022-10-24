var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt =require('bcrypt')
var objectId=require('mongodb').ObjectID
module.exports={
    // addusers: (user, callback) => {//adding users
    //     // console.log(product);

    //     db.get().collection("users").insertOne(user).then((data) => {
    //         console.log(data);
    //         callback(data.insertedId)
    //     })
    // },
    addUser:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.password= await bcrypt.hash(userData.password,10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((userData)=>{
                resolve(userData)
            })
        })
    },
    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            
            let product = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(product)
        })
    },
doLogin:(userData=>{
    return new Promise(async(resolve,reject)=>{
        let loginStatus=false
        let response={}
   let user= await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
if(user){
bcrypt.compare(userData.password,user.password).then((status)=>{
if(status){
    console.log("login success");
}
else{
    console.log("login failed");
}
})
}else{
    console.log("login failed");
}


   
    })
}),
deleteUser:(proId)=>{
    return new Promise((resolve,reject)=>{
    db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(proId.id)}).then((response)=>{
        resolve(response)
    })
    })
},
getOneUsers:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(proId)}).then((users)=>{
            resolve(users)
        })
    })
},
updateuser:(proId,userdetails)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(proId)},
        {
            $set:{
               username:userdetails.username,
                email:userdetails.email
            }
        }).then((dataOutPut)=>{
            console.log(dataOutPut);
            resolve()
        })
    })
},
  


}