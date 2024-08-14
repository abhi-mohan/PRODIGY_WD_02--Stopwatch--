let timer;
let elapsedTime = 0;
let isRunning = false;
let lapCount = 0;
let previousLapTime = 0;

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');
const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');

const startSound = document.getElementById('startSound');
const stopSound = document.getElementById('stopSound');
const lapSound = document.getElementById('lapSound');

startStopBtn.addEventListener('click', startStop);
lapBtn.addEventListener('click', recordLap);
resetBtn.addEventListener('click', reset);
saveBtn.addEventListener('click', saveSession);
loadBtn.addEventListener('click', loadSession);
toggleThemeBtn.addEventListener('click', toggleDarkMode);

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 's') startStop();
    if (e.key.toLowerCase() === 'l') recordLap();
    if (e.key.toLowerCase() === 'r') reset();
});

function startStop() {
    if (isRunning) {
        clearInterval(timer);
        stopSound.play();
        startStopBtn.textContent = 'Start';
        startStopBtn.style.backgroundColor = '#28a745';
    } else {
        startSound.play();
        startStopBtn.textContent = 'Stop';
        startStopBtn.style.backgroundColor = '#dc3545';
        timer = setInterval(updateTime, 10);
    }
    isRunning = !isRunning;
}

function updateTime() {
    elapsedTime += 10;
    display.textContent = formatTime(elapsedTime);
}

function recordLap() {
    if (isRunning) {
        lapCount++;
        const lapTime = formatTime(elapsedTime);
        const lapDifference = formatTime(elapsedTime - previousLapTime);
        previousLapTime = elapsedTime;

        lapSound.play();

        const lapItem = document.createElement('li');
        lapItem.innerHTML = `<span>Lap ${lapCount}</span><span>${lapTime} (+${lapDifference})</span>`;
        lapsList.appendChild(lapItem);

        updateAverageLapTime();
    }
}

function updateAverageLapTime() {
    const averageTime = formatTime(Math.floor(elapsedTime / lapCount));
    document.getElementById('averageTime').textContent = `Average Lap Time: ${averageTime}`;
}

function reset() {
    clearInterval(timer);
    elapsedTime = 0;
    lapCount = 0;
    previousLapTime = 0;
    isRunning = false;
    display.textContent = '00:00:00.00';
    lapsList.innerHTML = '';
    document.getElementById('averageTime').textContent = 'Average Lap Time: 00:00:00.00';
    startStopBtn.textContent = 'Start';
    startStopBtn.style.backgroundColor = '#28a745';
}

function formatTime(time) {
    const milliseconds = parseInt((time % 1000) / 10);
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(milliseconds, 2)}`;
}

function pad(number, digits = 2) {
    return number.toString().padStart(digits, '0');
}

function saveSession() {
    const session = {
        elapsedTime,
        lapCount,
        previousLapTime,
        laps: lapsList.innerHTML,
    };
    localStorage.setItem('stopwatchSession', JSON.stringify(session));
    alert('Session saved successfully!');
}

function loadSession() {
    const session = JSON.parse(localStorage.getItem('stopwatchSession'));
    if (session) {
        elapsedTime = session.elapsedTime;
        lapCount = session.lapCount;
        previousLapTime = session.previousLapTime;
        lapsList.innerHTML = session.laps;
        display.textContent = formatTime(elapsedTime);
        document.getElementById('averageTime').textContent = `Average Lap Time: ${formatTime(Math.floor(elapsedTime / lapCount))}`;
        alert('Session loaded successfully!');
    } else {
        alert('No saved session found.');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

document.getElementById('exportBtn').addEventListener('click', exportToCSV);

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Lap,Time,Difference\n";
    const laps = document.querySelectorAll('#lapsList li');
    laps.forEach((lap, index) => {
        const lapNumber = lap.querySelector('span').textContent;
        const lapTimes = lap.querySelectorAll('span')[1].textContent.split(' (+');
        const lapTime = lapTimes[0];
        const lapDifference = lapTimes[1].replace(')', '');
        csvContent += `${lapNumber},${lapTime},${lapDifference}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'lap_times.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Countdown Timer
const countdownInput = document.getElementById('countdownInput');
const startCountdownBtn = document.getElementById('startCountdownBtn');
const countdownDisplay = document.getElementById('countdownDisplay');
let countdownTimer;
let countdownTime;

startCountdownBtn.addEventListener('click', startCountdown);

function startCountdown() {
    countdownTime = parseInt(countdownInput.value) * 1000;
    countdownDisplay.textContent = formatCountdown(countdownTime);
    clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
    countdownTime -= 1000;
    countdownDisplay.textContent = formatCountdown(countdownTime);
    if (countdownTime <= 0) {
        clearInterval(countdownTimer);
        alert('Countdown finished!');
    }
}

function formatCountdown(time) {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    return `${pad(minutes)}:${pad(seconds)}`;
}
