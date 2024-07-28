import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { auth } from './firebase';

const db = getFirestore();

export async function saveUserPreferences(uid, gradientColors, waveColors, menuColors, dataColumnColors) {
  try {
    await setDoc(doc(db, "users", uid), {
      gradientColors,
      waveColors,
      menuColors,
      dataColumnColors
    }, { merge: true });
    console.log("User preferences saved successfully");
  } catch (error) {
    console.error("Error saving user preferences: ", error);
  }
}

export async function getUserPreferences(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("User preferences:", docSnap.data());
    return docSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
}

export async function resetUserPreferences(uid) {
  try {
    await setDoc(doc(db, "users", uid), {
      gradientColors: { start: '#003057', end: '#001F3D' },
      waveColors: {
        wave1: 'rgba(18, 119, 176, 0.45)',
        wave2: 'rgba(10, 90, 150, 0.45)',
        wave3: 'rgba(5, 60, 120, 0.45)',
        wave1Alpha: '0.45',
        wave2Alpha: '0.45',
        wave3Alpha: '0.45'
      },
      menuColors: {
        backgroundColor: '#286090',
        textColor: '#FFFFFF',
        buttonColor: '#286090'
      },
      dataColumnColors: {
        textColor: '#000000'
      }
    }, { merge: true });
    console.log("User preferences reset to default successfully");
  } catch (error) {
    console.error("Error resetting user preferences: ", error);
  }
}
