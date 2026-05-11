document.addEventListener("DOMContentLoaded", function() {
    var links = document.querySelectorAll('a');
    links.forEach(function(link) {
        // Check if the link is external (starts with http)
        if (link.hostname !== window.location.hostname) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener');
        }
    });
});


function applyFilters() {
  const checkboxes = document.querySelectorAll('.filter-panel input[type="checkbox"]');
  const items = document.querySelectorAll('.support-item');

  const activeFilters = [];

  checkboxes.forEach(cb => {
    const label = cb.closest('.filter-option');

    if (cb.checked) {
      activeFilters.push(cb.value);
      label.classList.add('active');
    } else {
      label.classList.remove('active');
    }
  });

  items.forEach(item => {
    if (activeFilters.length === 0) {
      item.style.display = "flex";
      return;
    }

    const matches = activeFilters.some(filter =>
      item.classList.contains(filter)
    );

    item.style.display = matches ? "flex" : "none";
  });
}

function applyProfileFilters() {
  const checkboxes = document.querySelectorAll('.filter-panel input[type="checkbox"]');
  const cards = document.querySelectorAll('.profile-card');

  const filters = {
    type: [],
    access: [],
    system: []
  };

  checkboxes.forEach(cb => {
    const label = cb.closest('.filter-option');

    if (cb.checked) {
      label.classList.add('active');

      if (['sci', 'one-handed'].includes(cb.value)) {
        filters.type.push(cb.value);
      } else if (['alt-access', 'controller-mod', 'software'].includes(cb.value)) {
        filters.access.push(cb.value);
      } else {
        filters.system.push(cb.value);
      }

    } else {
      label.classList.remove('active');
    }
  });

  cards.forEach(card => {
    const matchesType =
      filters.type.length === 0 ||
      filters.type.some(f => card.classList.contains(f));

    const matchesAccess =
      filters.access.length === 0 ||
      filters.access.some(f => card.classList.contains(f));

    const matchesSystem =
      filters.system.length === 0 ||
      filters.system.some(f => card.classList.contains(f));

    const show = matchesType && matchesAccess && matchesSystem;

    card.style.display = show ? "" : "none";
  });
}