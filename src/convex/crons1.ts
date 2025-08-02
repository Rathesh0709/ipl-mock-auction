import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
const crons = cronJobs();
// Clean up old auction timers every hour
crons.interval(
"cleanup old timers",
{ hours: 1 },
internal.crons.cleanupOldTimers,
{}
);
export default crons;
export const cleanupOldTimers = async (ctx: any) => {
const oldTimers = await ctx.db
.query("auctionTimers")
.filter((q: any) => q.lt(q.field("startTime"), Date.now() - 24 * 60 * 60 * 1000)) // 24 hours old
.collect();
for (const timer of oldTimers) {
await ctx.db.delete(timer._id);
}
};