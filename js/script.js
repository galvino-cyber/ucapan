document.addEventListener("DOMContentLoaded", () => {

// ============================== GLOBAL ==============================
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

// ============================== MUSIC & VOLUME ==============================
const bgMusic = document.getElementById("bgMusic");
const volumeSlider = document.getElementById("volumeSlider");

// Load volume dari localStorage
let savedVolume = localStorage.getItem("globalVolume");
let initialVolume = savedVolume !== null ? parseFloat(savedVolume) : 0.5;
bgMusic.volume = initialVolume;
volumeSlider.value = initialVolume;

function updateSliderUI(v){
    const percent = v*100;
    volumeSlider.style.background = `linear-gradient(90deg, #ff7eb3 ${percent}%, #ffffff50 ${percent}%)`;
}
updateSliderUI(initialVolume);

volumeSlider.addEventListener("input",()=>{
    const v=parseFloat(volumeSlider.value);
    bgMusic.volume=v;
    localStorage.setItem("globalVolume",v);
    updateSliderUI(v);
});

// first click play
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
    const stepTime = 50; // ms per step
    const steps = duration / stepTime;
    let currentStep = 0;

    // Fade out
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

// ============================== HALAMAN ==============================
const content=document.getElementById("content");

function tampilHalaman(html,nextFunc=null){
    content.classList.remove("show");
    setTimeout(()=>{
        content.innerHTML=html;
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
        <p>Tuhan Yesus Memberkati! ✨</p>
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
        <h1>📸🌟</h1>
        <div class="story-container">
            <div class="story-slide"><div class="polaroid"><img src="images/1.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/2.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/3.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/4.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/5.png"></div></div>
            <div class="story-slide"><div class="polaroid"><img src="images/6.png"></div></div>
        </div>
        <button id="btnFlower"> 🌸 ➜</button>

    `,()=>{
        document.getElementById("btnFlower").onclick=halamanFlower;
        document.getElementById("btnKembali").onclick=halamanNama;
    });
}

// --- HALAMAN 5: FLOWER ---
function halamanFlower(){
    content.classList.remove("show");
    content.classList.add("page-fade");

    setTimeout(()=>{
        content.innerHTML='';
        const flowerPage=document.getElementById("flower-page");
        flowerPage.style.display='flex';
        flowerPage.classList.add("page-show");

        changeMusicSmooth("audio/flower-music.mp3", 1500);

        const flower=document.getElementById("flower");
        flower.style.opacity=1;
        let scale=1;
        const maxScale=3;

        flower.onclick=()=>{
            if(scale<maxScale){
                scale+=0.3;
                flower.style.transform=`scale(${scale})`;
            } else {
                flower.style.opacity=0;
                for(let i=0;i<50;i++){
                    const gift=document.createElement('div');
                    gift.classList.add('gift');
                    gift.style.setProperty('--x',(Math.random()*400-200)+'px');
                    gift.style.setProperty('--y',(Math.random()*-400)+'px');
                    gift.innerText='🎁';
                    flowerPage.appendChild(gift);
                    setTimeout(()=>gift.remove(),1000);
                }
                for(let i=0;i<50;i++){
                    const c=document.createElement('div');
                    c.classList.add('confetti');
                    c.style.left=Math.random()*100+"vw";
                    c.style.animationDuration=2+Math.random()*2+"s";
                    c.style.setProperty("--color",confettiColors[Math.floor(Math.random()*5)]);
                    c.style.background=c.style.getPropertyValue("--color");
                    flowerPage.appendChild(c);
                    setTimeout(()=>c.remove(),2000);
                }
                setTimeout(()=>{
                    scale=1;
                    flower.style.transform=`scale(${scale})`;
                    flower.style.opacity=1;
                },1000);
            }
        };

        const btnBackFlower = document.getElementById("btnBackFlower");
        if(btnBackFlower){
            btnBackFlower.onclick = () => {
                flowerPage.classList.remove("page-show");
                setTimeout(()=>{ 
                    flowerPage.style.display='none'; 
                    halamanNama(); 
                },600);
            };
        }

        let flowerBtnLetter=document.getElementById("btnLetter");
        if(!flowerBtnLetter){
            flowerBtnLetter=document.createElement('button');
            flowerBtnLetter.id="btnLetter";
            flowerBtnLetter.textContent=' 📜 ➜';
            flowerBtnLetter.style.marginTop='20px';
            flowerPage.appendChild(flowerBtnLetter);
            flowerBtnLetter.onclick=halamanLetter;
        }

    },400);
}

// --- HALAMAN 6: LETTER ---
function halamanLetter(){
    document.getElementById("flower-page").style.display='none';
    const letterPage=document.getElementById("letter-page");
    const letter=document.getElementById("letter");

    letterPage.style.display='flex';
    setTimeout(()=>{ letter.classList.add('show'); },50);

    if(!document.getElementById("btnCloseLetter")){
        const btn=document.createElement("button");
        btn.id="btnCloseLetter";
        btn.textContent="Exit";
        letter.appendChild(btn);

        btn.onclick=()=>{
            letter.classList.remove("show");
            setTimeout(()=>{
                letterPage.style.display="none";
                halamanNama();
            },800);
        };
    }
}

// ============================== INIT ==============================
halamanNama();

});