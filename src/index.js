import "dotenv/congfig";
import express from "express"
import mongoose from "mongoose"


const app = express()




app.use(express.json())

async function main() {

  await mongoose.connect(process.env.DATABASE_URL);


  console.log("mongodb connected")

  app.listen(proccess.env.PORT || 3000, () => {

    console.log("server is running on port 3000");


  })

main().catch(console.error)



}
