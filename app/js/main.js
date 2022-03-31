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

    function moveElement(element, nextElement, parentElement, wrapper, breakpoint) {
        const $element = document.querySelector(element);
        const $nextElement = document.querySelector(nextElement);
        const $parentElement = document.querySelector(parentElement);
        const $wrapper = document.querySelector(wrapper);

        if ($element) {

            if (window.innerWidth <= breakpoint) {
                $parentElement.insertAdjacentElement('afterbegin', $element);
            } 

            window.addEventListener('resize', function(e) {
                if (window.innerWidth <= breakpoint) {
                    $parentElement.insertAdjacentElement('afterbegin', $element);
                } else {
                    $wrapper.insertBefore($element, $nextElement);
                }
            })
            
        }
    }

    moveElement('.header__text', '.header__burger', '.hero__content', '.header__inner', 575);
    
    initAccordions();
    initMenu();
    initModals();
    initHeroShowMore();
})