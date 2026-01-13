document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");

  if (!btn || !nav) return;

  const openMenu = () => {
    nav.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    nav.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    nav.classList.contains("is-open") ? closeMenu() : openMenu();
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Fecha ao clicar em link
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") closeMenu();
  });

  // Fecha ao clicar fora
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("is-open")) return;
    if (!nav.contains(e.target) && e.target !== btn) closeMenu();
  });

  // Fecha com ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Se voltar pro desktop, garante fechado (evita estados estranhos)
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
});
