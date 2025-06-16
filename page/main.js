// main.js

window.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const paneMap  = new Map(); // Map<label, paneElement>

  // First, collect all pane elements into paneMap:
  navItems.forEach(btn => {
    const label     = btn.getAttribute('data-label');
    const targetId  = btn.getAttribute('data-target');
    const paneEl    = document.getElementById(targetId);
    if (paneEl) {
      paneMap.set(label, paneEl);
      // Ensure each pane is hidden by default (in case CSS changes):
      paneEl.classList.add('hidden');
    }
  });

  // Find specifically the Scope and DSA buttons for mutual exclusion:
  const scopeBtn = Array.from(navItems)
    .find(btn => btn.getAttribute('data-label') === 'Scope');
  const dsaBtn   = Array.from(navItems)
    .find(btn => btn.getAttribute('data-label') === 'Dynamic Singal Analyser');

  // Toggle function: show/hide the target pane without reloading others
  function togglePane(btn) {
    const label  = btn.getAttribute('data-label');
    const paneEl = paneMap.get(label);
    if (!paneEl) return;

    const isVisible = !paneEl.classList.contains('hidden');

    // 1) Prevent opening DSA if Scope is already visible
    if (!isVisible && btn === dsaBtn && 
        paneMap.get('Scope') && !paneMap.get('Scope').classList.contains('hidden')) {
      alert('⚠️ Cannot open Dynamic Singal Analyser while Scope is active.');
      return;
    }
    // 2) Prevent opening Scope if DSA is already visible
    if (!isVisible && btn === scopeBtn && 
        paneMap.get('Dynamic Singal Analyser') && !paneMap.get('Dynamic Singal Analyser').classList.contains('hidden')) {
      alert('⚠️ Cannot open Scope while Dynamic Singal Analyser is active.');
      return;
    }

    // 3) Toggle visibility
    if (isVisible) {
      paneEl.classList.add('hidden');
      btn.classList.remove('active');
    } else {
      paneEl.classList.remove('hidden');
      btn.classList.add('active');
    }
  }

  // Attach click handlers to each navbar button
  navItems.forEach(btn => {
    btn.addEventListener('click', () => {
      togglePane(btn);
    });
  });

  // (Optional) If you want AWG to start visible on page load, uncomment:
  // const awgBtn = Array.from(navItems).find(b => b.getAttribute('data-label') === 'AWG');
  // awgBtn.classList.add('active');
  // paneMap.get('AWG').classList.remove('hidden');
});
