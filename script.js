document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll(".char-card");
  cards.forEach(card => {
    const toggle = card.querySelector(".char-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const isAlreadyExpanded = card.classList.contains("expanded");

      if (isAlreadyExpanded) {
        card.classList.remove("expanded");
        card.setAttribute("data-expanded", "false");
      } else {
        cards.forEach(other => {
          if (other !== card) {
            other.classList.remove("expanded");
            other.setAttribute("data-expanded", "false");
          }
        });
        card.classList.add("expanded");
        card.setAttribute("data-expanded", "true");
      }
    });
  });

  const modelBlocks = document.querySelectorAll("[data-model-tabs]");

  modelBlocks.forEach(block => {
    const tabs = block.querySelectorAll(".model-tab");
    const panels = block.querySelectorAll(".model-panel");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-model-tab");
        if (!target) return;

        tabs.forEach(t => t.classList.remove("is-active"));
        tab.classList.add("is-active");

        panels.forEach(panel => {
          if (panel.getAttribute("data-model-panel") === target) {
            panel.classList.add("is-active");

            const slider = panel.querySelector("[data-slider]");
            if (slider) {
              resetSlider(slider);
            }
          } else {
            panel.classList.remove("is-active");
          }
        });
      });
    });
  });

  const sliders = document.querySelectorAll("[data-slider]");
  sliders.forEach(initSlider);

  function initSlider(slider) {
    const track = slider.querySelector(".slider-track");
    const slides = slider.querySelectorAll(".slide");
    const prevBtn = slider.querySelector("[data-prev]");
    const nextBtn = slider.querySelector("[data-next]");
    const dotsContainer = slider.querySelector(".slider-dots");

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    if (slides.length <= 1) {
      slider.classList.add("no-arrows");
    }

    const dots = [];
    if (dotsContainer) {
      dotsContainer.innerHTML = "";
      slides.forEach((_, idx) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot" + (idx === 0 ? " is-active" : "");
        dot.addEventListener("click", () => {
          currentIndex = idx;
          updateSlides();
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    function updateSlides() {
      slides.forEach((slide, idx) => {
        slide.classList.toggle("is-active", idx === currentIndex);
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle("is-active", idx === currentIndex);
      });
    }
    
    function showPrev() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides();
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides();
    }

    function reset() {
      currentIndex = 0;
      updateSlides();
    }

    slider._resetSlider = reset;

    if (prevBtn) {
      prevBtn.addEventListener("click", showPrev);
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", showNext);
    }

    let startX = null;
    let isDragging = false;

    function pointerDown(e) {
      isDragging = true;
      startX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
    }

    function pointerMove(e) {
      if (!isDragging || startX == null) return;
    }

    function pointerUp(e) {
      if (!isDragging || startX == null) {
        isDragging = false;
        startX = null;
        return;
      }
      const endX = e.clientX ?? (e.changedTouches && e.changedTouches[0]?.clientX);
      if (endX != null) {
        const deltaX = endX - startX;
        const threshold = 40;

        if (deltaX > threshold) {
          showPrev();
        } else if (deltaX < -threshold) {
          showNext();
        }
      }
      isDragging = false;
      startX = null;
    }

    slider.addEventListener("pointerdown", pointerDown);
    slider.addEventListener("pointerup", pointerUp);
    slider.addEventListener("pointercancel", pointerUp);
    slider.addEventListener("pointerleave", pointerUp);

    slider.addEventListener("touchstart", pointerDown, { passive: true });
    slider.addEventListener("touchend", pointerUp);

    updateSlides();
  }

  function resetSlider(slider) {
    if (slider && slider._resetSlider) {
      slider._resetSlider();
    }
  }
});
