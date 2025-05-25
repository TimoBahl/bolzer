import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const collections = await db.listCollections();
console.log("📁 Root-Collections:");
collections.forEach((col) => console.log("—", col.id));

async function getLastMatchdayWithMatches() {
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

async function loadUserTipsForLastMatchday(spielIds) {
  const usersSnapshot = await db.collection("users").get();
  console.log(`Gefundene User: ${usersSnapshot.size}`);

  usersSnapshot.forEach((doc) => {
  console.log("🔍 User-ID:", doc.id);
  console.log("📄 Daten:", doc.data());
});

  const allUserTips = {};

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const tippsRef = db.collection("users").doc(userId).collection("tipps");

    // Alle Tipps des Users für die 8 Spiel-IDs laden
    const tippsSnapshot = await tippsRef.where(
      admin.firestore.FieldPath.documentId(),
      "in",
      spielIds
    ).get();

    if (!tippsSnapshot.empty) {
      const userTipps = {};
      tippsSnapshot.docs.forEach((doc) => {
        userTipps[doc.id] = doc.data();
      });
      allUserTips[userId] = userTipps;
    } else {
      console.log(`Keine Tipps für User ${userId}`);
    }
  }

  return allUserTips;
}

(async () => {
  const lastMatchday = await getLastMatchdayWithMatches();
  if (!lastMatchday) {
    console.log("Kein letzter Spieltag gefunden.");
    return;
  }

  const spielIds = lastMatchday.spiele.map(s => s.id.toString());

  console.log(`Lade Tipps für Spieltag ${lastMatchday.spieltagId} mit ${spielIds.length} Spielen`);

  const userTips = await loadUserTipsForLastMatchday(spielIds);

  console.log(`Geladene Tipps von ${Object.keys(userTips).length} Usern:`);
  console.dir(userTips, { depth: 3 });
})();

// getLastMatchdayWithMatches();