console.log("lets start rewriting")
let currentSong = new Audio();
let currFolder;
let songs;
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }

    const minutes = Math.floor(seconds / 60);


    const remainingSeconds = Math.floor(seconds % 60);

    // Format minutes and seconds to always be two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted time as "minutes:seconds"
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`${folder}/`);
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList ul")
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += `<li class="flex p-1">
        <img  src="img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Harshit</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img src="img/play.svg" alt="">
        </div>
    </li>`;
    }

    //play first song
    // var audio= new Audio(songs[0]);
    // audio.play()

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });




    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayAlbums() {
    let a = await fetch(`songs/`);
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let i = 0; i < array.length; i++) {
        const e = array[i];

        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            let a = await fetch(`songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML += `<div data-folder="${folder}" class="card">
            <img src="songs/${folder}/cover.jpg.png" alt="">
            <div class="play">
                <svg width="100" height="42" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- Green Circle -->
                <circle cx="50" cy="50" r="45" fill="green" />
                
                <!-- Black Play Button -->
                <polygon points="40,30 70,50 40,70" fill="black" />
                </svg>
                </div>
                <h3>${response.title}</h3>
                <p>${response.description}</p>
                </div>`
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    });
}

async function main() {
    // let currentSong;
    //get the list of all the songs
    songs = await getSongs("songs/Album1")
    playMusic(songs[0], true)
    play.src = "img/play.svg"

    await displayAlbums()

    document.querySelector(".menu").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "0%"
    })

    document.querySelector(".close").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "-100%"
    })

    currentSong.addEventListener("timeupdate", (a) => {
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"

        currentSong.currentTime = (percent * (currentSong.duration)) / 100
    })



    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    document.querySelector(".volume img").addEventListener("click", (e) => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = 0.1
            document.querySelector(".volume").getElementsByTagName("input")[0].value = 10
        }
    })

    document.getElementById("previous").addEventListener("click", (e) => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/")[5])
        if (index - 1 >= 0) {
            playMusic(songs[index - 1])
            play.src = "img/pause.svg"
        }
        else {
            playMusic(songs[(songs.length) - 1])
        }
    })
    document.getElementById("next").addEventListener("click", (e) => {
        currentSong.pause()
        let index = songs.indexOf(currentSong.src.split("/")[5])
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1])
            play.src = "img/pause.svg"
        }
        else {
            playMusic(songs[0])
        }
    })

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })
}
main()
