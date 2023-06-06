// Get the postid parameter from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postid');

// Create a new paragraph element
const postElement = document.createElement('p');

// Set the text content of the paragraph to the postid value
postElement.textContent = `Post ID: ${postId}`;

// Append the paragraph element to the body of the HTML document
document.body.appendChild(postElement);
