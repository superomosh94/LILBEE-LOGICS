// -------------------- IMPORT FIREBASE --------------------
import { auth, db, rtdb } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { ref, set, onDisconnect, onValue } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

// -------------------- TAB NAVIGATION --------------------
const tabs = document.querySelectorAll(".menu .tab");
const tabSections = document.querySelectorAll("main .tab");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    tabSections.forEach(sec => {
      sec.classList.remove("active");
      sec.hidden = true;
    });
    const section = document.getElementById(target);
    section.classList.add("active");
    section.hidden = false;
  });
});

// -------------------- AUTH & PROFILE --------------------
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      name: "",
      avatar: "",
      role: "user",
      isNew: true,
      joinedAt: serverTimestamp()
    });
  }

  // Real-time profile updates
  onSnapshot(userRef, snapshot => {
    const data = snapshot.data();
    document.getElementById("userEmail").innerText = data.email || user.email;
    document.getElementById("updateName").value = data.name || "";
    document.getElementById("updateEmail").value = data.email || user.email;
    document.getElementById("updateAvatar").value = data.avatar || "";
    if (data.avatar) document.getElementById("userAvatar").style.backgroundImage = `url(${data.avatar})`;
  });

  setupPresence(user.uid);
});

// -------------------- LOGOUT --------------------
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "login.html";
});

// -------------------- PROFILE UPDATE --------------------
document.getElementById("updateProfileBtn").addEventListener("click", async () => {
  const user = auth.currentUser;
  const userRef = doc(db, "users", user.uid);

  await updateDoc(userRef, {
    name: document.getElementById("updateName").value,
    email: document.getElementById("updateEmail").value,
    avatar: document.getElementById("updateAvatar").value
  });
  alert("Profile updated!");
});

// -------------------- ONLINE PRESENCE --------------------
function setupPresence(uid) {
  const statusRef = ref(rtdb, "status/" + uid);
  set(statusRef, { state: "online", lastChanged: Date.now() });
  onDisconnect(statusRef).set({ state: "offline", lastChanged: Date.now() });

  const statusSpan = document.getElementById("userStatus");
  onValue(ref(rtdb, "status"), snapshot => {
    const val = snapshot.val();
    if (!val) return;
    const onlineUsers = Object.values(val).filter(v => v.state === "online");
    statusSpan.innerText = onlineUsers.length ? "Online" : "Offline";
  });
}

// -------------------- COMMUNITY FEED --------------------
const postsRef = collection(db, "posts");
const feedQuery = query(postsRef, orderBy("timestamp", "desc"));

onSnapshot(feedQuery, snapshot => {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "feed-post glass-card";
    div.innerHTML = `<strong>${data.email}</strong><p>${data.content}</p>`;
    postsDiv.appendChild(div);
  });
});

document.getElementById("postBtn").addEventListener("click", async () => {
  const content = document.getElementById("postContent").value.trim();
  if (!content) return;

  await addDoc(postsRef, {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    content,
    timestamp: serverTimestamp()
  });

  document.getElementById("postContent").value = "";
});

// -------------------- SERVICE REQUESTS --------------------
const serviceRef = collection(db, "serviceRequests");
onSnapshot(serviceRef, snapshot => {
  const listDiv = document.getElementById("serviceList");
  listDiv.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    if (data.uid === auth.currentUser.uid) {
      const div = document.createElement("div");
      div.className = "glass-card";
      div.innerHTML = `<strong>${data.type}</strong><p>${data.desc}</p><small>Status: ${data.status}</small>`;
      listDiv.appendChild(div);
    }
  });
});

document.getElementById("requestServiceBtn").addEventListener("click", async () => {
  const type = document.getElementById("serviceType").value.trim();
  const desc = document.getElementById("serviceDesc").value.trim();
  if (!type || !desc) return;

  await addDoc(serviceRef, {
    uid: auth.currentUser.uid,
    type,
    desc,
    status: "pending",
    timestamp: serverTimestamp()
  });

  document.getElementById("serviceType").value = "";
  document.getElementById("serviceDesc").value = "";
});

// -------------------- CHAT --------------------
const chatRef = collection(db, "chat");
const chatQuery = query(chatRef, orderBy("timestamp", "asc"));
const chatBox = document.getElementById("chatBox");

onSnapshot(chatQuery, snapshot => {
  chatBox.innerHTML = "";
  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = data.uid === auth.currentUser.uid ? "chat-message self" : "chat-message";
    div.innerHTML = `<strong>${data.email}:</strong> ${data.msg}`;
    chatBox.appendChild(div);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
});

document.getElementById("sendMessageBtn").addEventListener("click", async () => {
  const msg = document.getElementById("chatMessage").value.trim();
  if (!msg) return;

  await addDoc(chatRef, {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    msg,
    timestamp: serverTimestamp()
  });

  document.getElementById("chatMessage").value = "";
});

