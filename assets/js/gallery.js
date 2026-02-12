// ============================
// Wait for DOM to be ready
// ============================
document.addEventListener('DOMContentLoaded', () => {

  // ============================
  // Initialize GLightbox
  // ============================
  const lightbox = GLightbox({
    selector: 'a.image, a.glightbox',
    loop: true,
    openEffect: 'zoom',
    closeEffect: 'fade',
    touchNavigation: true
  });

  const galleryContainer = document.querySelector('.gallery-container');
  const leftArrow = document.querySelector('.gallery-arrow.left');
  const rightArrow = document.querySelector('.gallery-arrow.right');
  const scrollbar = document.querySelector('.gallery-scrollbar');
  const thumb = document.querySelector('.gallery-scrollbar-thumb');

  // ============================
  // Arrow Controls
  // ============================
  leftArrow.addEventListener('click', () => {
    galleryContainer.scrollBy({ left: -300, behavior: 'smooth' });
  });

  rightArrow.addEventListener('click', () => {
    galleryContainer.scrollBy({ left: 300, behavior: 'smooth' });
  });

  // ============================
  // Update Arrow Visibility
  // ============================
  function updateArrows() {
    const scrollLeft = galleryContainer.scrollLeft;
    const scrollWidth = galleryContainer.scrollWidth;
    const clientWidth = galleryContainer.clientWidth;
    const tolerance = 1; // 1px tolerance for subpixels

    if (scrollLeft <= tolerance) {
      leftArrow.classList.add('hidden');
    } else {
      leftArrow.classList.remove('hidden');
    }

    if (scrollLeft + clientWidth >= scrollWidth - tolerance) {
      rightArrow.classList.add('hidden');
    } else {
      rightArrow.classList.remove('hidden');
    }
  }

  // ============================
  // Update Scrollbar Position
  // ============================
  function updateScrollbar() {
    const scrollWidth = galleryContainer.scrollWidth;
    const visibleWidth = galleryContainer.clientWidth;
    const scrollLeft = galleryContainer.scrollLeft;

    const scrollRatio = visibleWidth / scrollWidth;
    const thumbWidth = scrollRatio * scrollbar.clientWidth;

    thumb.style.width = thumbWidth + 'px';

    const maxScrollLeft = scrollWidth - visibleWidth;
    const maxThumbLeft = scrollbar.clientWidth - thumbWidth;

    const thumbLeft = (scrollLeft / maxScrollLeft) * maxThumbLeft;
    thumb.style.left = thumbLeft + 'px';
  }

  // ============================
  // Gallery Drag-to-Scroll (Mouse + Touch)
  // ============================
  let isDownGallery = false;
  let startXGallery;
  let scrollLeftGallery;

  // Mouse drag
  galleryContainer.addEventListener('mousedown', (e) => {
    if (e.target.closest('.gallery-scrollbar')) return;
    isDownGallery = true;
    startXGallery = e.pageX - galleryContainer.offsetLeft;
    scrollLeftGallery = galleryContainer.scrollLeft;
  });

  galleryContainer.addEventListener('mouseleave', () => { isDownGallery = false; });
  galleryContainer.addEventListener('mouseup', () => { isDownGallery = false; });

  galleryContainer.addEventListener('mousemove', (e) => {
    if (!isDownGallery) return;
    e.preventDefault();
    const x = e.pageX - galleryContainer.offsetLeft;
    const walk = (x - startXGallery) * 2;
    galleryContainer.scrollLeft = scrollLeftGallery - walk;
  });

  // Touch drag
  galleryContainer.addEventListener('touchstart', (e) => {
    if (e.target.closest('.gallery-scrollbar')) return;
    isDownGallery = true;
    startXGallery = e.touches[0].clientX;
    scrollLeftGallery = galleryContainer.scrollLeft;
  }, { passive: true });

  galleryContainer.addEventListener('touchmove', (e) => {
    if (!isDownGallery) return;
    const x = e.touches[0].clientX;
    const walk = (x - startXGallery) * 2;
    galleryContainer.scrollLeft = scrollLeftGallery - walk;
  }, { passive: true });

  galleryContainer.addEventListener('touchend', () => { isDownGallery = false; });

  // ============================
  // Draggable Thumb (Mouse + Touch)
  // ============================
  let isDraggingThumb = false;
  let startXThumb;
  let startLeftThumb;

  function startDrag(clientX) {
    isDraggingThumb = true;
    startXThumb = clientX;
    startLeftThumb = parseFloat(thumb.style.left) || 0;
    document.body.style.userSelect = 'none';
  }

  function stopDrag() {
    isDraggingThumb = false;
    document.body.style.userSelect = '';
  }

  function drag(clientX) {
    if (!isDraggingThumb) return;

    const dx = clientX - startXThumb;
    const newLeft = startLeftThumb + dx;

    const maxThumbLeft = scrollbar.clientWidth - thumb.clientWidth;
    const boundedLeft = Math.max(0, Math.min(newLeft, maxThumbLeft));

    const scrollRatio = boundedLeft / maxThumbLeft;
    const maxScrollLeft = galleryContainer.scrollWidth - galleryContainer.clientWidth;

    galleryContainer.scrollLeft = scrollRatio * maxScrollLeft;
  }

  // Mouse thumb drag
  thumb.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startDrag(e.pageX);
  });
  document.addEventListener('mousemove', (e) => drag(e.pageX));
  document.addEventListener('mouseup', stopDrag);

  // Touch thumb drag
  thumb.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX), { passive: true });
  document.addEventListener('touchmove', (e) => drag(e.touches[0].clientX), { passive: true });
  document.addEventListener('touchend', stopDrag);

  // ============================
  // Update scrollbar and arrows on scroll/resize
  // ============================
  function updateAll() {
    updateScrollbar();
    updateArrows();
  }

  galleryContainer.addEventListener('scroll', updateAll);
  window.addEventListener('resize', updateAll);

  updateAll();

}); // end DOMContentLoaded
