import { PLAYER_DATA } from "./playerData";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
export const insertAllPlayerData = internalMutation({
args: {},
returns: v.null(),
handler: async (ctx) => {
// Check if players already exist
const existingPlayers = await ctx.db.query("players").first();
if (existingPlayers) {
console.log("Players already exist, skipping insertion");
return null;
}
// Insert all player data
for (const playerData of PLAYER_DATA) {
await ctx.db.insert("players", {
srNo: playerData.srNo,
setNo: playerData.setNo,
set2025: playerData.set2025,
firstName: playerData.firstName,
surname: playerData.surname,
country: playerData.country,
state: playerData.state,
dob: playerData.dob,
age: playerData.age,
specialism: playerData.specialism,
hand: playerData.hand,
specialiceat: playerData.specialiceat,
testCaps: playerData.testCaps,
odiCaps: playerData.odiCaps,
t20Caps: playerData.t20Caps,
ipl: playerData.ipl,
previousIPLTeams: playerData.previousIPLTeams,
team2024: playerData.team2024,
ipl2024: playerData.ipl2024,
category: playerData.category,
reservePriceRsLakh: playerData.reservePriceRsLakh,
uploadedBy: playerData.uploadedBy,
});
}
console.log(`Inserted ${PLAYER_DATA.length} players`);
return null;
},
});