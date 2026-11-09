import { Router } from "express"
import { signin, signup  , onramp , getProfile, getTransaction} from "../controller/auth";




const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/onramp",auth ,  onramp);
router.get("/profile", auth, getProfile)

router.get("/transaction", auth, getTransaction);


export default router;
