import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {doc, getFirestore, updateDoc, getDoc} from "firebase/firestore";


const firebaseConfig = {
  apiKey: [process.env.REACT_APP_API_KEY],
  authDomain: "typegame-cc3e4.firebaseapp.com",
  projectId: "typegame-cc3e4",
  storageBucket: "typegame-cc3e4.appspot.com",
  messagingSenderId: "193379536636",
  appId: "1:193379536636:web:87dcb5c01543978213d179",
  measurementId: "G-98V8X4EFCX"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

async function updateData(name, score){
    const db = getFirestore(app);
    const docRef = doc(db, "highScore", "highScoresMap");
    const docSnap = await getDoc(docRef);
    const data = docSnap.data().scores;
    console.log(data);
    if(name in data){
        data[name] = Math.max(data[name], score);
        
    }
      
    else{
        data[name] = score;
    } 
    await updateDoc(docRef, {
        scores : data
    });
}

async function getScores(){
    const db = getFirestore(app);
    const docRef = doc(db, "highScore", "highScoresMap");
    const docSnap = await getDoc(docRef);
    const data = docSnap.data().scores;
    return data;
}

export {updateData, getScores} ;