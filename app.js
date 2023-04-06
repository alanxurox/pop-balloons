// we declare a new global variable containing an array that represents the ballons map
const color = ["green", "red", "violet", "black", "yellow", "purple", "grey", "gray", "brown", "blue", "pink", "orange"];

// you have to add more colors into the ballonsMap array
let ballonsAlive = 20;
//generando de forma dinamica los colores
for (let i=0; i<20; i++){
    const randomColor = color[Math.floor(Math.random()*color.length)]
    let ballon = document.createElement("div");
    ballon.classList.add('balloon', 'balloon');
    ballon.style.background = randomColor;
    ballon.id = i;

    // Agregar EventListener a cada ballon:
    ballon.addEventListener('click', (e) => {
        if (e.target.style.visibility !== 'hidden') {
            e.target.style.visibility = 'hidden';
            ballonsAlive--;

            if(ballonsAlive == 0) render();
            const pop = new AudioContext();
            fetch('./pop.mp3')
            .then(response => response.arrayBuffer())
            .then(buffer => {
                pop.decodeAudioData(buffer, function(decodedData) {
                    const source = pop.createBufferSource();
                    source.buffer = decodedData;
                    source.connect(pop.destination);
                    source.start(0);
                });
            })
            .catch(err => console.log(err));
        }
    });

    // Agregar cada ballon a la lista de ballons:
    document.querySelector("#balloon-map").appendChild(ballon);
  }

const render = () => {
    document.querySelector("#balloon-count").innerHTML = ballonsAlive; // <-- render the balloon count into the DOM

    if(ballonsAlive == 0) {
        const music = new AudioContext();
        fetch('./music.mp3')
        .then(response => response.arrayBuffer())
        .then(buffer => {
            music.decodeAudioData(buffer, function(decodedData) {
                const source = music.createBufferSource();
                source.buffer = decodedData;
                source.connect(music.destination);
                source.start(0);
            });
        })
        .catch(err => console.log(err));
        window.location.reload(); // <--- reload website when no more balloons are left
    }
}

// this makes the "render" function trigger when the website starts existing
window.onload = () => {
    const music = new AudioContext();
    fetch('./music.mp3')
    .then(response => response.arrayBuffer())
    .then(buffer => {
        music.decodeAudioData(buffer, function(decodedData) {
            const source = music.createBufferSource();
            source.buffer = decodedData;
            source.connect(music.destination);
            source.start(0);
        });
    })
    .catch(err => console.log(err));
    render();
};

// add a button to enable audio, and when user clicks it, unmute all audio; set all audio to mute at start
const audioElements = document.querySelectorAll("audio");

audioElements.forEach(audio => {
    audio.muted = true;
});

const audioButton = document.querySelector("#audioButton");

if (audioButton) {
    if (audioButton.addEventListener) {
        audioButton.addEventListener("click", () => {
            audioElements.forEach(audio => {
                audio.muted = false;
            });
        });
    }
}

// add a mobile UI friendly timer that shows a countdown from 5 to 0s, showing the ms, and starts when user clicks the first balloon
let timer = document.createElement("div");
timer.classList.add('timer');
document.querySelector("#balloon-map").appendChild(timer);

let startTimer = false;
let timeLeft = 5000;

const startCountdown = () => {
    startTimer = true;
    const startTime = Date.now();
    const interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        timeLeft = Math.max(0, 5000 - elapsedTime);
        const seconds = Math.floor(timeLeft / 1000);
        const milliseconds = timeLeft % 1000;
        timer.innerHTML = `${seconds}:${milliseconds.toString().padStart(3, '0')}`;
        if (timeLeft <= 0) {
            clearInterval(interval);
            timer.innerHTML = "Time's up!";
        }
    }, 10);
}

document.querySelectorAll('.balloon').forEach(balloon => {
    balloon.addEventListener('click', (event) => {
        if (!startTimer) {
            startCountdown();
        }
        if (event.target.style.visibility !== 'hidden') {
            event.target.style.visibility = 'hidden';
            ballonsAlive--;
            if(ballonsAlive == 0) render();
            const pop = new AudioContext();
            fetch('./pop.mp3')
            .then(response => response.arrayBuffer())
            .then(buffer => {
                pop.decodeAudioData(buffer, function(decodedData) {
                    const source = pop.createBufferSource();
                    source.buffer = decodedData;
                    source.connect(pop.destination);
                    source.start(0);
                });
            })
            .catch(err => console.log(err));
        }
    });
}); 
