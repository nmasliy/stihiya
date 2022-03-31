import { initAccordions } from './components/accordion.js';
import { initMenu } from './components/menu.js';
import { initModals } from './components/modals.js';

window.addEventListener('DOMContentLoaded', function() {
    
    function initHeroShowMore() {
        const $heroBtn = document.querySelector('.hero__btn'); 
        const $heroInfo = document.querySelector('.hero__info'); 


        if ($heroBtn && $heroInfo) {
            $heroBtn.addEventListener('click', function(e) {
                e.preventDefault();

                $heroInfo.classList.add('active');
                this.style.display = 'none';
            })
        }
    }
    
    initAccordions();
    initMenu();
    initModals();
    initHeroShowMore();
})