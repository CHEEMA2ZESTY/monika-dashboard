// src/lib/dashboardQueries.ts
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import db from "./firebase";

export async function fetchDashboardStats() {
  const guildsSnap = await getDocs(collection(db, "guilds"));
  const usersSnap = await getDocs(collection(db, "users"));

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const creditQuery = query(
    collection(db, "transactions"),
    where("type", "==", "credit"),
    where("timestamp", ">=", Timestamp.fromDate(startOfMonth))
  );
  const creditSnap = await getDocs(creditQuery);
  const creditsSpent = creditSnap.docs.reduce(
    (sum, doc) => sum + (doc.data().amount || 0),
    0
  );

  return {
    totalGuilds: guildsSnap.size,
    activeUsers: usersSnap.size,
    creditsSpent,
  };
}
