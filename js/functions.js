const resultDisplay = document.querySelector('#result');
const surahTitle = document.querySelector('h2');
const loading = document.querySelector('#loading');
const audio = document.querySelector('audio');

export function displayVersesBySurahId(id, searchTerms = '') {
  resetUI();
  Promise.all([
    fetch(`https://islamhouse.com/quran/french_mokhtasar/sura-${id}.html`).then(res => res.text()),
    fetch(`https://api.alquran.cloud/v1/surah/${id}`).then(res => res.json()),
    fetch(`https://api.alquran.cloud/v1/surah/${id}/fr.hamidullah`).then(res => res.json())
  ]).then(([tafsirText, arabicRes, frenchRes]) => {
    loading.style.display = 'none';
    
    let arabicVerses = arabicRes.data.ayahs.map(ayah => ayah.text.replace('۞', ''));
    let verseNumbers = arabicRes.data.ayahs.map(ayah => ayah.number);
    let frenchVerses = frenchRes.data.ayahs.map(ayah => ayah.text);

    let htmlContent = new DOMParser().parseFromString(tafsirText, 'text/html');

    let title = htmlContent.querySelector('h1');
    surahTitle.innerText = title.innerText.substring(0, title.innerText.length - 3);
    
    let verses = htmlContent.querySelectorAll('p');
    verses = Array.from(verses, x => x.innerText);

    verses = verses.map((verse, index) => `
      <div class="line" data-url="https://cdn.islamic.network/quran/audio/128/ar.hudhaify/${verseNumbers[index]}.mp3">
        <span class="verse-ar">۞ ${arabicVerses[index]}</span>
        <span class="verse-fr">${index + 1} - ${frenchVerses[index]}</span>
        <p class="tafsir">${verse.substring(index < 99 ? 4 : 5)}</p>
        <hr><br>
      </div>`);

      if (searchTerms) {
        verses = verses.filter(x => x.toLowerCase().includes(searchTerms.toLowerCase()));
      }

      resultDisplay.innerHTML = verses.length ? 
        verses.join('') :
        'Aucun résultat dans la Surah...';

      if (searchTerms && verses.length) {
        resultDisplay.innerHTML = resultDisplay.innerHTML.replaceAll(searchTerms, `<mark>${searchTerms}</mark>`);
      }

      let lines = [...resultDisplay.querySelectorAll('.line')];
      lines.forEach(line => line.onclick = lineClick);
  });
}

export function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
}

function resetUI() {
  loading.style.display = '';
  resultDisplay.innerText = '';
  surahTitle.innerText = '';
}

function lineClick(event) {
  if (!audio.paused) {
    audio.pause();
    return;
  }

  let audioUrl = event.currentTarget.dataset.url;
  audio.setAttribute('src', audioUrl);
  audio.play();
}
