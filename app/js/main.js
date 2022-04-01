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
    
    initAccordions();
    initMenu();
    initModals();
    initHeroShowMore();
    initMusicListRebuilding();
    initAudioPlayer();
    initExpandCover();
})