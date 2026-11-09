import "dotenv/congfig";
import express from "express"
import mongoose from "mongoose"

import authRouter from "./routes/auth.js"
import marketRouter from "./routes/market.js"
import resolveRouter from "./routes/resolve.js"




const app = express()




app.use(express.json())

//Routes
//


app.use("/api/v1/auth ", authRouter)
app.use("/api/v1/market", marketRouter)
app.user("/api/v1/resolve" , resolveRouter)

async function main() {

  await mongoose.connect(process.env.DATABASE_URL);


  console.log("mongodb connected")

  app.listen(proccess.env.PORT || 3000, () => {

    console.log("server is running on port 3000");


  })

main().catch(console.error)



}
