// ==UserScript==
// @name         GitHub - Make PRs easier to diff
// @namespace    https://github.com/drKnoxy/
// @version      1.2
// @description  Add some functionality to github
// @author       DrKnoxy
// @include      https://github.com/*
// @grant        none
// ==/UserScript==

(function(){


	activate();

	////////////////

	function activate() {
		_monitorHeader();
	}

	function _monitorHeader() {
		document.addEventListener('click', _monitor);

		function _monitor(e){
			var el = e.srcElement;
			var isFileHeader = el.classList.contains('file-header');
			if (!isFileHeader) return;

			var next = el.nextElementSibling;
			if (!next.classList.contains('blob-wrapper')) return;
			toggleVis(next);
		}

		function toggleVis(el) {
			if(el.style.display === '') {
				el.style.display = 'none';
			} else {
				el.style.display = '';
			}
		}
	}

})();
