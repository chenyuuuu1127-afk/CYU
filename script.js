document.addEventListener("DOMContentLoaded", () => {
  // 展開 / 收合角色卡
  const cards = document.querySelectorAll(".char-card");

  cards.forEach(card => {
    const toggle = card.querySelector(".char-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      const isExpanded = card.classList.toggle("expanded");
      card.setAttribute("data-expanded", isExpanded ? "true" : "false");
    });
  });

  // 模型 Tabs 切換
  const modelBlocks = document.querySelectorAll("[data-model-tabs]");

  modelBlocks.forEach(block => {
    const tabs = block.querySelectorAll(".model-tab");
    const panels = block.querySelectorAll(".model-panel");

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-model-tab");
        if (!target) return;

        // Tab 狀態切換
        tabs.forEach(t => t.classList.remove("is-active"));
        tab.classList.add("is-active");

        // Panel 顯示切換
        panels.forEach(panel => {
          if (panel.getAttribute("data-model-panel") === target) {
            panel.classList.add("is-active");

            // 切換時把該 panel 裡的 slider 重置到第一張
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

  // 初始化所有 slider
  const sliders = document.querySelectorAll("[data-slider]");
  sliders.forEach(initSlider);
});

/**
 * 初始化單一 slider
 */
function initSlider(slider) {
  const track = slider.querySelector(".slider-track");
  const slides = slider.querySelectorAll(".slide");
  const prevBtn = slider.querySelector("[data-prev]");
  const nextBtn = slider.querySelector("[data-next]");
  const dotsContainer = slider.querySelector(".slider-dots");

  if (!track || slides.length === 0) return;

  let currentIndex = 0;

  // 如果只有一張圖，就隱藏左右箭頭
  if (slides.length <= 1) {
    slider.classList.add("no-arrows");
  }

  // 建立 dots
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

  // 更新顯示
  function updateSlides() {
    slides.forEach((slide, idx) => {
      slide.classList.toggle("is-active", idx === currentIndex);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === currentIndex);
    });
  }

  // 重置到第一張（給 Tabs 切換時用）
  function reset() {
    currentIndex = 0;
    updateSlides();
  }

  // 存在 slider 元素上，給外面 reset 用
  slider._resetSlider = reset;

  // 左右按鈕事件
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides();
    });
  }

  // 初始化一次
  updateSlides();
}

/**
 * 讓外部可以重置 slider 到第一張
 */
function resetSlider(slider) {
  if (slider && typeof slider._resetSlider === "function") {
    slider._resetSlider();
  }
}
