export function initAccordions() {
    const $triggers = document.querySelectorAll('.faq__title');

    if ($triggers.length > 0) {
        $triggers.forEach(item => {
            item.addEventListener('click', function() {
                item.closest('.faq__item').classList.toggle('active');
            })
        })
    }
}