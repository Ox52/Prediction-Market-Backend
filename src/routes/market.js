import { Router } from "express";
import { auth } from "../middleware/auth";
import { createMarket, getBets, getMarkets } from "../controller/market";


const router = Router()

router.post("/", auth, createMarket);
router.get("/", getMarkets)

router.post("/", auth, placeBet);
router.get("/", auth, getBets);

export default router;
