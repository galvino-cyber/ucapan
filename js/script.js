// ========================== JAVASCRIPT ==========================

document.addEventListener("DOMContentLoaded", () => {

// ========================== JS: GLOBAL ==========================
let globalConfettiInterval = null;
let globalBalloonInterval = null;
const confettiColors=["#ff0a54","#ff477e","#ff85a1","#fbb1bd","#bde0fe"];
const balloonColors=["#ff4b5c","#ffb400","#3cd070","#4d96ff","#ff8fab"];

function createConfetti(){
    const container = document.getElementById('confetti-container');
    if(!container) return;
    for(let i=0;i<20;i++){
        const c=document.createElement("div");
        c.classList.add("confetti","global-decor");
        c.style.left=Math.random()*100+"vw";
        c.style.animationDuration=(2+Math.random()*3)+"s";
        const color = confettiColors[Math.floor(Math.random()*confettiColors.length)];
        c.style.setProperty("--color", color);
        c.style.background = color;
        container.appendChild(c);
        setTimeout(()=>{ if(c && c.parentNode) c.parentNode.removeChild(c); }, 5000);
    }
}

function createBalloons(){
    const container=document.getElementById('balloon-container');
    if(!container) return;
    for(let i=0;i<4;i++){
        const b=document.createElement('div');
        b.classList.add('balloon','global-decor');
        b.style.left=Math.random()*100+"vw";
        b.style.animationDuration=(6+Math.random()*4)+"s";
        const color = balloonColors[Math.floor(Math.random()*balloonColors.length)];
        b.style.setProperty('--color', color);
        b.style.background = color;
        container.appendChild(b);
        setTimeout(()=>{ if(b && b.parentNode) b.parentNode.removeChild(b); }, 10000);
    }
}

function startGlobalDecor(){
    if(!globalConfettiInterval){ createConfetti(); globalConfettiInterval=setInterval(createConfetti,2500); }
    if(!globalBalloonInterval){ createBalloons(); globalBalloonInterval=setInterval(createBalloons,3500); }
}
startGlobalDecor();

// ========================== JS: MUSIC & VOLUME ==========================
const bgMusic = document.getElementById("bgMusic");
const volumeSlider = document.getElementById("volumeSlider");

let savedVolume = localStorage.getItem("globalVolume");
let initialVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.5;
bgMusic.volume = initialVolume;
volumeSlider.value = initialVolume;

function updateSliderUI(v)
{ const percent = v*100;
    volumeSlider.style.background = `linear-gradient(90deg, #ff7eb3 ${percent}%, #ffffff50 ${percent}%)`;
}
updateSliderUI(initialVolume);

volumeSlider.addEventListener("input",()=>{
    const v=parseFloat(volumeSlider.value);
    bgMusic.volume=v;
    localStorage.setItem("globalVolume",v);
    updateSliderUI(v);
});

document.addEventListener("click", ()=>{
    bgMusic.play().catch(()=>{});
}, {once:true});

function syncVolume(){
    const stored = localStorage.getItem("globalVolume");
    const v = stored !== null ? parseFloat(stored) : 0.5;
    bgMusic.volume = v;
    volumeSlider.value = v;
    updateSliderUI(v);
}

function changeMusicSmooth(newSrc, duration = 1000) {
    if (!bgMusic) return;
    const oldVolume = bgMusic.volume;
    const stepTime = 50;
    const steps = duration / stepTime;
    let currentStep = 0;

    const fadeOut = setInterval(() => {
        currentStep++;
        bgMusic.volume = oldVolume * (1 - currentStep / steps);
        if (currentStep >= steps) {
            clearInterval(fadeOut);
            // Ganti sumber musik
            bgMusic.src = newSrc;
            bgMusic.play().catch(()=>{});
            
            // Fade in
            let fadeInStep = 0;
            const fadeIn = setInterval(() => {
                fadeInStep++;
                bgMusic.volume = oldVolume * (fadeInStep / steps);
                if (fadeInStep >= steps) clearInterval(fadeIn);
            }, stepTime);
        }
    }, stepTime);
}

// ========================== JS: HALAMAN ==========================
const content=document.getElementById("content");

function tampilHalaman(html, nextFunc=null){
    content.classList.remove("show");

    setTimeout(()=>{
        content.innerHTML = "";
        content.innerHTML = html;
        content.classList.add("show");
        syncVolume();
        if(nextFunc) nextFunc();
    },500);
}

// --- HALAMAN 1: NAMA ---
function halamanNama(){
    changeMusicSmooth("audio/happy-birthday.mp3", 1500);

    tampilHalaman(`
        <h1>Masukkan Nama Kamu 🎈</h1>
        <input type="text" id="nama" placeholder="Nama kamu..." />
        <button id="btnNext">Lanjut ➜</button>
    `,()=>{
        document.getElementById("btnNext").onclick=()=>{
            const nama=document.getElementById("nama").value.trim();
            if(!nama) return alert("Masukkan namamu dulu 😊");
            localStorage.setItem("namaUser",nama);
            halamanUcapan();
        };
    });
}

// --- HALAMAN 2: UCAPAN ---
function halamanUcapan(){
    const nama=localStorage.getItem("namaUser")||"Sahabat";

    tampilHalaman(`
        <h1>Happy Sweet Seventeen Birthday 🥳</h1>
        <p>Hai ${nama}, Happy Birthday! Wish u All the Best 🎂💖</p>
        <p>🙌- 8 Februari 2026 - 🙌</p>
        <button id="btnDoa">Next ➜</button>
    `,()=>{
        document.getElementById("btnDoa").onclick=halamanDoa;
    });
}

// --- HALAMAN 3: DOA ---
function halamanDoa(){
    const nama=localStorage.getItem("namaUser")||"Sahabat";

    tampilHalaman(`
        <h1>Doa Untukmu 💐</h1>
        <p>${nama}, semoga kamu selalu sehat, bahagia, dan penuh semangat belajar.</p>
        <p>Semoga impian dan cita-citamu tercapai, dan dipenuhi pengalaman baru yang berharga. 🌈✨</p>
        <p>(●'◡'●)</p>
        <button id="btnFoto">📸 ➜</button>
    `,()=>{
        document.getElementById("btnFoto").onclick=halamanFoto;
    });
}

// --- HALAMAN 4: FOTO ---
function halamanFoto(){
    changeMusicSmooth("audio/memories.mp3", 1500);

    tampilHalaman(`
        <h1>📸👉</h1>
        <div class="story-container">
            <div class="story-slide"><div class="polaroid"><img src="images/1.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/2.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/3.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/4.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/5.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/6.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/7.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/8.png"></div></div>

        </div>
        <button id="btnSongs">🎶 ➜</button>

    `,()=>{
        document.getElementById("btnSongs").onclick=halamanSongs;
        document.getElementById("btnKembali").onclick=halamanNama;
    });
}

// --- HALAMAN 5: TOP 3 SONGS ---
function halamanSongs(){

    tampilHalaman(`
        <div id="songs-page">
            <h1 class="songs-title">Ur Favorite Songs</h1>

            <div class="cards">

                <div class="song">
                    <div class="song-title">What a Beautiful Name</div>
                    <div class="song-artist">Brooke Ligertwood</div>
                    <div class="card" data-song="audio/song1.mp3"></div>
                </div>

                <div class="song">
                    <div class="song-title">Goodness of God</div>
                    <div class="song-artist">Bethel Music</div>
                    <div class="card" data-song="audio/song2.mp3"></div>
                </div>

                <div class="song">
                    <div class="song-title">Golden Hour</div>
                    <div class="song-artist">JVKE</div>
                    <div class="card" data-song="audio/song3.mp3"></div>
                </div>

            </div>

            <button id="songsNextBtn">📜 ➜</button>
        </div>
    `, initSongsLogic);
}

function initSongsLogic(){

    const cards = document.querySelectorAll('.card');
    const nextBtn = document.getElementById('songsNextBtn');

    let currentCard = null;
    let currentSong = null;

    cards.forEach(card=>{
        card.addEventListener('click',()=>{

            const songSrc = card.dataset.song;

            if(currentCard === card){
                if(bgMusic.paused){
                    bgMusic.play().catch(()=>{});
                    card.classList.add('active');
                } else {
                    bgMusic.pause();
                    card.classList.remove('active');
                }
                return;
            }

            if(currentCard) currentCard.classList.remove('active');

            currentCard = card;
            currentSong = songSrc;

            changeMusicSmooth(songSrc, 1000);

            card.classList.add('active');
            nextBtn.classList.add('active');
        });
    });

    nextBtn.onclick = ()=>{
        localStorage.setItem("selectedSong", currentSong);
        halamanLetter();
    };
}

// --- HALAMAN 6: SURAT ---
function halamanLetter(){

  const chosenSong = localStorage.getItem("selectedSong");
  if(chosenSong && !bgMusic.src.includes(chosenSong)){
      changeMusicSmooth(chosenSong, 1200);
  }

  tampilHalaman(`
    <div id="letter" class="letter">
      <h1>📜🎉</h1>
      <p>
Hey hey, makasih udah luangin waktu buat buka link ini. Happy birthday ya! Semoga semua yang kamu impikan bisa tercapai. Tetap usaha dan terus berdoa. Semoga kamu selalu diberikan kesehatan, kebahagiaan, dan kesuksesan dalam segala hal. Semoga tahun ini penuh pengalaman berharga, teman-teman yang menyenangkan, dan momen-momen yang membuatmu tersenyum! 
    
Thanks for still wanting to talk to me up until now. I'm sorry for what I did in the past that always bothered and made you feel uncomfortable. I hope we can still talk to each other without any hard fellings. I'm lucky to have found u. Stay cheerful and shine like the sun and your nickname 🌞🌞, and keep faithfully serving God

Setelah ini, hapus tab browser / hapus history browser kamu ya! karena musiknya bakal tetap nyala walau keluar dari browser 😄 

Monday is coming, semangat sekolah ya! 😉

Sleep well and sweet dreams! 😴💤

Jesus Bless You! ✨ 
    
-v
#✌️
      </p>

      <button id="btnBackToSongs">⬅️🎶</button>
      <button id="btnCloseLetter">Exit</button>
    </div>
  `, ()=>{
    const btnBack = document.getElementById("btnBackToSongs");
    btnBack.onclick = ()=>{
    halamanSongs();
    };
    const btn = document.getElementById("btnCloseLetter");
    btn.onclick = ()=>{
      halamanNama();
    };
  });
}

// ========================== JS: INIT ==========================
halamanNama();

});