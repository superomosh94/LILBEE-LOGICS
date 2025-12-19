import { auth, rtdb } from "./firebase.js";
import { ref, set, onDisconnect, serverTimestamp } from
"https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

export function trackPresence() {
  auth.onAuthStateChanged(user => {
    if (!user) return;

    const statusRef = ref(rtdb, `status/${user.uid}`);

    set(statusRef, {
      state: "online",
      lastSeen: serverTimestamp()
    });

    onDisconnect(statusRef).set({
      state: "offline",
      lastSeen: serverTimestamp()
    });
  });
}
