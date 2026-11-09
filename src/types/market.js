import z from "zod"


export const createMarketSchema = z.object({

  title: z.string().min(1),
  initialWager: z.number().int().positive(),
  side: z.enum(["yes", "no"]),
expiry: z.coerce.date()

})


export const placeBetSchema = z.object({

  marketId: z.string(),
  amount:z.number().int().positive(),



})
