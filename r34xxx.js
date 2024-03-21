// ==UserScript==
// @name         Rule34 Layout Customizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Customize the layout of Rule34 post pages
// @author       You
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @icon         https://www.google.com/s2/favicons?sz=256&domain=rule34.xxx
// @grant        GM_addStyle
// ==/UserScript==

(function() {
		'use strict';

	// Creating the main container and sections
	const main_container = document.createElement('div');
	main_container.id = 'custom-layout-container';

	const media_section = document.createElement('div');
	media_section.id = 'custom-media-section';

	const comments_section = document.createElement('div');
	comments_section.id = 'custom-comments-section';

	const metadata_section = document.createElement('div');
	metadata_section.id = 'custom-metadata-section';

	main_container.appendChild(media_section);
	main_container.appendChild(comments_section);
	main_container.appendChild(metadata_section);

	document.body.insertBefore(main_container, document.body.firstChild);

	// After your main_container is inserted

	// Example selectors, these need to be adjusted to match the actual page content
	const existingMedia = document.querySelector('#current-media-selector');
	const existingComments = document.querySelector('#current-comments-selector');
	const existingMetadata = document.querySelector('#current-metadata-selector');

	// Clear out existing sections if needed
	media_section.innerHTML = '';
	comments_section.innerHTML = '';
	metadata_section.innerHTML = '';

	// Append existing content to new sections
	media_section.appendChild(existingMedia);
	comments_section.appendChild(existingComments);
	metadata_section.appendChild(existingMetadata);

	// Additional setup if needed

	// Apply initial styles for the layout
	GM_addStyle(`
		#custom-layout-container {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}
		#custom-media-section {
			flex: 1;
			min-width: 300px; /* Minimum width before switching to vertical layout */
		}
		#custom-comments-section {
			flex: 1;
			max-width: 20%; /* Adjust based on preference */
		}
		#custom-metadata-section {
			width: 100%; /* Full width on horizontal layout */
		}
		/* Media queries for responsiveness */
		@media (max-width: 800px) { /* Adjust the max-width as needed for the switch point */
			#custom-layout-container {
				flex-direction: column;
			}
			#custom-comments-section,
			#custom-metadata-section {
				max-width: 100%;
				order: 2; /* This will put the comments right below the media on smaller screens */
			}
			#custom-metadata-section {
				order: 3; /* Metadata comes last */
			}
		}
	`);

	// Function to handle the dynamic resizing of the image
	function resize_image() {
	// Assuming the media (image or video) is inside the #custom-media-section
	const media_section = document.getElementById('custom-media-section');
	const image = media_section.querySelector('img'); // or the appropriate selector for the media
	const comment_section_width = window.innerWidth * 0.20; // 20% width reserved for comments
	const image_max_width = window.innerWidth - comment_section_width;

	media_section.style.width = `${image_max_width}px`; // Set the media section width
	if (image) {
		image.style.width = '100%'; // Make media width 100% of the container
		image.style.height = 'auto'; // Set media height to auto to maintain aspect ratio
	}

	// Adjust the max height of the media to be no taller than the window height, minus any offsets (like a header or padding)
	const offset = 100; // Change this value to account for any fixed headers or footers
	media_section.style.maxHeight = `${window.innerHeight - offset}px`;
	}

	// Move existing content to the new sections
	function move_content_to_new_layout() {
		// Get the existing content elements by their current IDs or classes
		const existing_media = document.getElementById('existing-media-id'); // Replace with actual selector
		const existing_comments = document.getElementById('existing-comments-id'); // Replace with actual selector
		const existing_metadata = document.getElementById('existing-metadata-id'); // Replace with actual selector
	
		// Append existing content to the custom sections
		const media_section = document.getElementById('custom-media-section');
		const comments_section = document.getElementById('custom-comments-section');
		const metadata_section = document.getElementById('custom-metadata-section');
	
		if (existing_media) media_section.appendChild(existing_media);
		if (existing_comments) comments_section.appendChild(existing_comments);
		if (existing_metadata) metadata_section.appendChild(existing_metadata);
	}

	// When the DOM is fully loaded, move the content and set up the initial resize
	document.addEventListener('DOMContentLoaded', function() {
		move_content_to_new_layout();
		resize_image();
	});

	// Set up listeners for window resize
	window.addEventListener('resize', resize_image);


	// Apply custom styles via GM_addStyle
	GM_addStyle(`
		/* Add styles for the image container if necessary */
		#image-container {
			display: block; /* or 'flex', 'inline-block', etc., depending on your layout */
			overflow: hidden; /* Ensure that the image doesn't overflow its container */
			margin-right: auto; /* Center align the container if you want */
			margin-left: auto; /* Center align the container if you want */
		}
		#image {
			display: block; /* Ensures the image doesn't inline display which could add unwanted space */
			max-width: 100%; /* Limits image width to not exceed its container */
			height: auto; /* Maintains aspect ratio */
		}
	`);

	// Call resize_image on window load and resize
	window.addEventListener('load', resize_image);
	//window.addEventListener('resize', resize_image);

})();
