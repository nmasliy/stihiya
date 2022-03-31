export function initMenu() {
    const $html = document.querySelector('html');
    const $headerMenu = document.querySelector('.menu');
    const $headerBtn = document.querySelector('.header__burger');
    const $headerBtnCaption = $headerBtn.querySelector('.header__burger-caption');
    const TRANSITION_DELAY = 400; 
    const MOBILE_MENU_BREAKPOINT = 575;
    let isOpen = false;

    function toggleMenu() {
        $headerMenu.classList.contains('active') ? closeMenu() : openMenu();
    }

    function openMenu() {
        if (!isOpen) {
            $headerMenu.style.display = 'flex';
            $headerBtn.classList.add('active');
            $headerBtnCaption.textContent = $headerBtnCaption.dataset.menuActive;

            if (window.innerWidth <= MOBILE_MENU_BREAKPOINT) {
                $html.classList.add('overflow-hidden');
            }

            setTimeout(function() {
                $headerMenu.classList.add('active');
                isOpen = true;
            }, 50)
        }
        
    }

    function closeMenu() {
        $headerMenu.classList.remove('active');
        $headerBtn.classList.remove('active');
        $headerBtnCaption.textContent = $headerBtnCaption.dataset.menuDefault;

        if (window.innerWidth <= MOBILE_MENU_BREAKPOINT) {
            $html.classList.remove('overflow-hidden');
        }
        
        setTimeout(function() {
            $headerMenu.style.display = '';
            isOpen = false;
        }, TRANSITION_DELAY)
    }

    document.body.addEventListener('click', function(e) {
        if (!e.target.closest('.header__burger') && !e.target.closest('.header__menu') && $headerMenu.classList.contains('active')) {
            closeMenu();
        }
    })

    $headerBtn.addEventListener('click', toggleMenu);
}