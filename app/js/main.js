import Swiper, { Navigation } from 'swiper';
import { initAccordions } from './components/accordion.js';
import { initMenu } from './components/menu.js';
import { initModals } from './components/modals.js';
import interact from 'interactjs';

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
        const $sliderPanel = document.querySelector('#slider-panel');
        const $sliderBar = $sliderPanel.querySelector('#slider-bar');
        const $sliderImages = document.querySelector('#slider-images');
        const $sliderImagesItems = $sliderImages.querySelectorAll('.way__img');
        const $sliderMarker = $sliderPanel.querySelector('#slider-marker');
        const $sliderPrevBtn = document.querySelector('.way__btn--prev');
        const $sliderNextBtn = document.querySelector('.way__btn--next');
        
        const IMAGE_SIZE = $sliderImagesItems[0].offsetWidth;

        const $breakpoints = $sliderBar.querySelectorAll('circle');

        const swiper = new Swiper('.way__slider', {
            autoHeight: true,
            allowTouchMove: false,
            on: {
                init: function () {
                    swiperButtonsInit(this);
                },
                slideChange: function () {
                    swiperButtonsInit(this);
                },
            },
        });

        const sliderBarInfo = {
            width: $sliderPanel.offsetWidth,
            img: {
                position: 0,
            },
            marker: {
                position: 0,
                positionPercentage: 0,
                positionOnSegment: 0,
                positionOnSegmentPercentage: 0,
                distance: {
                    nearestPoint: null,
                    siblingPoint: null,
                    prevPoint: null,
                    prevPointPercentage: null,
                },
            },
            activeSegment: {
                distanceBetween: null,
                leftPoint: {
                    index: 0,
                    position: null,
                },
                nearestPoint: {
                    index: 0,
                    position: null,
                },
                siblingPoint: {
                    index: 1,
                    position: null,
                }
            },
        }

        $breakpoints.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                sliderBarInfo.marker.position = +item.getAttribute('cx') - 5;
                sliderBarInfo.marker.positionPercentage = (sliderBarInfo.marker.position  / sliderBarInfo.width) * 100;

                swiper.slideTo(index);

                const imgOffset = IMAGE_SIZE * swiper.activeIndex;
                $sliderImages.style.left = -imgOffset + 'px';
                $sliderMarker.style.paddingLeft = sliderBarInfo.marker.positionPercentage + '%';

            })
        })

        $sliderPrevBtn.addEventListener('click', function() {
            const activeIndex = swiper.activeIndex;
            if (activeIndex > 0) {
                const newIndex = activeIndex - 1;
                onSliderButtonClick(newIndex);
            } else {
                this.classList.add('disabled');
            }
        })

        $sliderNextBtn.addEventListener('click', function() {
            const activeIndex = swiper.activeIndex;

            if (activeIndex < $breakpoints.length - 1) {
                const newIndex = activeIndex + 1;
                onSliderButtonClick(newIndex);
            } else {
                this.classList.add('disabled');
            }
        })

        function swiperButtonsInit(swiper) {
            if (swiper.activeIndex < $breakpoints.length -1) {
                $sliderNextBtn.classList.remove('disabled');
            } else {
                $sliderNextBtn.classList.add('disabled');
            }
            if (swiper.activeIndex > 0) {
                $sliderPrevBtn.classList.remove('disabled');
            } else {
                $sliderPrevBtn.classList.add('disabled');
            }
        }

        function onSliderButtonClick(newIndex) {
            sliderBarInfo.marker.position = +$breakpoints[newIndex].getAttribute('cx');
            sliderBarInfo.marker.positionPercentage = (sliderBarInfo.marker.position  / sliderBarInfo.width) * 100;

            swiper.slideTo(newIndex);

            const imgOffset = IMAGE_SIZE * newIndex;
            $sliderImages.style.left = -imgOffset + 'px';
            $sliderMarker.style.paddingLeft = sliderBarInfo.marker.positionPercentage + '%';
        }
    
        function getElementOffsetLeft(element, parent =  $sliderBar) {
            return element.getBoundingClientRect().left - parent.getBoundingClientRect().left;
        }

        function initMarker() {
            interact($sliderMarker)   
                .draggable({
                    origin: 'self',
                    modifiers: [
                        interact.modifiers.restrict({
                            restriction: 'self',
                        })
                    ]
                })
                .on('dragmove', function (event) { 
                    const sliderWidth = interact.getElementRect(event.target.parentNode).width;
                    const value = (event.pageX / sliderWidth) * 100;

                    event.target.style.paddingLeft = value + '%';
                    $sliderImages.style.transition = 'none';

                    calculateDistance(event);
                    swiper.slideTo(sliderBarInfo.activeSegment.nearestPoint.index);

                })
                .on('dragend', function (event) { 
                    $sliderImages.style.transition = '';
                })
            
            // TODO: сдвиг панели, дальше середины - вперед, меньше - назад

            function calculateDistance(event) {
                let minDistance = Infinity;
                let nearestPointIndex;
                let markerPosition = event.offsetX || event.client.x;
                let nearestPointPosition;
                let markerPositionPercentage = (markerPosition / $sliderPanel.offsetWidth) * 100;

                $sliderMarker.style.paddingLeft = markerPositionPercentage + '%';
    
                $breakpoints.forEach((item, index) => {
                    let pointPosition = getElementOffsetLeft(item);
                    
                    let distance = Math.abs(markerPosition - pointPosition);
                    
                    if (distance < minDistance) {
                        nearestPointIndex = index;
                        minDistance = distance;

                        nearestPointPosition = pointPosition;
                    }
                })

                let siblingPointIndex;
                let siblingPointPosition;
                
                if (markerPosition >= nearestPointPosition) {
                    siblingPointIndex = nearestPointIndex + 1;

                } else {
                    siblingPointIndex = nearestPointIndex - 1;
                }

                if (siblingPointIndex < 0) siblingPointIndex = 0;
                else if (siblingPointIndex >= $breakpoints.length) siblingPointIndex = $breakpoints.length - 1;

                siblingPointPosition = getElementOffsetLeft($breakpoints[siblingPointIndex]);

                let distanceBetween = nearestPointPosition > siblingPointPosition ? nearestPointPosition - siblingPointPosition : siblingPointPosition - nearestPointPosition; // Отнимаем от большего
                let markerToNearest = nearestPointPosition > markerPosition ? nearestPointPosition - markerPosition : markerPosition - nearestPointPosition; // Отнимаем от большего
                let markerToSibling = siblingPointPosition > markerPosition ? siblingPointPosition - markerPosition : markerPosition - siblingPointPosition; // Отнимаем от большего
                let leftPointOffset;
                let leftPointIndex;
                let leftPointPosition;

                if (nearestPointPosition <= markerPosition) {
                    leftPointOffset = markerToNearest;
                    leftPointIndex = nearestPointIndex;
                    leftPointPosition = nearestPointPosition;
                } else {
                    leftPointOffset = markerToSibling;
                    leftPointIndex = siblingPointIndex;
                    leftPointPosition = siblingPointPosition;
                }

                let positionOnSegment = markerPosition - leftPointPosition;
                let positionOnSegmentPercentage = positionOnSegment / distanceBetween * 100;
                let leftPointOffsetPercent = leftPointOffset / distanceBetween * 100;

                let extraOffset = IMAGE_SIZE / 100 * positionOnSegmentPercentage;
                const imgOffset = IMAGE_SIZE  * leftPointIndex + extraOffset;
                $sliderImages.style.left = -imgOffset + 'px';

                // Заполняем объект для удобства хранения данных
                sliderBarInfo.img.position = imgOffset;
                sliderBarInfo.marker.position = markerPosition;
                sliderBarInfo.marker.positionPercentage = markerPositionPercentage;
                sliderBarInfo.marker.positionOnSegment = positionOnSegment;
                sliderBarInfo.marker.positionOnSegmentPercentage = positionOnSegmentPercentage;
                sliderBarInfo.marker.distance.nearestPoint = markerToNearest;
                sliderBarInfo.marker.distance.siblingPoint = markerToSibling;
                sliderBarInfo.marker.distance.prevPoint = leftPointOffset;
                sliderBarInfo.marker.distance.prevPointPercentage = leftPointOffsetPercent;
                sliderBarInfo.activeSegment.distanceBetween = distanceBetween;
                sliderBarInfo.activeSegment.leftPoint.index = leftPointIndex;
                sliderBarInfo.activeSegment.leftPoint.position = leftPointPosition;
                sliderBarInfo.activeSegment.nearestPoint.index = nearestPointIndex;
                sliderBarInfo.activeSegment.nearestPoint.position = nearestPointPosition;
                sliderBarInfo.activeSegment.siblingPoint.index = siblingPointIndex;
                sliderBarInfo.activeSegment.siblingPoint.position = siblingPointPosition;

                // console.log(sliderBarInfo)
            }
    
            $sliderBar.addEventListener('click', function(event) {
                if (event.target.closest('circle')) return false;

                calculateDistance(event);
                
                swiper.slideTo(sliderBarInfo.activeSegment.nearestPoint.index);
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