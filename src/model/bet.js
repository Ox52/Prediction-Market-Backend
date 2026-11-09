import mongoose from "mongoose"

const betSchema = new mongoose.Schema({

  userId: {

    type: mongoose.Schema.types.ObjectId,
    ref: "User",
    required:true
  },

  marketID: {

    type: mongoose.Schema.types.ObjectId,
    ref: "Market",
    required:true



  },

  betAmout: {

    type: Number,
    required:true
  }




})

export const Bet = mongoose.model("Bet" , betSchema)
