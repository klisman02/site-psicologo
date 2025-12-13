const track = document.querySelector(".carousel-track");
const cards = document.querySelectorAll(".carousel-card");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let index = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

nextBtn.addEventListener("click", () => {
  index = (index + 1) % cards.length;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + cards.length) % cards.length;
  updateCarousel();
});

// rotação automática suave
setInterval(() => {
  index = (index + 1) % cards.length;
  updateCarousel();
}, 7000);
