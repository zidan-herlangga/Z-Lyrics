document.addEventListener("DOMContentLoaded", function () {
  const lyricsElement = document.getElementById("lyrics");
  const audioElement = document.getElementById("audio");
  const rewindButton = document.getElementById("rewindButton");
  const nextButton = document.getElementById("nextButton");

  let currentIndex = 0;
  let lyricsWithTiming = [];

  function changeLyric() {
    lyricsElement.textContent = lyricsWithTiming[currentIndex].lyric;
    currentIndex = (currentIndex + 1) % lyricsWithTiming.length;
  }

  function handleTimeUpdate() {
    const currentTime = Math.floor(audioElement.currentTime);
    const nextLyricTime = lyricsWithTiming[currentIndex].time;

    if (currentTime === nextLyricTime) {
      changeLyric();
    } else if (audioElement.currentTime < lyricsWithTiming[currentIndex].time) {
      currentIndex = 0;
      while (
        lyricsWithTiming[currentIndex + 1].time <= audioElement.currentTime
      ) {
        currentIndex++;
      }
      changeLyric();
    }
  }

  function rewindToTime(rewindTime) {
    audioElement.currentTime = rewindTime;
    currentIndex = 0;
    while (lyricsWithTiming[currentIndex].time <= audioElement.currentTime) {
      currentIndex++;
    }
    changeLyric();
  }

  function goToNextLyric() {
    // Percepat lagu selama 5 detik
    audioElement.currentTime += 5;

    // Ganti lirik setelah 5 detik
    let nextLyricTime = audioElement.currentTime + 5;

    // Temukan indeks lirik berikutnya yang sesuai dengan waktu berikutnya
    while (
      currentIndex < lyricsWithTiming.length - 1 &&
      lyricsWithTiming[currentIndex + 1].time <= nextLyricTime
    ) {
      currentIndex++;
    }

    // Ganti lirik sesuai dengan indeks yang ditemukan
    changeLyric();
  }

  // Mengambil data lirik dari file JSON
  fetch("assets/lyrics.json")
    .then((response) => response.json())
    .then((data) => {
      lyricsWithTiming = data;
      initializeAudioControls();
    })
    .catch((error) => console.error("Error fetching lyrics:", error));

  function initializeAudioControls() {
    audioElement.addEventListener("timeupdate", handleTimeUpdate);

    audioElement.addEventListener("ended", function () {
      currentIndex = 0;
      lyricsElement.textContent = "";
    });

    rewindButton.addEventListener("click", function () {
      rewindToTime(audioElement.currentTime - 5); // Rewind 5 detik dari posisi saat ini
    });

    nextButton.addEventListener("click", function () {
      nextLyricTime(audioElement.currentTime + 5);
    });
  }
});
