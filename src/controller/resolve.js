import { Bet } from "../model/bet.js";
import { Market } from "../model/market.js";
import { User } from "../model/user.js";
import { WalletEvent } from "../model/walletEvent.js";
import { resolveMarketSchema } from "../types/resolve.js";

export async function resolveMarket(req, res) {
  try {
    const { marketId, resolution } = resolveMarketSchema.parse(req.body);

    const market = await Market.findById(marketId);

    if (!market) {
      return res.status(404).json({
        error: "Market not found",
      });
    }

    // only creator can resolve
    if (market.creatorId.toString() !== req.userId) {
      return res.status(403).json({
        error: "Only creator can resolve",
      });
    }

    if (market.resolution !== null) {
      return res.status(400).json({
        error: "Market already resolved",
      });
    }

    const bets = await Bet.find({ marketId });

    const totalBets = bets.reduce(
      (sum, bet) => sum + bet.betAmount,
      0
    );

    if (market.side === resolution) {
      // creator wins: gets their stake back plus all bettor stakes
      const payout = market.initialWager + totalBets;

      await User.updateOne(
        { _id: market.creatorId },
        { $inc: { balance: payout } }
      );

      await WalletEvent.create({
        userId: market.creatorId,
        tx_type: "payout",
        externalId: { marketId },
        amount: payout,
      });
    } else {
      // bettors against the creator win: stake back plus equal amount
      for (const bet of bets) {
        const payout = bet.betAmount * 2;

        await User.updateOne(
          { _id: bet.userId },
          { $inc: { balance: payout } }
        );

        await WalletEvent.create({
          userId: bet.userId,
          tx_type: "payout",
          externalId: {
            marketId,
            betId: bet._id,
          },
          amount: payout,
        });
      }

      // refund unmatched creator stake
      const refund = market.initialWager - totalBets;

      if (refund > 0) {
        await User.updateOne(
          { _id: market.creatorId },
          { $inc: { balance: refund } }
        );

        await WalletEvent.create({
          userId: market.creatorId,
          tx_type: "refund",
          externalId: { marketId },
          amount: refund,
        });
      }
    }

    market.resolution = resolution;
    await market.save();

    return res.json({
      message: "market resolved successfully",
      resolution,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
}
