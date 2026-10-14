// ============================================================
//  utils.js  —  shared helper functions
// ============================================================

// ---------- PIN hashing (PBKDF2-HMAC-SHA-256 via SubtleCrypto) ----------
// We derive 32 bytes using the Patient ID as the salt so two patients
// with the same PIN produce different hashes.

export async function hashPin(pin, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(pin), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 200_000, hash: "SHA-256" },
    keyMaterial, 256
  );
  return Array.from(new Uint8Array(bits))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------- Unique 5-char alphanumeric Patient ID ----------
const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // omit I O 0 1 for readability

export function generatePatientId() {
  let id = "";
  const arr = new Uint8Array(5);
  crypto.getRandomValues(arr);
  for (const byte of arr) id += CHARSET[byte % CHARSET.length];
  return id;
}

// ---------- Toast notifications ----------
export function showToast(message, type = "info") {
  const container = document.getElementById("toast-container") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

function createToastContainer() {
  const c = document.createElement("div");
  c.id = "toast-container";
  document.body.appendChild(c);
  return c;
}

// ---------- Clipboard copy ----------
export async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const orig = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = orig), 2000);
  } catch {
    showToast("Copy failed – please copy manually.", "error");
  }
}

// ---------- OTP generator (6 digits) ----------
export function generateOTP() {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(arr[0] % 1_000_000).padStart(6, "0");
}

// ---------- QR Code (uses qrcode.js loaded globally) ----------
export function renderQR(containerId, text) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = "";
  new QRCode(el, { text, width: 160, height: 160, correctLevel: QRCode.CorrectLevel.M });
}

// ---------- Brute-force lock helpers (Firestore) ----------
export const MAX_ATTEMPTS  = 5;
export const LOCK_DURATION = 15 * 60 * 1000; // 15 min in ms

// ---------- Format date ----------
export function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit" });
}

// ---------- Spinner ----------
export function setLoading(btn, loading) {
  if (loading) {
    btn.dataset.origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Please wait…";
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.origText || btn.textContent;
  }
}
