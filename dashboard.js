
// -------------------- IMPORT FIREBASE --------------------
import { auth, db, rtdb } from "./firebase.js";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
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
    // Create default user doc if missing
    await setDoc(userRef, {
      email: user.email,
      name: "",
      avatar: "",
      role: "user",
      isNew: true,
      joinedAt: serverTimestamp()
    });
  }

  const profile = snap.exists() ? snap.data() : {};
  document.getElementById("userEmail").innerText = user.email;
  document.getElementById("updateName").value = profile.name || "";
  document.getElementById("updateEmail").value = profile.email || user.email;
  document.getElementById("updateAvatar").value = profile.avatar || "";
  if (profile.avatar) document.getElementById("userAvatar").style.backgroundImage = `url(${profile.avatar})`;

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

  document.getElementById("userEmail").innerText = document.getElementById("updateEmail").value;
  const avatar = document.getElementById("updateAvatar").value;
  if (avatar) document.getElementById("userAvatar").style.backgroundImage = `url(${avatar})`;

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
document.getElementById("postBtn").addEventListener("click", async () => {
  const content = document.getElementById("postContent").value.trim();
  if (!content) return;

  await addDoc(collection(db, "posts"), {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    content,
    timestamp: serverTimestamp()
  });

  document.getElementById("postContent").value = "";
  loadFeedPosts();
});

async function loadFeedPosts() {
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const snap = await getDocs(q);

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = "feed-post glass-card";
    div.innerHTML = `<strong>${data.email}</strong><p>${data.content}</p>`;
    postsDiv.appendChild(div);
  });
}
loadFeedPosts();

// -------------------- SERVICE REQUESTS --------------------
document.getElementById("requestServiceBtn").addEventListener("click", async () => {
  const type = document.getElementById("serviceType").value.trim();
  const desc = document.getElementById("serviceDesc").value.trim();
  if (!type || !desc) return;

  await addDoc(collection(db, "serviceRequests"), {
    uid: auth.currentUser.uid,
    type,
    desc,
    status: "pending",
    timestamp: serverTimestamp()
  });

  document.getElementById("serviceType").value = "";
  document.getElementById("serviceDesc").value = "";
  loadUserServiceRequests();
});

async function loadUserServiceRequests() {
  const listDiv = document.getElementById("serviceList");
  listDiv.innerHTML = "";

  const snap = await getDocs(collection(db, "serviceRequests"));
  snap.forEach(docSnap => {
    const data = docSnap.data();
    if (data.uid === auth.currentUser.uid) {
      const div = document.createElement("div");
      div.className = "glass-card";
      div.innerHTML = `<strong>${data.type}</strong><p>${data.desc}</p><small>Status: ${data.status}</small>`;
      listDiv.appendChild(div);
    }
  });
}
loadUserServiceRequests();

// -------------------- CHAT --------------------
const chatBox = document.getElementById("chatBox");

document.getElementById("sendMessageBtn").addEventListener("click", async () => {
  const msg = document.getElementById("chatMessage").value.trim();
  if (!msg) return;

  await addDoc(collection(db, "chat"), {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    msg,
    timestamp: serverTimestamp()
  });

  document.getElementById("chatMessage").value = "";
  loadChatMessages();
});

async function loadChatMessages() {
  chatBox.innerHTML = "";
  const q = query(collection(db, "chat"), orderBy("timestamp", "asc"));
  const snap = await getDocs(q);

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const div = document.createElement("div");
    div.className = data.uid === auth.currentUser.uid ? "chat-message self" : "chat-message";
    div.innerHTML = `<strong>${data.email}:</strong> ${data.msg}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}
loadChatMessages();
