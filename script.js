document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".char-card");

  cards.forEach(card => {
    const toggle = card.querySelector(".char-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const isExpanded = card.classList.toggle("expanded");
      card.setAttribute("data-expanded", isExpanded ? "true" : "false");
    });
  });
});
