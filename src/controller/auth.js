import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


import { User } from "../model/user.js"
import { WalletEvent } from "../model/walletEvent.js";
import { onrampSchema, signupSchema, singinSchema } from "../types/auth.js";



// signUp
//


export async function signup(req, res) {


  try {

    const { username, password } = signupSchema.parse(req.body);


    const existingUser = await User.findOne({ username });


    if (existingUser) {

      return res.status(404).json({

        error:"username already exits"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const User = await User.create({

      username,
      password: hashedPassword,
      balance :0,

    })


    return res.status(201).json({

      id: user._id,
    })


  } catch (error) {

    return res.status(400).json({
      error:error.message,
    })


  }
}



export async function signin(req, res) {


  try {

    const { username, password } = singinSchema.parse(req.body)

    const user = await User.findOne({ username })

    if (!user) {

      return res.status(401).json({

        error:"Invalid creadetials "
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {

      return res.status(401).json({
        error:"Invalid credtials"
      })
    }

    const token = jwt.sign({

      userId: user._id.toString(),

    },



      process.env.JWT_SECRET);

    return res.json({token})


  } catch (error) {
    return res.status(400).json({
         error: error.message,
       });


  }
}


// add fake balance
//

export async function onramp(req, res) {

  try {

    const { amount } = onrampSchema.parse(req.body)

    const user = await User.findByAndUpdate( req.userId ,

      { $inc: { balance: amount } },
      { new: true })
    ;


    if (!user) {

      return res.status(401).json({

        error:"user not found",
      })
    }


    await WalletEvent.create({

      userId: req.userId,
      tx_type: "onramp",
      amount,
    })

    return res.json({
      balance: user.balance
    })

  } catch (error) {

    return res.status(400).json({
         error: error.message,
       });




  }
}

//Profile
//

export async function getProfile(req, res) {


  try {

    const user = await User.FindOne( req.userId ).select("-password")

    if (!user) {

      return res.status(404).json({
        error: "User not found"
      })
}



  } catch (error) {


    return res.status(400).json({

      error:error.message,
    })


  }
}

// wallet history


export async function getTransaction(req, res) {


  try {

    const transaction = await walletEvent.find({

      userId: req.userId,
    });

    return res.json(transaction);


  } catch (error) {


    return res.status(400).json({

      error:error.message,
    })
}


}
