import { getFirestore, doc, getDoc, setDoc, updateDoc, deleteField } from "firebase/firestore";
import { auth } from './firebase';

const db = getFirestore();

export async function saveUserPreferences(uid, gradientColors, waveColors, menuColors, dataColumnColors, dataEntryColor) {
  try {
    await setDoc(doc(db, "users", uid), {
      gradientColors,
      waveColors,
      menuColors,
      dataColumnColors,
      dataEntryColor
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
        textColor: '#000000',
        backgroundColor: '#FFFFFF',
        alpha: '1'
      },
      dataEntryColor: '#FFFFFF'
    }, { merge: true });
    console.log("User preferences reset to default successfully");
  } catch (error) {
    console.error("Error resetting user preferences: ", error);
  }
}

export async function saveUserTheme(uid, themeName, gradientColors, waveColors, menuColors, dataColumnColors, dataEntryColor) {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    const themes = userDoc.exists() && userDoc.data().themes ? userDoc.data().themes : {};
    themes[themeName] = {
      gradientColors,
      waveColors,
      menuColors,
      dataColumnColors,
      dataEntryColor
    };
    await updateDoc(userRef, { themes });
    console.log("User theme saved successfully");
  } catch (error) {
    console.error("Error saving user theme: ", error);
  }
}

export async function getUserThemes(uid) {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists() && docSnap.data().themes) {
    console.log("User themes:", docSnap.data().themes);
    return Object.entries(docSnap.data().themes).map(([name, theme]) => ({ name, ...theme }));
  } else {
    console.log("No themes found!");
    return [];
  }
}

export async function deleteUserTheme(uid, themeName) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      [`themes.${themeName}`]: deleteField()
    });
    console.log("User theme deleted successfully");
  } catch (error) {
    console.error("Error deleting user theme: ", error);
  }
}
