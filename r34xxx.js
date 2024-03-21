// ==UserScript==
// @name         Rule34 Layout Customizer
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  Customize the layout of Rule34 post pages
// @author       You
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @icon         https://www.google.com/s2/favicons?sz=256&domain=rule34.xxx
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/nanojin/tokenmonkey/master/r34xxx.js
// @downloadURL    https://raw.githubusercontent.com/nanojin/tokenmonkey/master/r34xxx.js
// ==/UserScript==

(function () {
	'use strict';

	// Function to adjust video properties
	// function adjust_video_properties() {
	// 	const video = document.getElementById('custom-media'); // Ensure this ID matches your video element
	// 	if (video && video.tagName === 'VIDEO') {
	// 		video.autoplay = true;
	// 		video.loop = true;
	// 		video.controls = true;
	// 		video.volume = 0.0625; // Set volume to 1/16
	// 	}
	// }

	const minify = it => it.replace(/\s+/g, ' ')

	// Generic constants
	const VIDEO = 'VIDEO'
	const IMAGE = 'IMG'

	const PHI = 1 / (Math.pow(5, 0.5) * 0.5 + 0.5)
	const CONTENT_WIDTH = 100 * PHI
	const COMMENT_WIDTH = 100 * (1 - PHI)

	// Identify the default media
	const default_media = document.querySelector('video') || document.querySelector('#image');
	const default_type = default_media.tagName;

	const default_comments = document.querySelector('#post-comments');
	const default_metadata = document.querySelector('#tag-sidebar');

	// Creating the main container and sections
	const main_container = document.createElement('div');
	main_container.id = 'custom-layout-container';
	const left_container = document.createElement('div');
	left_container.id = 'layout-left';
	const right_container = document.createElement('div');
	right_container.id = 'layout-right';

	main_container.appendChild(left_container);
	main_container.appendChild(right_container);

	const media_section = document.createElement('div');
	media_section.id = 'custom-media-section';

	if (default_type === VIDEO) {
		const video_media = document.createElement('video');
		const video_source = document.createElement('source');

		// adjust_video_properties()
		video_media.autoplay = true;
		video_media.loop = true;
		video_media.controls = true;
		video_media.volume = 0.0625; // Set volume to 1/16
		
		video_source.src = document.querySelector('video#gelcomVideoPlayer > source').src; /* should contain the url from the default_media source child element */

		video_media.appendChild(video_source)
		media_section.appendChild(video_media)

		// Delete the #gelcomVideoPlayer
		document.querySelector('#gelcomVideoContainer').remove()
	} else {
		media_section.appendChild(default_media)
	}

	media_section.children[0].id = 'custom-media'

	const comments_section = document.createElement('div');
	comments_section.id = 'custom-comments-section';

	comments_section.appendChild(default_comments);

	const metadata_section = document.createElement('div');
	metadata_section.id = 'custom-metadata-section';

	metadata_section.appendChild(default_metadata);

	left_container.appendChild(media_section);
	right_container.appendChild(comments_section);
	right_container.appendChild(metadata_section);

	document.body.insertBefore(main_container, document.body.firstChild);

	// Additional setup if needed

	// Apply initial styles for the layout
	GM_addStyle(minify(`
		#custom-layout-container {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: flex-start; /* Align items at the top of the container */
			padding: ${1}vh ${1}em;
			max-height: calc(100vh - 2 * 1vh); /* Adjust the height minus padding */
		}
		#layout-left, #layout-left #custom-media-section {
			/* Ensure the container itself adjusts to the available space, considering comments section */
			flex-grow: 0;
			flex-shrink: 1;
			flex-basis: fit-content;
			max-width: calc(${CONTENT_WIDTH}% - 0.5vw); /* Adjust the width minus the gap */
			max-height: inherit;
			margin-bottom: 1vh; /* Spacing between sections */
			/*align-self: left;*/
		}
		#layout-right {
			flex-basis: calc(${COMMENT_WIDTH}% - 0.5vw);
			max-width: ${COMMENT_WIDTH}%;
			margin: auto; /* Push the comments to the right */
			margin-top: 0px; /* Push the comments to the right */
			align-self: stretch;
		}
		#custom-metadata-section, #custom-comments-section {
			width: 100%;
		}
		#custom-media {
			max-width: 100%;
			max-height: inherit;
			width: auto;
			height: auto;
		}
		/* Media queries for responsiveness */
		@media (max-width: 1024px) {
			#custom-layout-container {
				flex-direction: column;
			}
			#layout-left, #layout-right {
				flex-basis: 100%;
				max-width: 100%;
				margin: unset;
			}
		}
	`));

	// Call adjust_video_properties on window load to apply these settings to the video
	// window.addEventListener('load', adjust_video_properties);

	// // Function to handle the dynamic resizing of the image
	// function resize_image() {
	// 	// Assuming 'custom-media-section' is the container that should be resized
	// 	const media_section = document.getElementById('custom-media-section');
	// 	const media = media_section.children[0];

	// 	if (media) {
	// 		// Set the media to scale within the container
	// 		media.style.maxWidth = '100%';
	// 		media.style.maxHeight = '100%';
	// 		media.style.width = 'auto';
	// 		media.style.height = 'auto';
	// 	}
	// }
	// // Call resize_image on window load and resize
	// window.addEventListener('load', resize_image);
	// window.addEventListener('resize', resize_image);

	/*
	 * *	tag edit encoded
	 **	MTA4MHAgMWJveSAxZ2lybDFmdXRhIDIwMjQgM2QgNjBmcHMgYW1lbGllX2xhY3JvaXggYW5nZWxhX3ppZWdsZXIgYW5pbGluZ3VzIGFuaW1hdGVkIGFyZW9sYWUgYXNzIGFzc19mb2N1cyBhc3Nfd29yc2hpcCBhdGhsZXRpYyBhdGhsZXRpY19mZW1hbGUgYmFsbHMgYmFsbHNhY2sgYmJ2c2hoIGJpZ19icmVhc3RzIGJpZ19wZW5pcyBibGVuZGVyIGJsaXp6YXJkX2VudGVydGFpbm1lbnQgYmxvbmRlX2ZlbWFsZSBibG9uZGVfaGFpciBibG93am9iIGJsb3dqb2JfZmFjZSBibHVlX3BsYXRlX3NwZWNpYWwgYm9yZGVhdXhfYmxhY2sgYm90dG9tX3ZpZXcgYm91bmNpbmdfYXNzIGJvdW5jaW5nX2JyZWFzdHMgYnJlYXN0cyBjb2NrIGNvY2tfaHVuZ3J5IGNvbGxhYm9yYXRpdmVfZmVsbGF0aW8gY3VtIGN1bV9pbl9tb3V0aCBjdW1zaG90IGN1cnZ5IGN1cnZ5X2JvZHkgY3VydnlfZmVtYWxlIGN1cnZ5X2ZpZ3VyZSBkYXJrLXNraW5uZWRfbWFsZSBkYXJrX3NraW5uZWRfbWFsZSBkYXRfYXNzIGRlZXB0aHJvYXQgZGVsYWxpY2lvdXMzIGR1byBkdW9fZm9jdXMgZWFyX3JpbmcgZWRpdCBldXJvcGVhbiBldXJvcGVhbl9mZW1hbGUgZmVsbGF0aW8gZmVtYWxlIGZlbWFsZV9mb2N1cyBmZW1hbGVfb25seSBmZm1fdGhyZWVzb21lIGZyZW5jaF9mZW1hbGUgZnV0YV9vbl9mZW1hbGUgZnV0YV9vbmx5IGZ1dGFuYXJpIGdhZ2dlZCBoYW5kam9iIGhkIGhlbHBpbmdfaGFuZCBoZW50YXVkaW8gaHVnZV9hc3MgaHVnZV9iYWxscyBodWdlX2JyZWFzdHMgaHVnZV9idXR0IGh1Z2VfY29jayBpbnRlbnNlX3NleCBpbnRlcnJhY2lhbCBqaWdnbGUgamlnZ2xpbmdfYXNzIGppZ2dsaW5nX2JyZWFzdHMgbGFyZ2VfcGVuaXMgbGVob3JueXNmeCBsaWNraW5nIGxpY2tpbmdfYXNzIGxpZ2h0LXNraW5uZWRfZmVtYWxlIGxpZ2h0X3NraW4gbGlwc3RpY2sgbWFsZSBtYWxlX29uX2Z1dGEgbWFsZV9vbmx5IG1hdHVyZSBtYXR1cmVfd29tYW4gbWVyY3kgbWlsZiBtb2FuaW5nIG1vYW5pbmdfaW5fcGxlYXN1cmUgbXA0IG5pY2VfYXNzIG5pcHBsZXMgbnlsX3BoYXJhaCBueWxfd2lkb3dtYWtlciBvcmFsIG9yYWxfc2V4IG92ZXJ3YXRjaCBvdmVyd2F0Y2hfMiBwZW5pcyBwdXJwbGVfYm9keSBwdXJwbGVfaGFpciBwdXJwbGVfc2tpbiByaWRpbmcgcmlkaW5nX3BlbmlzIHJpbWpvYiByaW1taW5nIHJpbW1pbmdfbWFsZSByb3VnaF9vcmFsIHJvdWdoX3NleCBzZWR1Y3RpdmUgc2VkdWN0aXZlX2V5ZXMgc2VkdWN0aXZlX21vdXRoIHNlZHVjdGl2ZV9wb3NlIHNlbnN1YWwgc2xvcHB5IHNsb3BweV9ibG93am9iIHNsdXQgc2x1dHR5X2Nsb3RoaW5nIHNuZWxsdW0gc291bmQgc3Vja2luZyBzdWNraW5nX2JyZWFzdHMgdGVhbXdvcmsgdGhpY2sgdGhpY2tfYXNzIHRoaWNrX2xlZ3MgdGhpY2tfbGlwcyB0aGlja19wZW5pcyB0aGlja190aGlnaHMgdG9uZ3VlIHRvbmd1ZV9vdXQgdmVpbnlfcGVuaXMgdmlkZW8gdm9pY2VfYWN0ZWQgdm9sdXB0dW91cyB2b2x1cHR1b3VzX2ZlbWFsZSB2b2x1cHR1b3VzX2Z1dGFuYXJpIHdpZG93bWFrZXIgZnV0YV9zYW5zX3B1c3N5IGRpY2tnaXJsIG5vX3B1c3N5IG5vX3ZhZ2luYSBmdXRhX3dpdGhfYmFsbHMgZnV0YV9pc19iaWdnZXI
	 */


})();
