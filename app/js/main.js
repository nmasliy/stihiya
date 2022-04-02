import Swiper, { Navigation } from 'swiper';
import { initAccordions } from './components/accordion.js';
import { initMenu } from './components/menu.js';
import { initModals } from './components/modals.js';

Swiper.use([Navigation]);

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

    function initMusicListRebuilding() {
        const $musicList = document.querySelector('.music__list'); 
        const $musicItems = $musicList.querySelectorAll('.music-item'); 
        const rows = 6;
        const gap = 16;
        const listMinWidth = Math.ceil($musicItems.length / rows) * ($musicItems[0].offsetWidth + gap);
        
        if ($musicList && window.innerWidth <= 1024) {
            $musicList.style.minWidth = listMinWidth + 'px';
            $musicList.classList.add('mobile');
        }

        window.addEventListener('resize', function() {
            if ($musicList.classList.contains('mobile') && window.innerWidth > 1024) {
                $musicList.style.minWidth = '';
                $musicList.classList.remove('mobile');
            } else if (!$musicList.classList.contains('mobile') && window.innerWidth <= 1024) {
                $musicList.style.minWidth = listMinWidth + 'px';
                $musicList.classList.add('mobile');
            }
        })
    }

    function initAudioPlayer() {
        function $(id) { return document.getElementById(id); };
        const media = $('player');

        media.volume = +media.dataset.volume;

        let ui = {
            play: 'playAudio',
            audio: 'player',
            bar: 'player-bar',
            wrapper: 'player-wrapper',
            currentTime: 'currentTime'
        };

        function togglePlay() {
            if (media.paused === false) {
                media.pause();
                $(ui.play).classList.remove('pause');
            } else {
                media.play();
                $(ui.play).classList.add('pause');
            }
        }

        function calculatePercentPlayed() {
            let percentage = (media.currentTime / media.duration).toFixed(2) * 100;
            $(ui.bar).style.width = `${percentage}%`;
        }

        function calculateCurrentValue(currentTime) {
            const currentMinute = parseInt(currentTime / 60) % 60;
            const currentSecondsLong = currentTime % 60;
            const currentSeconds = currentSecondsLong.toFixed();
            const currentTimeFormatted = `${currentMinute < 10 ? `0${currentMinute}` : currentMinute}:${
            currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds
            }`;
        
            return currentTimeFormatted;
        }   

        function initProgressBar() {
            const currentTime = calculateCurrentValue(media.currentTime);
            $(ui.wrapper).addEventListener('click', seek);

            media.onended = () => {
                $(ui.play).classList.remove('pause');
                $(ui.bar).style.width = 0;
            };

            function seek(e) {
                if (!e.target.classList.contains('music__player-btn')) {
                    const percent = e.offsetX / this.offsetWidth;
                    media.currentTime = percent * media.duration;
                }
            }
            
            calculatePercentPlayed();
        }

        $(ui.play).addEventListener('click', togglePlay)
        $(ui.audio).addEventListener('timeupdate', initProgressBar);

        function initTracksSwitch() {
            const $musicList = document.querySelector('.music__list'); 
            const $musicImg = document.querySelector('.music__img img'); 
            
            if ($musicList) {
                $musicList.addEventListener('click', function(e) {
                    if (e.target.closest('.music-item')) {
                        const $item = e.target.closest('.music-item');

                        media.pause();
                        $(ui.play).classList.remove('pause');

                        $musicList.querySelectorAll('.music-item').forEach(el => {
                            el.classList.remove('active');
                        })
    
                        $item.classList.add('active');
                        media.src = $item.dataset.audio;
                        $musicImg.src = $item.dataset.cover;
                        media.play();
                        $(ui.play).classList.add('pause');
                    }
                })
            }
        }
        initTracksSwitch();
    }

    function initExpandCover() {
        const $musicHead = document.querySelector('.music__head'); 
        const $musicInfo = document.querySelector('.music__info'); 

        if (window.innerWidth <= 575 && $musicHead) {
            $musicHead.addEventListener('click', function() {
                $musicInfo.classList.toggle('active');
            })
        }
    }

    function initWaySlider() {
        const swiper = new Swiper('.way__slider', {
            navigation: {
                nextEl: '.way__btn--next',
                prevEl: '.way__btn--prev',
            },
            autoHeight: true
        });
    
        // Custom slider
        const $sliderBar = document.querySelector('#slider-bar');
        const $sliderPanel = document.querySelector('#slider-panel');
        const $sliderImages = document.querySelector('#slider-images');
        const $sliderImagesItems = $sliderImages.querySelectorAll('.slider__img');
        const $sliderMarker = document.querySelector('#slider-marker');
        const IMAGE_SIZE = 1400;
        const FAULT_PERCENT = 22;
    
        function getElementOffsetLeft(element, parent =  $sliderBar) {
            return element.getBoundingClientRect().left - parent.getBoundingClientRect().left;
        }
        
        const $breakpoints = $sliderBar.querySelectorAll('circle');

        $breakpoints.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                console.log('slide to ', index)
                swiper.slideTo(index);
            })
        })
        
        swiper.on('slideChange', function () {
            const dotPosition = getElementOffsetLeft($breakpoints[swiper.activeIndex]);
            const position = +$breakpoints[swiper.activeIndex].getAttribute('cx');
            const imgOffset = IMAGE_SIZE * swiper.activeIndex;
            console.log('active: ' + swiper.activeIndex)
            console.log('imgOffset ' + imgOffset)
    
            $sliderImages.style.left = -imgOffset + 'px';
            $sliderMarker.style.left = dotPosition + 'px';
        });
    
        function initMarker() {
            $sliderMarker.onmousedown = function(event) {
                event.preventDefault(); // предотвратить запуск выделения (действие браузера)
                $sliderImages.style.transition = 'none';
            
                const shiftX = event.clientX - $sliderMarker.getBoundingClientRect().left;
            
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('touchmove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                document.addEventListener('touchend', onMouseUp);
            
                function onMouseMove(event) {
                    
                    let newLeft = event.clientX - shiftX - $sliderBar.getBoundingClientRect().left;
                    // курсор вышел из слайдера => оставить бегунок в его границах.
                    if (newLeft < 0) {
                        newLeft = 0;
                    } else if (newLeft > $sliderPanel.offsetWidth - 30) {
                        newLeft = $sliderPanel.offsetWidth - 30;
                    }

                    let rightEdge = $sliderBar.offsetWidth - $sliderMarker.offsetWidth;

                    if (newLeft > rightEdge) {
                        newLeft = rightEdge;
                    }
    
                    $sliderMarker.style.left = newLeft + 'px';
    
                    $breakpoints.forEach((item, index) => {
                        let dotPosition = getElementOffsetLeft(item);

                        if (dotPosition - newLeft > -30 && dotPosition - newLeft < 30 ) {
                            swiper.slideTo(index);
                        }
                        
                        let imgOffset = newLeft - (newLeft * FAULT_PERCENT) / 100;
                        // $sliderImages.style.left = -imgOffset + 'px';
                    })
                }
            
                function onMouseUp() {
                    document.removeEventListener('mouseup', onMouseUp);
                    document.removeEventListener('mousemove', onMouseMove);
                    $sliderImages.style.transition = '';
                    // TODO: сдвиг панели, дальше середины - вперед, меньше - назад
                }
            };
            
            $sliderMarker.ondragstart = function() {
                return false;
            };
    
            $sliderBar.addEventListener('click', function(event) {
                $sliderMarker.style.left = event.offsetX + 'px';
    
                const shiftX = event.clientX - $sliderMarker.getBoundingClientRect().left;
                let newLeft = event.clientX - shiftX - $sliderBar.getBoundingClientRect().left;
                let markerPosition = Number($sliderMarker.style.left.replace('px',''));
    
                let minDistance = Infinity;
                let nearestDotIndex;
    
                $breakpoints.forEach((item, index) => {
                    let dotPosition = getElementOffsetLeft(item);
                    
                    let imgOffset = newLeft - (newLeft * FAULT_PERCENT) / 100;
                    // $sliderImages.style.left = -imgOffset + 'px';
    
                    let distance = Math.abs(markerPosition - dotPosition);
                    if (distance < minDistance) {
                        nearestDotIndex = index;
                        minDistance = distance;
                    }
                })
                swiper.slideTo(nearestDotIndex);
            })
    
        }
        initMarker();
    }
    
    initAccordions();
    initMenu();
    initModals();
    initHeroShowMore();
    initMusicListRebuilding();
    initAudioPlayer();
    initExpandCover();
    initWaySlider();
})