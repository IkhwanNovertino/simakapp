// import cron from "node-cron";
// import { deactivateExpiredPresences } from "./action";

// export function startPresenceScheduler() {
//   console.log("📆 Scheduler dimulai...");

//   // Setiap 1 menit
//   cron.schedule("* * * * *", async () => {
//     console.log("🚀 Menjalankan cron...");
//     await deactivateExpiredPresences();
//   });
// }