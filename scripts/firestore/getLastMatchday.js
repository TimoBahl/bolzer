import { db, admin } from "./firebaseAdmin.js";

export async function getLastMatchday() {
  const now = admin.firestore.Timestamp.now();

  // 1. Letzten Spieltag finden, dessen letzterZeitpunkt <= jetzt ist
  const snapshot = await db
    .collection("spieltage")
    .where("letzterZeitpunkt", "<=", now)
    .orderBy("letzterZeitpunkt", "desc")
    .limit(1)
    .get();

  if (snapshot.empty) {
    console.log("❌ Kein vergangener Spieltag gefunden.");
    return null;
  }

  const spieltagDoc = snapshot.docs[0];
  const spieltagId = spieltagDoc.id;

  // 2. Alle Spiele dieses Spieltags laden
  const spieleSnapshot = await db
    .collection("spieltage")
    .doc(spieltagId)
    .collection("spiele")
    .orderBy("datum") // falls du nach Spielzeit sortieren willst
    .get();

  const spiele = spieleSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return {
    spieltagId,
    spiele,
  };
}
