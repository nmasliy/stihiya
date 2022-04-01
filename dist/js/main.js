/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/js/components/accordion.js":
/*!****************************************!*\
  !*** ./app/js/components/accordion.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initAccordions\": function() { return /* binding */ initAccordions; }\n/* harmony export */ });\nfunction initAccordions() {\r\n    const $triggers = document.querySelectorAll('.accordion__item-head');\r\n\r\n    if ($triggers.length > 0) {\r\n        $triggers.forEach(item => {\r\n            item.addEventListener('click', function() {\r\n                item.closest('.accordion__item').classList.toggle('active');\r\n            })\r\n        })\r\n    }\r\n}\n\n//# sourceURL=webpack://dev-gulp/./app/js/components/accordion.js?");

/***/ }),

/***/ "./app/js/components/menu.js":
/*!***********************************!*\
  !*** ./app/js/components/menu.js ***!
  \***********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initMenu\": function() { return /* binding */ initMenu; }\n/* harmony export */ });\nfunction initMenu() {\r\n    const $html = document.querySelector('html');\r\n    const $headerMenu = document.querySelector('.menu');\r\n    const $headerBtn = document.querySelector('.header__burger');\r\n    const $headerBtnCaption = $headerBtn.querySelector('.header__burger-caption');\r\n    const TRANSITION_DELAY = 400; \r\n    const MOBILE_MENU_BREAKPOINT = 575;\r\n    let isOpen = false;\r\n\r\n    function toggleMenu() {\r\n        $headerMenu.classList.contains('active') ? closeMenu() : openMenu();\r\n    }\r\n\r\n    function openMenu() {\r\n        if (!isOpen) {\r\n            $headerMenu.style.display = 'flex';\r\n            $headerBtn.classList.add('active');\r\n            $headerBtnCaption.textContent = $headerBtnCaption.dataset.menuActive;\r\n\r\n            if (window.innerWidth <= MOBILE_MENU_BREAKPOINT) {\r\n                $html.classList.add('overflow-hidden');\r\n            }\r\n\r\n            setTimeout(function() {\r\n                $headerMenu.classList.add('active');\r\n                isOpen = true;\r\n            }, 50)\r\n        }\r\n        \r\n    }\r\n\r\n    function closeMenu() {\r\n        $headerMenu.classList.remove('active');\r\n        $headerBtn.classList.remove('active');\r\n        $headerBtnCaption.textContent = $headerBtnCaption.dataset.menuDefault;\r\n\r\n        if (window.innerWidth <= MOBILE_MENU_BREAKPOINT) {\r\n            $html.classList.remove('overflow-hidden');\r\n        }\r\n        \r\n        setTimeout(function() {\r\n            $headerMenu.style.display = '';\r\n            isOpen = false;\r\n        }, TRANSITION_DELAY)\r\n    }\r\n\r\n    document.body.addEventListener('click', function(e) {\r\n        if (!e.target.closest('.header__burger') && !e.target.closest('.header__menu') && $headerMenu.classList.contains('active')) {\r\n            closeMenu();\r\n        }\r\n    })\r\n\r\n    $headerBtn.addEventListener('click', toggleMenu);\r\n}\n\n//# sourceURL=webpack://dev-gulp/./app/js/components/menu.js?");

/***/ }),

/***/ "./app/js/components/modals.js":
/*!*************************************!*\
  !*** ./app/js/components/modals.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initModals\": function() { return /* binding */ initModals; }\n/* harmony export */ });\nfunction initModals() {\r\n    const $modals = document.querySelectorAll('.modal');\r\n    const $modalsTriggers = document.querySelectorAll('[data-micromodal-trigger]');\r\n\r\n    $modalsTriggers.forEach(item => {\r\n        item.addEventListener('click', (e) => e.preventDefault());\r\n    })\r\n\r\n    if ($modals.length > 0) {\r\n        MicroModal.init({\r\n            onShow: (modal) => {\r\n                // Custom events\r\n            },\r\n            onClose: (modal) => {\r\n                // Custom events\r\n            },\r\n            disableFocus: true,\r\n            openClass: 'is-open', \r\n            awaitOpenAnimation: true, \r\n            awaitCloseAnimation: true, \r\n            disableScroll: true\r\n        });\r\n    }\r\n}\n\n//# sourceURL=webpack://dev-gulp/./app/js/components/modals.js?");

/***/ }),

/***/ "./app/js/main.js":
/*!************************!*\
  !*** ./app/js/main.js ***!
  \************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _components_accordion_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/accordion.js */ \"./app/js/components/accordion.js\");\n/* harmony import */ var _components_menu_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/menu.js */ \"./app/js/components/menu.js\");\n/* harmony import */ var _components_modals_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/modals.js */ \"./app/js/components/modals.js\");\n\r\n\r\n\r\n\r\nwindow.addEventListener('DOMContentLoaded', function() {\r\n    \r\n    function initHeroShowMore() {\r\n        const $heroBtn = document.querySelector('.hero__btn'); \r\n        const $heroInfo = document.querySelector('.hero__info'); \r\n\r\n\r\n        if ($heroBtn && $heroInfo) {\r\n            $heroBtn.addEventListener('click', function(e) {\r\n                e.preventDefault();\r\n\r\n                $heroInfo.classList.add('active');\r\n                this.style.display = 'none';\r\n            })\r\n        }\r\n    }\r\n\r\n    function initMusicListRebuilding() {\r\n        const $musicList = document.querySelector('.music__list'); \r\n        const $musicItems = $musicList.querySelectorAll('.music-item'); \r\n        const rows = 6;\r\n        const gap = 16;\r\n        const listMinWidth = Math.ceil($musicItems.length / rows) * ($musicItems[0].offsetWidth + gap);\r\n        \r\n        if ($musicList && window.innerWidth <= 1024) {\r\n            $musicList.style.minWidth = listMinWidth + 'px';\r\n            $musicList.classList.add('mobile');\r\n        }\r\n\r\n        window.addEventListener('resize', function() {\r\n            if ($musicList.classList.contains('mobile') && window.innerWidth > 1024) {\r\n                $musicList.style.minWidth = '';\r\n                $musicList.classList.remove('mobile');\r\n            } else if (!$musicList.classList.contains('mobile') && window.innerWidth <= 1024) {\r\n                $musicList.style.minWidth = listMinWidth + 'px';\r\n                $musicList.classList.add('mobile');\r\n            }\r\n        })\r\n    }\r\n\r\n    function initAudioPlayer() {\r\n        function $(id) { return document.getElementById(id); };\r\n        const media = $('player');\r\n\r\n        media.volume = +media.dataset.volume;\r\n\r\n        let ui = {\r\n            play: 'playAudio',\r\n            audio: 'player',\r\n            bar: 'player-bar',\r\n            wrapper: 'player-wrapper',\r\n            currentTime: 'currentTime'\r\n        };\r\n\r\n        function togglePlay() {\r\n            if (media.paused === false) {\r\n                media.pause();\r\n                $(ui.play).classList.remove('pause');\r\n            } else {\r\n                media.play();\r\n                $(ui.play).classList.add('pause');\r\n            }\r\n        }\r\n\r\n        function calculatePercentPlayed() {\r\n            let percentage = (media.currentTime / media.duration).toFixed(2) * 100;\r\n            $(ui.bar).style.width = `${percentage}%`;\r\n        }\r\n\r\n        function calculateCurrentValue(currentTime) {\r\n            const currentMinute = parseInt(currentTime / 60) % 60;\r\n            const currentSecondsLong = currentTime % 60;\r\n            const currentSeconds = currentSecondsLong.toFixed();\r\n            const currentTimeFormatted = `${currentMinute < 10 ? `0${currentMinute}` : currentMinute}:${\r\n            currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds\r\n            }`;\r\n        \r\n            return currentTimeFormatted;\r\n        }   \r\n\r\n        function initProgressBar() {\r\n            const currentTime = calculateCurrentValue(media.currentTime);\r\n            $(ui.wrapper).addEventListener('click', seek);\r\n\r\n            media.onended = () => {\r\n                $(ui.play).classList.remove('pause');\r\n                $(ui.bar).style.width = 0;\r\n            };\r\n\r\n            function seek(e) {\r\n                if (!e.target.classList.contains('music__player-btn')) {\r\n                    const percent = e.offsetX / this.offsetWidth;\r\n                    media.currentTime = percent * media.duration;\r\n                }\r\n            }\r\n            \r\n            calculatePercentPlayed();\r\n        }\r\n\r\n        $(ui.play).addEventListener('click', togglePlay)\r\n        $(ui.audio).addEventListener('timeupdate', initProgressBar);\r\n\r\n        function initTracksSwitch() {\r\n            const $musicList = document.querySelector('.music__list'); \r\n            const $musicImg = document.querySelector('.music__img img'); \r\n            \r\n            if ($musicList) {\r\n                $musicList.addEventListener('click', function(e) {\r\n                    if (e.target.closest('.music-item')) {\r\n                        const $item = e.target.closest('.music-item');\r\n\r\n                        media.pause();\r\n                        $(ui.play).classList.remove('pause');\r\n\r\n                        $musicList.querySelectorAll('.music-item').forEach(el => {\r\n                            el.classList.remove('active');\r\n                        })\r\n    \r\n                        $item.classList.add('active');\r\n                        media.src = $item.dataset.audio;\r\n                        $musicImg.src = $item.dataset.cover;\r\n                        media.play();\r\n                        $(ui.play).classList.add('pause');\r\n                    }\r\n                })\r\n            }\r\n        }\r\n        initTracksSwitch();\r\n    }\r\n\r\n    function initExpandCover() {\r\n        const $musicHead = document.querySelector('.music__head'); \r\n        const $musicInfo = document.querySelector('.music__info'); \r\n\r\n        if (window.innerWidth <= 575 && $musicHead) {\r\n            $musicHead.addEventListener('click', function() {\r\n                $musicInfo.classList.toggle('active');\r\n            })\r\n        }\r\n    }\r\n    \r\n    (0,_components_accordion_js__WEBPACK_IMPORTED_MODULE_0__.initAccordions)();\r\n    (0,_components_menu_js__WEBPACK_IMPORTED_MODULE_1__.initMenu)();\r\n    (0,_components_modals_js__WEBPACK_IMPORTED_MODULE_2__.initModals)();\r\n    initHeroShowMore();\r\n    initMusicListRebuilding();\r\n    initAudioPlayer();\r\n    initExpandCover();\r\n})\n\n//# sourceURL=webpack://dev-gulp/./app/js/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./app/js/main.js");
/******/ 	
/******/ })()
;