import { Router } from "express"
 import {auth} from "../middleware/auth.js"
import { resolveMarket } from "../controller/resolve.js";


const router = Router();

router.post("/", auth, resolveMarket)


export default router;
