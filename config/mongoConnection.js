const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://CS554FinalNull:123456AB@cluster0.6cydr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
let client = undefined
let db = undefined



async function main(){
  
  try{
    await client.connect()
    console.log('Database Connected successfully')
  }catch(e){
    console.log(`Error : ${e}`)
  }finally{
    await client.close()
  }

}
module.exports = {
    connectToDb: async () => {
        if( ! client ){
            try{
                client = await MongoClient.connect(uri)
                db = await client.db('554DataBase')
            }catch(e){
                console.log(`Error : ${e}`)
            }
            
        }
        return db
    },
    closeConnection: () => {
        client.close()
    }
}