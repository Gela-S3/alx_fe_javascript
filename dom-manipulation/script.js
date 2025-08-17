// Initial data: an array of quote objects.
// This is the default data if no quotes are found in local storage.
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
 * @function saveQuotes
 * @description Saves the current quotes array to the browser's local storage.
 * The quotes are converted to a JSON string before saving.
 */
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

/**
 * @function loadQuotes
 * @description Loads quotes from local storage when the application starts.
 * If local storage is empty, the default hardcoded quotes are used.
 */
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    // Parse the JSON string back into a JavaScript array
    quotes = JSON.parse(storedQuotes);
  }
}

/**
 * @function showRandomQuote
 * @description Displays a random quote from the quotes array on the page.
 * Also saves the last viewed quote to session storage.
 */
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = `<p class="text-xl italic text-red-500">No quotes available. Add a new quote!</p>`;
    // Save an empty string to session storage if no quotes exist
    sessionStorage.setItem('lastQuote', '');
    return;
  }
  
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
  
  // Demonstrate the use of session storage by saving the last viewed quote
  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
}

/**
 * @function createAddQuoteForm
 * @description Dynamically creates and appends the "add new quote" form to the DOM,
 * along with the Import and Export functionality.
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
  addButton.addEventListener('click', addQuote);

  // Create the export button
  const exportButton = document.createElement('button');
  exportButton.textContent = "Export Quotes (JSON)";
  exportButton.className = "bg-purple-600 text-white w-full rounded-md p-2 hover:bg-purple-700 mt-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50";
  exportButton.addEventListener('click', exportQuotes);

  // Create the import file input
  const importLabel = document.createElement('label');
  importLabel.textContent = "Import Quotes (JSON)";
  importLabel.className = "block mt-4 text-sm font-medium text-slate-700";
  const importInput = document.createElement('input');
  importInput.id = "importFile";
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.className = "block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 mt-1";
  importInput.onchange = (event) => importFromJsonFile(event);

  // Append all elements to the form div
  formDiv.appendChild(formTitle);
  formDiv.appendChild(quoteTextInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);
  formDiv.appendChild(exportButton);
  formDiv.appendChild(importLabel);
  formDiv.appendChild(importInput);

  // Append the form div to the main container
  addQuoteFormContainer.appendChild(formDiv);
}

/**
 * @function addQuote
 * @description Adds a new quote to the quotes array from the input fields,
 * updates the DOM, and saves the quotes to local storage.
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

    // Save the updated array to local storage
    saveQuotes();

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Display the new quote on the page
    showRandomQuote();
    
  } else {
    // Provide a simple alert for the user if fields are empty
    alert("Please enter both a quote and a category.");
  }
}

/**
 * @function exportQuotes
 * @description Exports the current quotes array to a JSON file and prompts the user to download it.
 */
function exportQuotes() {
  // Convert the quotes array to a JSON string with proper formatting
  const quotesJson = JSON.stringify(quotes, null, 2);
  
  // Create a Blob from the JSON string with the application/json MIME type
  const blob = new Blob([quotesJson], { type: 'application/json' });
  
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json'; // Set the file name for the download
  document.body.appendChild(a);
  a.click(); // Programmatically click the link to trigger download
  document.body.removeChild(a);
  
  // Clean up the temporary URL
  URL.revokeObjectURL(url);
}

/**
 * @function importFromJsonFile
 * @description Reads a JSON file, imports quotes from it, and updates the app.
 * @param {Event} event The change event from the file input.
 */
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      // Parse the JSON string from the file
      const importedQuotes = JSON.parse(event.target.result);
      // Append the imported quotes to the existing quotes array
      quotes.push(...importedQuotes);
      // Save the updated array to local storage
      saveQuotes();
      // Show a random quote to refresh the UI
      showRandomQuote();
      alert('Quotes imported successfully!');
    } catch (e) {
      // Handle potential errors if the file is not a valid JSON
      alert('Error importing file. Please ensure it is a valid JSON format.');
      console.error('JSON parsing error:', e);
    }
  };
  // Read the file as a text string
  fileReader.readAsText(event.target.files[0]);
}

// Add event listener to the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Initial actions to run when the page loads
window.onload = function() {
  // Load quotes from local storage first
  loadQuotes();
  // Display a random quote (will be from local storage if available)
  showRandomQuote();
  // Dynamically create and show the form for adding new quotes
  createAddQuoteForm();
};
