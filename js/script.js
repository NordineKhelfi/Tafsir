import { displayVersesBySurahId, toggleDarkMode } from "./functions.js";

const form = document.querySelector('form');
const select = document.querySelector('select');
const search = document.getElementById('search');
const darkModeIcon = document.getElementById('dark');
const scrollUpButton = document.getElementById('scroll-up');

darkModeIcon.onclick = toggleDarkMode;

form.onsubmit = event => {
  event.preventDefault();
  displayVersesBySurahId(select.value, search.value);
}

select.onchange = () => displayVersesBySurahId(select.value, search.value);

// Initialize with tafsir of Sûrat al Fâtiha
displayVersesBySurahId(1);

// Auto hide scrollup button
let previousScrollY = 0;
document.addEventListener('scroll', event => {
  if (window.scrollY > previousScrollY) {
    scrollUpButton.classList.add('show');
  }
  if (window.scrollY < previousScrollY) {
    scrollUpButton.classList.remove('show');
  }

  previousScrollY = window.scrollY;
})

setInterval(() => {
  if (previousScrollY === window.scrollY) {
    scrollUpButton.classList.remove('show');
  }
}, 3500);