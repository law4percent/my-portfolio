// Import Firebase modules (only works if <script type="module" src="script.js"> is used)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAAn9Fxae0I0qBjQjZ-Ps1YjPyzcL4HnAk",
  authDomain: "lawrence-roble.firebaseapp.com",
  databaseURL: "https://lawrence-roble-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lawrence-roble",
  storageBucket: "lawrence-roble.appspot.com",
  messagingSenderId: "185383854198",
  appId: "1:185383854198:web:d1dac4cdef414654aabf57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const viewsRef = ref(database, 'views');

// Menu toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('nav');

menuIcon.onclick = () => {
  menuIcon.classList.toggle('fa-xmark');
  navbar.classList.toggle('active');
};

// Smooth scrolling
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
    this.classList.add('active');

    menuIcon.classList.remove('fa-xmark');
    navbar.classList.remove('active');
  });
});

// Scroll nav highlighting
window.addEventListener('scroll', () => {
  let sections = document.querySelectorAll('section');
  let navLinks = document.querySelectorAll('nav a');

  sections.forEach((sec, idx) => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 100;
    let height = sec.offsetHeight;

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => link.classList.remove('active'));
      navLinks[idx].classList.add('active');
    }
  });
});

// Helper functions
function isSameWeek(d1, d2) {
  const oneJan = new Date(d1.getFullYear(), 0, 1);
  const getWeekNumber = (d) => Math.ceil((((d - oneJan + 86400000) / 86400000)) / 7);
  return d1.getFullYear() === d2.getFullYear() && getWeekNumber(d1) === getWeekNumber(d2);
}

function isSameMonth(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

// View counter logic
function updateViews() {
  const now = new Date();
  runTransaction(viewsRef, (current) => {
    if (current === null) {
      return {
        weekly: 1,
        monthly: 1,
        total: 1,
        lastView: now.toISOString()
      };
    }

    const lastViewDate = current.lastView ? new Date(current.lastView) : null;

    if (!lastViewDate || !isSameWeek(now, lastViewDate)) {
      current.weekly = 1;
    } else {
      current.weekly = (current.weekly || 0) + 1;
    }

    if (!lastViewDate || !isSameMonth(now, lastViewDate)) {
      current.monthly = 1;
    } else {
      current.monthly = (current.monthly || 0) + 1;
    }

    current.total = (current.total || 0) + 1;
    current.lastView = now.toISOString();
    return current;
  });
}

// Display view counts
onValue(viewsRef, (snapshot) => {
  const data = snapshot.val();
  if (data) {
    document.getElementById('weeklyViews').textContent = data.weekly ?? "0";
    document.getElementById('monthlyViews').textContent = data.monthly ?? "0";
    document.getElementById('totalViews').textContent = data.total ?? "0";
  }
});

// Call update on load
updateViews();
