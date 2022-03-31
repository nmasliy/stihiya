export function initModals() {
    const $modals = document.querySelectorAll('.modal');
    const $modalsTriggers = document.querySelectorAll('[data-micromodal-trigger]');

    $modalsTriggers.forEach(item => {
        item.addEventListener('click', (e) => e.preventDefault());
    })

    if ($modals.length > 0) {
        MicroModal.init({
            onShow: (modal) => {
                // Custom events
            },
            onClose: (modal) => {
                // Custom events
            },
            disableFocus: true,
            openClass: 'is-open', 
            awaitOpenAnimation: true, 
            awaitCloseAnimation: true, 
            disableScroll: true
        });
    }
}