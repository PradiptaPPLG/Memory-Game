const moves = document.getElementById('moves-count');
const timeValue = document.getElementById('time');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const gameContainer = document.querySelector('.game-container');
const result = document.getElementById('result');
const controls = document.querySelector('.controls-container');

let cards;
let interval;
let firstCard = false;
let secondCard = false;
let isFlipping = false;

const items = [
  { name: "domba", image: "domba.png" },
  { name: "embe", image: "embe.png" },
  { name: "sapi", image: "sapi.png" },
  { name: "ayam", image: "ayam.png" },
  { name: "bebek", image: "bebek.png" },
  { name: "kuda", image: "kuda.png" },
  { name: "kambing", image: "kambing.png" },
  { name: "puyuh", image: "puyuh.png" },
  { name: "banteng", image: "banteng.png" },
  { name: "merak", image: "merak.png" },
  { name: "kucing", image: "kucing.png" },
  { name: "anjing", image: "anjing.png" },
  { name: "kucingabcd", image: "abcd.png" },
  { name: "kucingakmal", image: "akmal.png" },
  { name: "kucingalien", image: "alien.png" },
  { name: "kucingbakekok", image: "bakekok.png" },
  { name: "kucingbeluga", image: "beluga.png" },
  { name: "kucingbengong", image: "bengong.png" },
  { name: "kucingdeleng", image: "deleng.png" },
  { name: "kucingdudul", image: "dudul.png" },
  { name: "kucingkaget", image: "kaget.png" },
  { name: "kucingmanakutaw", image: "manakutaw.png" },
  { name: "kucingmenggoda", image: "menggoda.png" },
  { name: "kucingnonjok", image: "nonjok.png" },
  { name: "kucingondemande", image: "ondemande.png" },
  { name: "kucingpasrah", image: "pasrah.png" },
  { name: "kucingsipit", image: "sipit.png" },
  { name: "kucingtdkmenggoda", image: "tdkmenggoda.png" },
  { name: "kucingtulalit", image: "tulalit.png" },
  { name: "kucingwhahaha", image: "whahaha.png" },
  { name: "kucingwlee", image: "wlee.png" },
  { name: "kucingpusing", image: "pusing.png" },
];

let seconds = 0,
  minutes = 0;
let movesCount = 0,
  winCount = 0;

// Waktu
const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// Hitung gerakan
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Acak gambar
const generateRandom = (size = 4) => {
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

// Buat grid kartu
const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);

  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
          <img src="${cardValues[i].image}" class="image"/>
        </div>
      </div>
    `;
  }

  // Atur grid layout
  gameContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  // Ambil semua kartu
  cards = document.querySelectorAll('.card-container');

  // ⛔ Blokir drag gambar (HARUS di sini)
  document.querySelectorAll(".image").forEach(img => {
    img.ondragstart = () => false;
  });

  // Event klik pada kartu
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (isFlipping || card.classList.contains("matched") || card.classList.contains("flipped")) {
        return;
      }

      card.classList.add("flipped");

      if (!firstCard) {
        firstCard = card;
        firstCardValue = card.getAttribute("data-card-value");
      } else {
        movesCounter();
        secondCard = card;
        let secondCardValue = card.getAttribute("data-card-value");
        isFlipping = true;

        if (firstCardValue == secondCardValue) {
          firstCard.classList.add("matched");
          secondCard.classList.add("matched");
          firstCard = false;
          isFlipping = false;
          winCount += 1;

          if (winCount == Math.floor(cardValues.length / 2)) {
            result.innerHTML = `<h2>You Won 🎉</h2><h4>Moves: ${movesCount}</h4>`;
            stopGame();
          }
        } else {
          let [tempFirst, tempSecond] = [firstCard, secondCard];
          firstCard = false;
          secondCard = false;
          setTimeout(() => {
            tempFirst.classList.remove("flipped");
            tempSecond.classList.remove("flipped");
            isFlipping = false;
          }, 900);
        }
      }
    });
  });
};

// Tombol Start
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;

  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");

  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;

  initializer(8); // 🔸 Ukuran grid 8x8
});

// Tombol Stop
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

// Mulai permainan
const initializer = (size = 4) => {
  result.innerHTML = "";
  winCount = 0;
  let cardValues = generateRandom(size);
  matrixGenerator(cardValues, size);
};
