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
const categoryFilter = document.getElementById('categoryFilter');

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
 * @function populateCategories
 * @description Extracts unique categories from the quotes array and populates the category filter dropdown.
 */
function populateCategories() {
  // Get all unique categories from the quotes array
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  // Clear any existing options in the dropdown, except for the "All" option
  while (categoryFilter.options.length > 1) {
    categoryFilter.remove(1);
  }
  
  // Add each unique category as an option in the dropdown
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

/**
 * @function filterQuotes
 * @description Filters and displays quotes based on the selected category.
 * It also saves the selected category to local storage for persistence.
 */
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('lastCategory', selectedCategory);
  
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p class="text-xl italic text-red-500">No quotes found for this category.</p>`;
    return;
  }

  // Display a random quote from the filtered array
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  
  quoteDisplay.innerHTML = `
    <div class="flex flex-col items-center">
      <p id="quoteText" class="text-xl italic text-slate-800">"${randomQuote.text}"</p>
      <p id="quoteCategory" class="text-sm font-semibold text-slate-600 mt-2">(${randomQuote.category})</p>
    </div>
  `;
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

    // Update the categories in the filter dropdown
    populateCategories();

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
 * @function exportToJsonFile
 * @description Exports the current quotes array to a JSON file and prompts the user to download it.
 */
function exportToJsonFile() {
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
      // Update the categories in the filter dropdown
      populateCategories();
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

/**
 * @function syncWithServer
 * @description Simulates fetching data from a server and syncing it with local quotes.
 * This function also includes a simple conflict resolution strategy.
 */
async function syncWithServer() {
  console.log("Syncing with server...");
  try {
    // Simulate fetching data from a mock API
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const serverQuotes = await response.json();
    
    // Convert mock API response to quote format
    const newServerQuotes = serverQuotes.map(post => ({
      text: post.title,
      category: "Server"
    }));

    let hasConflicts = false;

    // Simple conflict resolution: server data takes precedence.
    // We will merge new quotes from the server that are not already in local storage.
    newServerQuotes.forEach(serverQuote => {
      // Check if a quote with the same text already exists
      const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
      if (!exists) {
        quotes.push(serverQuote);
        hasConflicts = true; // Flag for potential conflicts/updates
      }
    });

    if (hasConflicts) {
      alert("Updates synced from server. Conflicts were resolved by accepting server data.");
    } else {
      console.log("Local data is up-to-date with the server.");
    }
    
    // Save the merged data to local storage
    saveQuotes();
    // Repopulate categories and display quotes with the updated data
    populateCategories();
    filterQuotes();

  } catch (error) {
    console.error("Failed to sync with server:", error);
    alert("Failed to sync with server. Please try again later.");
  }
}

// Add event listener to the "Show New Quote" button
newQuoteButton.addEventListener('click', showRandomQuote);

// Initial actions to run when the page loads
window.onload = function() {
  // Load quotes from local storage first
  loadQuotes();
  // Populate the category filter with available categories
  populateCategories();
  // Restore the last selected filter from local storage
  const lastCategory = localStorage.getItem('lastCategory');
  if (lastCategory) {
    categoryFilter.value = lastCategory;
  }
  // Display a random quote based on the selected filter
  filterQuotes();
  // Sync with the server on page load
  syncWithServer();
  // Periodically sync with the server every 5 minutes
  setInterval(syncWithServer, 300000); 
};
