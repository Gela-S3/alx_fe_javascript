// Initial data: an array of quote objects
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Life" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", category: "Education" }
];

// Reference to the DOM elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteButton = document.getElementById('newQuote');
const addQuoteFormContainer = document.getElementById('addQuoteForm');

/**
 * @function showRandomQuote
 * @description Displays a random quote from the quotes array on the page.
 */
function showRandomQuote() {
  // Get a random index from the quotes array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  // Update the quoteDisplay div with the selected quote
  quoteDisplay.innerHTML = `
    <div class="flex flex-col items-center">
      <p id="quoteText" class="text-xl italic text-slate-800">"${randomQuote.text}"</p>
      <p id="quoteCategory" class="text-sm font-semibold text-slate-600 mt-2">(${randomQuote.category})</p>
    </div>
  `;
}

/**
 * @function createAddQuoteForm
 * @description Dynamically creates and appends the "add new quote" form to the DOM.
 */
function createAddQuoteForm() {
  // Create the main form div
  const formDiv = document.createElement('div');
  formDiv.className = "flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full";
  
  // Create the title for the form
  const formTitle = document.createElement('h3');
  formTitle.className = "text-xl font-bold mb-4 text-slate-700";
  formTitle.textContent = "Add a New Quote";

  // Create the text input field for the new quote
  const quoteTextInput = document.createElement('input');
  quoteTextInput.id = "newQuoteText";
  quoteTextInput.type = "text";
  quoteTextInput.placeholder = "Enter a new quote";
  quoteTextInput.className = "w-full p-2 border border-slate-300 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500";

  // Create the category input field for the new quote
  const categoryInput = document.createElement('input');
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  categoryInput.className = "w-full p-2 border border-slate-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500";

  // Create the button to add the new quote
  const addButton = document.createElement('button');
  addButton.textContent = "Add Quote";
  addButton.className = "bg-green-600 text-white w-full rounded-md p-2 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50";

  // Add a click event listener to the "Add Quote" button
  addButton.addEventListener('click', addQuote);

  // Append all elements to the form div
  formDiv.appendChild(formTitle);
  formDiv.appendChild(quoteTextInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  // Append the form div to the main container
  addQuoteFormContainer.appendChild(formDiv);
}

/**
 * @function addQuote
 * @description Adds a new quote to the quotes array from the input fields and updates the DOM.
 */
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  // Simple validation to ensure both fields are filled
  if (newQuoteText && newQuoteCategory) {
    // Create the new quote object
    const newQuote = {
      text: newQuoteText,
      category: newQuoteCategory
    };

    // Add the new quote to the array
    quotes.push(newQuote);

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Display a message and a new random quote, possibly the one just added
    showRandomQuote();
    
  } else {
    // Provide a simple alert for the user if fields are empty
    alert("Please enter both a quote and a category.");
  }
}

// Add event listener to the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Initial actions to run when the page loads
window.onload = function() {
  // Display a random quote when the page first loads
  showRandomQuote();
  // Dynamically create and show the form for adding new quotes
  createAddQuoteForm();
};
