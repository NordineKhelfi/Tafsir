const resultDisplay = document.querySelector('#result');
const surahTitle = document.querySelector('h2');
const loading = document.querySelector('#loading');
const audio = document.querySelector('audio');

export function displayVersesBySurahId(id, searchTerms = '') {
  resetUI();
  Promise.all([
    fetch(`https://quranenc.com/api/v1/translation/sura/french_mokhtasar/${id}`).then(res => res.json()),
    fetch(`https://api.alquran.cloud/v1/surah/${id}`).then(res => res.json()),
    fetch(`https://api.alquran.cloud/v1/surah/${id}/fr.hamidullah`).then(res => res.json())
  ]).then(([tafsirRes, arabicRes, frenchRes]) => {
    loading.style.display = 'none';
    
    let arabicVerses = arabicRes.data.ayahs.map(ayah => ayah.text.replace('۞', ''));
    let verseNumbers = arabicRes.data.ayahs.map(ayah => ayah.number);
    let frenchVerses = frenchRes.data.ayahs.map(ayah => ayah.text);

    let verses = tafsirRes.result.map(x => x.translation).map((verse, index) => `
      <div class="line" data-url="https://cdn.islamic.network/quran/audio/128/ar.hudhaify/${verseNumbers[index]}.mp3">
        <span class="verse-ar">۞ ${arabicVerses[index]}</span>
        <span class="verse-fr">${index + 1} - ${frenchVerses[index]}</span>
        <p class="tafsir">${verse}</p>
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

  if ('mediaSession' in navigator) {
    let surahIndex = document.querySelector('select').value;
    let surahName = document.querySelector(`option[value="${surahIndex}"]`).innerText;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `Surah ${surahName}`,
      artist: `Ali Al Houdhaify`
    });
  }
}
