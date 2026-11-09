import jwt from "jsonwebtoken"


export function auth(req, res, next) {

  const token = req.headers.authorization?.split("")[1]

  if (!token) {

    return res.status(404).json({
      error: "token required"
    });
  }


  try {


    const decoded = jwt.verify(


      token,
      process.env.jwt_SECRET
    );

    req.userId = decoded.userId

    next()
  } catch {


    return res.status(401).json({

      error:"Invalid token"
    })



  }



}
