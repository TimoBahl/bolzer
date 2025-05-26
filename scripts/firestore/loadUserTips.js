import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export async function loadUserTips(spielIds) {
  const usersSnapshot = await db.collection("users").get();

  const allUserTips = {};

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const tippsRef = db.collection("users").doc(userId).collection("tipps");

    // Alle Tipps des Users für die 8 Spiel-IDs laden
    const tippsSnapshot = await tippsRef
      .where(admin.firestore.FieldPath.documentId(), "in", spielIds)
      .get();

    const userTipps = {};
    tippsSnapshot.docs.forEach((doc) => {
      userTipps[doc.id] = doc.data();
    });

    allUserTips[userId] = userTipps;
  }

  return allUserTips;
}
