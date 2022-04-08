import Swiper, { Navigation } from 'swiper';
import { initAccordions } from './components/accordion.js';
import { initMenu } from './components/menu.js';
import interact from 'interactjs';

Swiper.use([Navigation]);

window.addEventListener('DOMContentLoaded', function() {
    let tracks = {};
    let signal = {};
    let signalStartTime = 123;
    
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
            const $author = document.querySelector('.music__title'); 
            const $name = document.querySelector('.music__subtitle'); 
            const $text = document.querySelector('.music__text'); 
            
            if ($musicList) {
                $musicList.addEventListener('click', function(e) {
                    if (e.target.closest('.music-item')) {
                        const $item = e.target.closest('.music-item');
                        const itemData = tracks[$item.dataset.id];

                        media.pause();
                        $(ui.play).classList.remove('pause');

                        $musicList.querySelectorAll('.music-item').forEach(el => {
                            el.classList.remove('active');
                        })

                        $item.closest('.music').dataset.id = $item.dataset.id;
                        $item.classList.add('active');
                        $author.textContent = itemData.author[window.lang];
                        $name.textContent = itemData.name[window.lang];
                        $text.innerHTML = itemData.text[window.lang];
                        media.src = itemData.audioSrc;
                        $musicImg.src = itemData.imgSrc;

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
        const $sliderBody = document.querySelector('.way__body');
        const $sliderImages = document.querySelector('#slider-images');
        const $sliderImagesItems = $sliderImages.querySelectorAll('.way__img');
        const $sliderMarker = $sliderPanel.querySelector('#slider-marker');
        const $sliderMarkerIcon = $sliderMarker.querySelector('.way__label');
        const $sliderPrevBtn = document.querySelector('.way__btn--prev');
        const $sliderNextBtn = document.querySelector('.way__btn--next');
        const $sliderSignal = $sliderPanel.querySelector('#slider-signal');
        
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
            visibleWidth: $sliderBody.offsetWidth,
            startPosition: 130,
            endPosition: 4600,
            position: 130,
            img: {
                position: 0,
            },
            marker: {
                position: 0,
                positionPercentage: 0,
                positionPercentageOnVisible: 0,
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

        if (window.innerWidth <= 575) {
            sliderBarInfo.startPosition = 150;
            sliderBarInfo.endPosition = 5400;
        } else if (window.innerWidth <= 768) {
            sliderBarInfo.endPosition = 5400;
            sliderBarInfo.startPosition = 300;
        }

        sliderBarInfo.position = sliderBarInfo.startPosition;

        $breakpoints.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                sliderBarInfo.marker.position = +item.getAttribute('cx') - 5;
                sliderBarInfo.marker.positionPercentage = (sliderBarInfo.marker.position  / sliderBarInfo.width) * 100;

                swiper.slideTo(index);

                const imgOffset = IMAGE_SIZE * swiper.activeIndex;
                $sliderImages.style.left = -imgOffset + 'px';
                $sliderMarker.style.paddingLeft = sliderBarInfo.marker.positionPercentage + '%';

                calculateSidebarOffset();
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
            sliderBarInfo.marker.position = +$breakpoints[newIndex].getAttribute('cx') - 5;
            sliderBarInfo.marker.positionPercentage = (sliderBarInfo.marker.position  / sliderBarInfo.width) * 100;

            swiper.slideTo(newIndex);

            const imgOffset = IMAGE_SIZE * newIndex;
            $sliderImages.style.left = -imgOffset + 'px';
            $sliderMarker.style.paddingLeft = sliderBarInfo.marker.positionPercentage + '%';
            calculateSidebarOffset();
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
                    ],
                })
                .on('dragmove', function (event) { 
                    const value = (event.pageX / sliderBarInfo.width) * 100;
                    $sliderImages.style.transition = 'none';

                    calculateDistance(event);
                    swiper.slideTo(sliderBarInfo.activeSegment.nearestPoint.index);
                })
                .on('dragend', function (event) { 
                    calculateSidebarOffset();

                    $sliderImages.style.transition = '';
                })

            function calculateDistance(event) {
                let minDistance = Infinity;
                let nearestPointIndex;
                let markerPosition = event.offsetX || event.client.x;
                let nearestPointPosition;
                let markerPositionPercentage = (markerPosition / $sliderPanel.offsetWidth) * 100;
                let positionPercentageOnVisible = (markerPosition / sliderBarInfo.visibleWidth) * 100;

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
                sliderBarInfo.marker.positionPercentageOnVisible = positionPercentageOnVisible;
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
            }

            $sliderBar.addEventListener('click', function(event) {

                if (event.target.closest('circle')) return false;

                calculateDistance(event);
                calculateSidebarOffset();
                
                swiper.slideTo(sliderBarInfo.activeSegment.nearestPoint.index);
            })
        }

        function calculateSidebarOffset() {
            const center = sliderBarInfo.visibleWidth / 2;

            let pos = getElementOffsetLeft($sliderMarkerIcon, $sliderBody);
            let newPos;

            if (pos <= center ) {
                newPos = -(sliderBarInfo.marker.position - center);
            } else {
                newPos = sliderBarInfo.position - (pos - center);
            }

            // Обрабатываем края полоски
            if (newPos >= sliderBarInfo.startPosition) newPos = sliderBarInfo.startPosition;
            else if (newPos <= -sliderBarInfo.endPosition) {
                newPos = -sliderBarInfo.endPosition; 
            }
            $sliderPanel.style.left = newPos + 'px';
            sliderBarInfo.position = newPos;
        }

        function setSignalDistanceKm() {
            const $signalValue = document.querySelector('.header__signal-value');

            $signalValue.textContent = Math.round(signalStartTime * 299792.46);
        }

        function moveSignal() {
            const leftOffset = 4;
            const signalPosition = Math.round(signalStartTime) * 0.00000149870606712821 + leftOffset;
            $sliderSignal.style.left = signalPosition + 'px';
        }
        
        initMarker();
        moveSignal();
        setSignalDistanceKm();
    }

    function initFormValidation() {
        const $form = document.querySelector('#main-form');
        const $audioInput = $form.querySelector('#audio-input');
        const $formBtnText = $form.querySelector('.form__btn-box');

        $audioInput.addEventListener('change', function() {
            if ($audioInput.value.includes('.wav')) {
                $formBtnText.textContent = $audioInput.files.item(0).name;
            } else {
                $audioInput.value = '';
                $formBtnText.textContent = 'Загрузить аудио';
            }
        })

        $form.addEventListener('submit', function(e) {
            if ($audioInput.value.includes('.wav')) {
                $formBtnText.textContent = $audioInput.files.item(0).name;
            } else {
                e.preventDefault();
                $formBtnText.textContent = 'Загрузить аудио';
            }
        })

    }

    function getTracksData() {
        const requestPath = 'files/data/tracks.json';

        return fetch(requestPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(data => {
                tracks = {...data};
            })
            .catch(function (e) {
                console.error('Error: ' + e);
            })
    }

    function getSignalData() {
        const requestPath = 'files/data/signal.json';

        return fetch(requestPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }
                return response.json();
            })
            .then(data => {
                signal = {...data};
            })
            .catch(function (e) {
                console.error('Error: ' + e);
            })
    }

    function initModals() {
        const $modals = document.querySelectorAll('.modal');
        const $modalsTriggers = document.querySelectorAll('[data-micromodal-trigger]');
        let modalDataType;
        let dataBox;
    
        $modalsTriggers.forEach(item => {
            item.addEventListener('click', function(e) {
                if (item.closest('.signal__item')) {
                    modalDataType ='signal';
                    dataBox = item.closest('.signal__item');
                } else if (item.closest('.music')) {
                    modalDataType = 'music';
                    dataBox = item.closest('.music');
                }
                e.preventDefault();
            });
        })
    
        if ($modals.length > 0) {
            MicroModal.init({
                onShow: (modal) => {
    
                    if (modal.id === "modal-1") {
                        const $modalText = modal.querySelector('.modal__text');
                        const $modalDownloadLink = modal.querySelector('.modal__download-btn');
                        const $modalName = modal.querySelector('.modal__filename');
                        let data;

                        if (modalDataType === 'signal') {
                            data = signal;
                        } else if (modalDataType === 'music') {
                            data = tracks;
                        }

                        const itemData = data[dataBox.dataset.id];
                        
                        $modalText.textContent = itemData.code;
                        $modalName.textContent = itemData.filename + '.txt';
                        $modalDownloadLink.href = itemData.link;
                        $modalDownloadLink.download = itemData.filename;
                    }
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

    getTracksData();
    getSignalData();
    initAccordions();
    initMenu();
    initModals();
    initHeroShowMore();
    initMusicListRebuilding();
    initAudioPlayer();
    initExpandCover();
    initWaySlider();
    initFormValidation();
})