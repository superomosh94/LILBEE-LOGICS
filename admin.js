import { auth, db, rtdb } from "./firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import {
  ref,
  onValue
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

auth.onAuthStateChanged(async user => {
  if (!user) return;

  const userSnap = await getDocs(collection(db, "users"));
  let isAdmin = false;

  userSnap.forEach(docSnap => {
    if (docSnap.id === user.uid && docSnap.data().role === "admin") {
      isAdmin = true;
    }
  });

  if (isAdmin) {
    document.getElementById("adminTabBtn").hidden = false;
    loadAdminData();
  }
});

async function loadAdminData() {
  loadServiceRequests();
  loadUsers();
}

/* ---------------- SERVICE REQUESTS ---------------- */

async function loadServiceRequests() {
  const container = document.getElementById("adminServiceRequests");
  container.innerHTML = "";

  const snap = await getDocs(collection(db, "serviceRequests"));

  snap.forEach(docSnap => {
    const data = docSnap.data();
    if (data.status !== "pending") return;

    const div = document.createElement("div");
    div.className = "glass-card";
    div.innerHTML = `
      <strong>${data.serviceType}</strong>
      <p>${data.description}</p>
      <small>Status: ${data.status}</small><br>
      <button data-id="${docSnap.id}" class="approve">Approve</button>
      <button data-id="${docSnap.id}" class="reject danger">Reject</button>
    `;

    container.appendChild(div);
  });

  container.querySelectorAll(".approve").forEach(btn => {
    btn.onclick = () => updateService(btn.dataset.id, "approved");
  });

  container.querySelectorAll(".reject").forEach(btn => {
    btn.onclick = () => updateService(btn.dataset.id, "rejected");
  });
}

async function updateService(id, status) {
  await updateDoc(doc(db, "serviceRequests", id), {
    status,
    approvedBy: auth.currentUser.uid
  });
  loadServiceRequests();
}

/* ---------------- USERS + PRESENCE ---------------- */

function loadUsers() {
  const list = document.getElementById("userList");
  list.innerHTML = "";

  onValue(ref(rtdb, "status"), async snapshot => {
    list.innerHTML = "";

    const usersSnap = await getDocs(collection(db, "users"));

    usersSnap.forEach(userDoc => {
      const u = userDoc.data();
      const presence = snapshot.val()?.[userDoc.id];

      const div = document.createElement("div");
      div.className = "glass-card";

      div.innerHTML = `
        <strong>${u.email}</strong><br>
        <small>Role: ${u.role}</small><br>
        <small>Status: ${presence?.state || "offline"}</small><br>
        ${u.isNew ? "<span class='badge'>NEW</span>" : ""}
      `;

      list.appendChild(div);
    });
  });
}
