// ==UserScript==
// @name         Rule34 Layout Customizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Customize the layout of Rule34 post pages
// @author       You
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
	'use strict';

	// Function to handle the resizing of the image
	function resizeImage() {
		const image = document.getElementById('image');
		const windowHeight = window.innerHeight;
		const windowWidth = window.innerWidth;
		const commentWidth = windowWidth * 0.20; // 20% width for comments

		image.style.maxHeight = `${windowHeight}px`;
		image.style.maxWidth = `${windowWidth - commentWidth}px`;
	}

	// Create new containers if necessary
	// ...

	// Move existing elements into new containers
	// ...

	// Styling the new containers
	GM_addStyle(`
		#custom-media-container {
			/* Styles for media container */
		}
		#custom-comments-container {
			/* Styles for comments container */
			width: 20%; /* Example percentage width for comments */
		}
		#custom-tags-container {
			/* Styles for tags container */
		}
		/* Add additional styles as needed */
	`);

	// Call resizeImage on window resize
	window.addEventListener('resize', resizeImage);

	// Initial resize
	resizeImage();
})();
