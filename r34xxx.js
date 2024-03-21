// ==UserScript==
// @name         Rule34 Layout Customizer
// @namespace    http://tampermonkey.net/
// @version      0.1.7
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

	// Generic constants
	const VIDEO = 'VIDEO'
	const IMAGE = 'IMG'

	// Identify the default media
	const default_media = document.querySelector('video') || document.querySelector('#image');
	const default_type = default_media.tagName;

	const default_type = default_media.tagName;

	// Creating the main container and sections
	const main_container = document.createElement('div');
	main_container.id = 'custom-layout-container';

	const media_section = document.createElement('div');
	media_section.id = 'custom-media-section';

	if (default_type === VIDEO) {
		const video_media = document.createElement('video');
		const video_source = document.createElement('source');

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

	const metadata_section = document.createElement('div');
	metadata_section.id = 'custom-metadata-section';

	main_container.appendChild(media_section);
	main_container.appendChild(comments_section);
	main_container.appendChild(metadata_section);

	document.body.insertBefore(main_container, document.body.firstChild);

	// After your main_container is inserted

	// // Example selectors, these need to be adjusted to match the actual page content
	// const existingMedia = document.querySelector('#current-media-selector');
	// const existingComments = document.querySelector('#current-comments-selector');
	// const existingMetadata = document.querySelector('#current-metadata-selector');

	// // Clear out existing sections if needed
	// media_section.innerHTML = '';
	// comments_section.innerHTML = '';
	// metadata_section.innerHTML = '';

	// // Append existing content to new sections
	// media_section.appendChild(existingMedia);
	// comments_section.appendChild(existingComments);
	// metadata_section.appendChild(existingMetadata);

	// Additional setup if needed

	// Apply initial styles for the layout
	GM_addStyle(`
	#custom-layout-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-start; /* Align items at the top of the container */
	}
	#custom-media-section, #custom-comments-section {
		// Ensure the container itself adjusts to the available space, considering comments section
		flex-grow: 1;
		flex-basis: calc(${100/(Math.pow(5,0.5) * 0.5 + 0.5)}% - ${Math.pow(4, 2)}pt); /* Adjust the width minus the gap */
		max-width: calc(${100/(Math.pow(5,0.5) * 0.5 + 0.5)}% - ${Math.pow(4, 2)}pt); /* Adjust the width minus the gap */
		margin-bottom: ${Math.pow(4, 2)}pt; /* Spacing between sections */
	}
	#custom-comments-section {
		flex-basis: ${100 - 100/(Math.pow(5,0.5) * 0.5 + 0.5)}%;
		max-width: ${100 - 100/(Math.pow(5,0.5) * 0.5 + 0.5)}%;
		margin-left: auto; /* Push the comments to the right */
	}
	#custom-metadata-section {
		width: 100%;
	}
	/* Media queries for responsiveness */
	@media (max-width: 800px) {
		#custom-layout-container {
			flex-direction: column;
		}
		#custom-media-section, #custom-comments-section {
			flex-basis: 100%;
			max-width: 100%;
		}
	}
	`);

	// Function to handle the dynamic resizing of the image
	function resize_image() {
		// Assuming 'custom-media-section' is the container that should be resized
		const media_section = document.getElementById('custom-media-section');
		const media = media_section.children[0];

		if (media) {
			// Set the media to scale within the container
			media.style.maxWidth = '100%';
			media.style.maxHeight = '100%';
			media.style.width = 'auto';
			media.style.height = 'auto';
		}
	}

	/*	
	**	tag edit encoded
	**	MTA4MHAgMWJveSAxZ2lybDFmdXRhIDIwMjQgM2QgNjBmcHMgYW1lbGllX2xhY3JvaXggYW5nZWxhX3ppZWdsZXIgYW5pbGluZ3VzIGFuaW1hdGVkIGFyZW9sYWUgYXNzIGFzc19mb2N1cyBhc3Nfd29yc2hpcCBhdGhsZXRpYyBhdGhsZXRpY19mZW1hbGUgYmFsbHMgYmFsbHNhY2sgYmJ2c2hoIGJpZ19icmVhc3RzIGJpZ19wZW5pcyBibGVuZGVyIGJsaXp6YXJkX2VudGVydGFpbm1lbnQgYmxvbmRlX2ZlbWFsZSBibG9uZGVfaGFpciBibG93am9iIGJsb3dqb2JfZmFjZSBibHVlX3BsYXRlX3NwZWNpYWwgYm9yZGVhdXhfYmxhY2sgYm90dG9tX3ZpZXcgYm91bmNpbmdfYXNzIGJvdW5jaW5nX2JyZWFzdHMgYnJlYXN0cyBjb2NrIGNvY2tfaHVuZ3J5IGNvbGxhYm9yYXRpdmVfZmVsbGF0aW8gY3VtIGN1bV9pbl9tb3V0aCBjdW1zaG90IGN1cnZ5IGN1cnZ5X2JvZHkgY3VydnlfZmVtYWxlIGN1cnZ5X2ZpZ3VyZSBkYXJrLXNraW5uZWRfbWFsZSBkYXJrX3NraW5uZWRfbWFsZSBkYXRfYXNzIGRlZXB0aHJvYXQgZGVsYWxpY2lvdXMzIGR1byBkdW9fZm9jdXMgZWFyX3JpbmcgZWRpdCBldXJvcGVhbiBldXJvcGVhbl9mZW1hbGUgZmVsbGF0aW8gZmVtYWxlIGZlbWFsZV9mb2N1cyBmZW1hbGVfb25seSBmZm1fdGhyZWVzb21lIGZyZW5jaF9mZW1hbGUgZnV0YV9vbl9mZW1hbGUgZnV0YV9vbmx5IGZ1dGFuYXJpIGdhZ2dlZCBoYW5kam9iIGhkIGhlbHBpbmdfaGFuZCBoZW50YXVkaW8gaHVnZV9hc3MgaHVnZV9iYWxscyBodWdlX2JyZWFzdHMgaHVnZV9idXR0IGh1Z2VfY29jayBpbnRlbnNlX3NleCBpbnRlcnJhY2lhbCBqaWdnbGUgamlnZ2xpbmdfYXNzIGppZ2dsaW5nX2JyZWFzdHMgbGFyZ2VfcGVuaXMgbGVob3JueXNmeCBsaWNraW5nIGxpY2tpbmdfYXNzIGxpZ2h0LXNraW5uZWRfZmVtYWxlIGxpZ2h0X3NraW4gbGlwc3RpY2sgbWFsZSBtYWxlX29uX2Z1dGEgbWFsZV9vbmx5IG1hdHVyZSBtYXR1cmVfd29tYW4gbWVyY3kgbWlsZiBtb2FuaW5nIG1vYW5pbmdfaW5fcGxlYXN1cmUgbXA0IG5pY2VfYXNzIG5pcHBsZXMgbnlsX3BoYXJhaCBueWxfd2lkb3dtYWtlciBvcmFsIG9yYWxfc2V4IG92ZXJ3YXRjaCBvdmVyd2F0Y2hfMiBwZW5pcyBwdXJwbGVfYm9keSBwdXJwbGVfaGFpciBwdXJwbGVfc2tpbiByaWRpbmcgcmlkaW5nX3BlbmlzIHJpbWpvYiByaW1taW5nIHJpbW1pbmdfbWFsZSByb3VnaF9vcmFsIHJvdWdoX3NleCBzZWR1Y3RpdmUgc2VkdWN0aXZlX2V5ZXMgc2VkdWN0aXZlX21vdXRoIHNlZHVjdGl2ZV9wb3NlIHNlbnN1YWwgc2xvcHB5IHNsb3BweV9ibG93am9iIHNsdXQgc2x1dHR5X2Nsb3RoaW5nIHNuZWxsdW0gc291bmQgc3Vja2luZyBzdWNraW5nX2JyZWFzdHMgdGVhbXdvcmsgdGhpY2sgdGhpY2tfYXNzIHRoaWNrX2xlZ3MgdGhpY2tfbGlwcyB0aGlja19wZW5pcyB0aGlja190aGlnaHMgdG9uZ3VlIHRvbmd1ZV9vdXQgdmVpbnlfcGVuaXMgdmlkZW8gdm9pY2VfYWN0ZWQgdm9sdXB0dW91cyB2b2x1cHR1b3VzX2ZlbWFsZSB2b2x1cHR1b3VzX2Z1dGFuYXJpIHdpZG93bWFrZXIgZnV0YV9zYW5zX3B1c3N5IGRpY2tnaXJsIG5vX3B1c3N5IG5vX3ZhZ2luYSBmdXRhX3dpdGhfYmFsbHMgZnV0YV9pc19iaWdnZXI
	*/

	// // Determine the width available for the media, considering the comments section
	// const windowWidth = window.innerWidth;
	// const commentSectionWidth = 768 < windowWidth ? windowWidth * 0.2 : 0; // Adjust based on your media query breakpoint
	// // const commentSectionWidth = Math.max(768, windowWidth) * 0.2; // Adjust based on your media query breakpoint
	// const mediaAvailableWidth = windowWidth - commentSectionWidth;

	// // Dynamically adjust the size of the media
	// if (media) {
	// 	media.style.width = '100%'; // Use 100% of the media section width
	// 	media.style.maxWidth = `${mediaAvailableWidth}px`; // Ensure it doesn't exceed the available width
	// 	media.style.height = 'auto'; // Maintain aspect ratio

	// 	// Special handling for videos to ensure they are responsive
	// 	if (default_type === VIDEO) {
	// 		media.style.maxHeight = '100%'; // Limit video height to prevent overflow
	// 	}
	// }

	// const media_section = document.getElementById('custom-media-section');
	// const media = /* Insert initialization code here */ // If a video is found, select for video, else select for an image (only two possible types)
	// const image_container = media_section; // The media section is the container
	// const comment_section_width = window.innerWidth * 0.20; // 20% width reserved for comments
	// const image_max_width = window.innerWidth - comment_section_width;

	// media_section.style.width = `${image_max_width}px`; // Set the media section width
	// if (image) {
	// 	image.style.width = '100%'; // Make media width 100% of the container
	// 	image.style.height = 'auto'; // Set media height to auto to maintain aspect ratio
	// }

	// // Adjust the max height of the media to be no taller than the window height, minus any offsets (like a header or padding)
	// const offset = 100; // Change this value to account for any fixed headers or footers
	// media_section.style.maxHeight = `${window.innerHeight - offset}px`;
	// }

	// // Move existing content to the new sections
	// function move_content_to_new_layout() {
	// 	// Get the existing content elements by their current IDs or classes
	// 	const existing_media = document.getElementById('existing-media-id'); // Replace with actual selector
	// 	const existing_comments = document.getElementById('existing-comments-id'); // Replace with actual selector
	// 	const existing_metadata = document.getElementById('existing-metadata-id'); // Replace with actual selector

	// 	// Append existing content to the custom sections
	// 	const media_section = document.getElementById('custom-media-section');
	// 	const comments_section = document.getElementById('custom-comments-section');
	// 	const metadata_section = document.getElementById('custom-metadata-section');

	// 	if (existing_media) media_section.appendChild(existing_media);
	// 	if (existing_comments) comments_section.appendChild(existing_comments);
	// 	if (existing_metadata) metadata_section.appendChild(existing_metadata);
	// }

	// // When the DOM is fully loaded, move the content and set up the initial resize
	// document.addEventListener('DOMContentLoaded', function () {
	// 	move_content_to_new_layout();
	// 	resize_image();
	// });

	// // Set up listeners for window resize
	// window.addEventListener('resize', resize_image);


	// // Apply custom styles via GM_addStyle
	// GM_addStyle(`
	// 	/* Add styles for the image container if necessary */
	// 	#image-container {
	// 		display: block; /* or 'flex', 'inline-block', etc., depending on your layout */
	// 		overflow: hidden; /* Ensure that the image doesn't overflow its container */
	// 		margin-right: auto; /* Center align the container if you want */
	// 		margin-left: auto; /* Center align the container if you want */
	// 	}
	// 	#image {
	// 		display: block; /* Ensures the image doesn't inline display which could add unwanted space */
	// 		max-width: 100%; /* Limits image width to not exceed its container */
	// 		height: auto; /* Maintains aspect ratio */
	// 	}
	// `);

	// Call resize_image on window load and resize
	window.addEventListener('load', resize_image);
	window.addEventListener('resize', resize_image);

})();
