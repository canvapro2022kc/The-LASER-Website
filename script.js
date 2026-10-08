document.addEventListener('DOMContentLoaded', function () {

  // ==========================================
  // 1. REUSABLE CAROUSEL INITIALIZER
  // ==========================================
  function initCarousel(trackId, prevBtnId, nextBtnId, dotsContainerId) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dotsContainer = document.getElementById(dotsContainerId);

    if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

    const slides = track.querySelectorAll('.slide, .reader-slide');
    const dots = dotsContainer.querySelectorAll('.dot');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoSlideTimer;

    if (totalSlides === 0) return;

    function updateCarousel(index) {
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function nextSlide() {
      const newIndex = (currentIndex + 1) % totalSlides;
      updateCarousel(newIndex);
    }

    function prevSlide() {
      const newIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateCarousel(newIndex);
    }

    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
      resetAutoSlide();
    });

    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
      resetAutoSlide();
    });

    dots.forEach(dot => {
      dot.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'));
        if (!isNaN(index)) {
          updateCarousel(index);
          resetAutoSlide();
        }
      });
    });

    function startAutoSlide() {
      autoSlideTimer = setInterval(nextSlide, 5000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideTimer);
      startAutoSlide();
    }

    startAutoSlide();
  }

  // --- INITIALIZE HOME PAGE CAROUSELS ---
  initCarousel('carouselTrack', 'prevBtn', 'nextBtn', 'carouselDots');
  initCarousel('editionsTrack', 'prevEdBtn', 'nextEdBtn', 'editionsDots');
  initCarousel('newsTrack', 'prevNewsBtn', 'nextNewsBtn', 'newsDots');
  initCarousel('literaryTrack', 'prevLitBtn', 'nextLitBtn', 'literaryDots');

  // --- INITIALIZE ANALASER FEED READERS ---
  initCarousel('post1Track', 'prev1Btn', 'next1Btn', 'dots1');
  initCarousel('post2Track', 'prev2Btn', 'next2Btn', 'dots2');
  initCarousel('post3Track', 'prev3Btn', 'next3Btn', 'dots3');


  // ==========================================
  // 2. MENU DROPDOWN TOGGLE
  // ==========================================
  const menuBtn = document.getElementById('menuBtn');
  const dropdownPanel = document.getElementById('dropdownPanel');

  if (menuBtn && dropdownPanel) {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdownPanel.classList.toggle('active');
      dropdownPanel.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!dropdownPanel.contains(e.target) && !menuBtn.contains(e.target)) {
        dropdownPanel.classList.remove('active');
        dropdownPanel.classList.remove('show');
      }
    });
  }

// ==========================================
// 3. GLOBAL SEARCH ENGINE & FILTER
// ==========================================
const searchInput = document.getElementById('searchInput');

// Only run live filtering on archive/grid pages where cards aren't locked inside carousels
const GRID_CARD_SELECTOR = '.highlights-archive-grid .archive-card, .board-grid .archive-card, .publications-grid .publication-item';

if (searchInput) {
  // 1. Read URL query parameters on page load (e.g. index.html?search=query)
  const urlParams = new URLSearchParams(window.location.search);
  const searchQueryParam = urlParams.get('search');

  if (searchQueryParam) {
    searchInput.value = searchQueryParam;
    filterContent(searchQueryParam.toLowerCase().trim());
  }

  // 2. Live filter ONLY on full archive grid pages (prevents breaking home/carousel layouts)
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const itemsToSearch = document.querySelectorAll(GRID_CARD_SELECTOR);

    // Only apply live display toggling if we are on an archive grid page
    if (itemsToSearch.length > 0) {
      filterContent(query);
    }
  });

  // 3. Pressing ENTER submits the search across the site
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      const itemsToSearch = document.querySelectorAll(GRID_CARD_SELECTOR);

      if (query !== '') {
        // If on an archive page, filter directly; otherwise redirect to index/archive page with query
        if (itemsToSearch.length > 0) {
          filterContent(query.toLowerCase());
        } else {
          window.location.href = `editorial.html?search=${encodeURIComponent(query)}`;
        }
      }
    }
  });
}

// Helper Function: Safe filter for grid items
function filterContent(query) {
  const items = document.querySelectorAll(GRID_CARD_SELECTOR);

  items.forEach(item => {
    const textContent = item.textContent.toLowerCase();
    const imgAlt = item.querySelector('img')?.getAttribute('alt')?.toLowerCase() || '';

    if (query === '' || textContent.includes(query) || imgAlt.includes(query)) {
      item.style.display = ''; // Show item
    } else {
      item.style.display = 'none'; // Hide non-matching item
    }
  });
}

});