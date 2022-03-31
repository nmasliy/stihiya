export function initAccordions() {
    const $triggers = document.querySelectorAll('.accordion__item-head');

    if ($triggers.length > 0) {
        $triggers.forEach(item => {
            item.addEventListener('click', function() {
                item.closest('.accordion__item').classList.toggle('active');
                item.closest('.accordion__item').querySelector('.plus').classList.toggle('active');
            })
        })
    }
}