const toggles = document.querySelectorAll('.auth-toggle');
const cards = document.querySelectorAll('.auth-card');

if (toggles.length > 0 && cards.length > 0) {
    const setMode = (targetId) => {
        toggles.forEach((toggle) => {
            toggle.classList.toggle('active', toggle.dataset.target === targetId);
        });

        cards.forEach((card) => {
            card.classList.toggle('active', card.id === targetId);
        });
    };

    toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => setMode(toggle.dataset.target));
    });
}
