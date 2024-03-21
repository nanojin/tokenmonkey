// ==UserScript==
// @name         Rule34 Layout Customizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Customize the layout of Rule34 post pages
// @author       You
// @match        https://rule34.xxx/index.php?page=post&s=view&id=*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Your code here.
        
        // Create new containers
        let mediaContainer = document.createElement('div');
        let commentsContainer = document.createElement('div');
        let tagsContainer = document.createElement('div');
        let relatedPostsContainer = document.createElement('div');

        // Add IDs or classes to new containers for styling
        mediaContainer.id = 'custom-media-container';
        commentsContainer.id = 'custom-comments-container';
        tagsContainer.id = 'custom-tags-container';
        relatedPostsContainer.id = 'custom-related-posts-container';

        // Identify existing elements by their classes or IDs
        // This is where you'll need to pull specific selectors from the page
        let media = document.querySelector('#media-selector');
        let comments = document.querySelector('#comments-selector');
        let tags = document.querySelector('#tags-selector');
        let relatedPosts = document.querySelector('#related-posts-selector');

        // Move elements into new containers
        // Append the media to the mediaContainer
        // Append the comments to the commentsContainer
        // Append the tags to the tagsContainer
        // Append the related posts to the relatedPostsContainer

        // Insert the new containers into the page
        // You'll need to identify where you want to insert them

        // Apply additional styling if necessary
    });
})();
