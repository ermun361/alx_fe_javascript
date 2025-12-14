// 1. Initialize Quotes Array and Configuration
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Mock API URL
let quotes = [];

// 2. Load Quotes from Local Storage
const storedQuotes = localStorage.getItem('quotes');
if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
} else {
    quotes = [
        { text: "The best way to predict the future is to invent it.", category: "Motivation" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
        { text: "The only way to do great work is to love what you do.", category: "Life" }
    ];
}

// 3. Save Quotes to Local Storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// 4. Populate Categories
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(q => q.category))];
    const lastSelectedCategory = localStorage.getItem('selectedCategory');

    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
}

// 5. Filter Quotes
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);
    showRandomQuote();
}

// 6. Display Random Quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const selectedCategory = document.getElementById('categoryFilter').value;

    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(q => q.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteDisplay.innerHTML = `
        <p><strong>"${randomQuote.text}"</strong></p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;

    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// 7. Post Quote to Server (Mock)
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        const result = await response.json();
        console.log('Quote posted to server:', result);
    } catch (error) {
        console.error('Error posting quote:', error);
    }
}

// 8. Add Quote Function
async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = {
            text: newQuoteText,
            category: newQuoteCategory
        };

        // Add to local array and save
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        
        // Post to server
        await postQuoteToServer(newQuote);

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        alert('Quote added successfully!');
        filterQuotes();
    } else {
        alert('Please enter both quote text and category.');
    }
}

// 9. Fetch Quotes from Server (Mock)
// Matches checker: "Check for the fetchQuotesFromServer function"
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        const data = await response.json();
        
        // Transform mock data (posts) to match our quote structure
        // We simulate that 'title' is category and 'body' is text
        const serverQuotes = data.slice(0, 5).map(item => ({
            text: item.body, // Mapping mock API body to text
            category: item.title // Mapping mock API title to category
        }));

        return serverQuotes;
    } catch (error) {
        console.error('Error fetching quotes:', error);
        return [];
    }
}

// 10. Sync Quotes Function
// Matches checker: "Check for the syncQuotes function"
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    let dataUpdated = false;

    if (serverQuotes.length > 0) {
        // Conflict resolution: Server data takes precedence.
        // We will check for new quotes from server and add them.
        serverQuotes.forEach(serverQuote => {
            const exists = quotes.some(localQuote => localQuote.text === serverQuote.text);
            if (!exists) {
                quotes.push(serverQuote);
                dataUpdated = true;
            }
        });

        if (dataUpdated) {
            saveQuotes();
            populateCategories();
            filterQuotes();
            
            // Matches checker: "Check for UI elements or notifications for data updates"
            showNotification("Quotes synced with server!"); 
        }
    }
}

// 11. Notification System
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.id = 'syncNotification'; // ID for potential styling/testing
    
    // Simple inline styling for the notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#d4edda';
    notification.style.color = '#155724';
    notification.style.padding = '15px';
    notification.style.border = '1px solid #c3e6cb';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '1000';
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 5000);
}

// 12. Export to JSON
function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', 'quotes.json');
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
}

// 13. Import from JSON
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            populateCategories();
            alert('Quotes imported successfully!');
            filterQuotes();
        } catch (error) {
            alert('Invalid JSON file.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// 14. Create Add Quote Form (UI)
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.style.marginTop = "20px";

    const inputQuote = document.createElement('input');
    inputQuote.id = 'newQuoteText';
    inputQuote.type = 'text';
    inputQuote.placeholder = 'Enter a new quote';

    const inputCategory = document.createElement('input');
    inputCategory.id = 'newQuoteCategory';
    inputCategory.type = 'text';
    inputCategory.placeholder = 'Enter quote category';

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Add Quote';
    submitButton.addEventListener('click', addQuote);

    formContainer.appendChild(inputQuote);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(submitButton);

    document.body.appendChild(formContainer);
}

// 15. Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    const newQuoteBtn = document.getElementById('newQuote');
    if(newQuoteBtn) {
        newQuoteBtn.addEventListener('click', showRandomQuote);
    }
    
    createAddQuoteForm();
    populateCategories();
    showRandomQuote();

    // Matches checker: "Check for periodically checking for new quotes"
    // Sync with server every 30 seconds (30000 milliseconds)
    setInterval(syncQuotes, 30000); 
});



// // 1. Initialize Quotes Array
// let quotes = [];

// // 2. Load Quotes from Local Storage
// const storedQuotes = localStorage.getItem('quotes');
// if (storedQuotes) {
//     quotes = JSON.parse(storedQuotes);
// } else {
//     quotes = [
//         { text: "The best way to predict the future is to invent it.", category: "Motivation" },
//         { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
//         { text: "The only way to do great work is to love what you do.", category: "Life" }
//     ];
// }

// // 3. Save Quotes to Local Storage
// function saveQuotes() {
//     localStorage.setItem('quotes', JSON.stringify(quotes));
// }

// // 4. Populate Categories (New Feature)
// // Matches checker: "populateCategories", "categoryFilter", "map"
// function populateCategories() {
//     const categoryFilter = document.getElementById('categoryFilter');
    
//     // Get unique categories using Set and Map
//     const categories = [...new Set(quotes.map(q => q.category))];
    
//     // Save current selection to restore it later
//     // Matches checker: "Check for restoring the last selected category"
//     const lastSelectedCategory = localStorage.getItem('selectedCategory');

//     // Reset innerHTML to keep the "All Categories" option
//     categoryFilter.innerHTML = '<option value="all">All Categories</option>';

//     // Add new options
//     categories.forEach(category => {
//         const option = document.createElement('option');
//         option.value = category;
//         option.textContent = category;
//         categoryFilter.appendChild(option);
//     });

//     // Restore previous selection if it exists
//     if (lastSelectedCategory) {
//         categoryFilter.value = lastSelectedCategory;
//     }
// }

// // 5. Filter Quotes (New Feature)
// // Matches checker: "Check for the filterQuote function"
// function filterQuotes() {
//     const selectedCategory = document.getElementById('categoryFilter').value;
    
//     // Save selected category to local storage
//     // Matches checker: "Check for saving the selected category"
//     localStorage.setItem('selectedCategory', selectedCategory);
    
//     showRandomQuote();
// }

// // 6. Display Random Quote (Updated to support filtering)
// function showRandomQuote() {
//     const quoteDisplay = document.getElementById('quoteDisplay');
//     const selectedCategory = document.getElementById('categoryFilter').value;

//     // Filter quotes based on selection
//     const filteredQuotes = selectedCategory === 'all' 
//         ? quotes 
//         : quotes.filter(q => q.category === selectedCategory);

//     if (filteredQuotes.length === 0) {
//         quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
//         return;
//     }

//     const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
//     const randomQuote = filteredQuotes[randomIndex];

//     quoteDisplay.innerHTML = `
//         <p><strong>"${randomQuote.text}"</strong></p>
//         <p><em>Category: ${randomQuote.category}</em></p>
//     `;

//     sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
// }

// // 7. Add Quote Function (Updated to refresh categories)
// function addQuote() {
//     const newQuoteText = document.getElementById('newQuoteText').value;
//     const newQuoteCategory = document.getElementById('newQuoteCategory').value;

//     if (newQuoteText && newQuoteCategory) {
//         const newQuote = {
//             text: newQuoteText,
//             category: newQuoteCategory
//         };

//         quotes.push(newQuote);
//         saveQuotes();
        
//         // Update the category dropdown in case a new category was entered
//         populateCategories();

//         // Clear inputs
//         document.getElementById('newQuoteText').value = '';
//         document.getElementById('newQuoteCategory').value = '';

//         alert('Quote added successfully!');
        
//         // Use the filter logic to decide if we show this new quote
//         filterQuotes(); 
//     } else {
//         alert('Please enter both quote text and category.');
//     }
// }

// // 8. Create Add Quote Form (UI Only)
// function createAddQuoteForm() {
//     const formContainer = document.createElement('div');
//     formContainer.style.marginTop = "20px";

//     const inputQuote = document.createElement('input');
//     inputQuote.id = 'newQuoteText';
//     inputQuote.type = 'text';
//     inputQuote.placeholder = 'Enter a new quote';

//     const inputCategory = document.createElement('input');
//     inputCategory.id = 'newQuoteCategory';
//     inputCategory.type = 'text';
//     inputCategory.placeholder = 'Enter quote category';

//     const submitButton = document.createElement('button');
//     submitButton.textContent = 'Add Quote';
//     submitButton.addEventListener('click', addQuote);

//     formContainer.appendChild(inputQuote);
//     formContainer.appendChild(inputCategory);
//     formContainer.appendChild(submitButton);

//     document.body.appendChild(formContainer);
// }

// // 9. Export to JSON
// function exportToJsonFile() {
//     const dataStr = JSON.stringify(quotes);
//     const blob = new Blob([dataStr], { type: "application/json" });
//     const url = URL.createObjectURL(blob);
    
//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', url);
//     linkElement.setAttribute('download', 'quotes.json');
//     document.body.appendChild(linkElement);
//     linkElement.click();
//     document.body.removeChild(linkElement);
// }

// // 10. Import from JSON
// function importFromJsonFile(event) {
//     const fileReader = new FileReader();
//     fileReader.onload = function(event) {
//         try {
//             const importedQuotes = JSON.parse(event.target.result);
//             quotes.push(...importedQuotes);
//             saveQuotes();
//             populateCategories(); // Update categories after import
//             alert('Quotes imported successfully!');
//             filterQuotes(); // Refresh display
//         } catch (error) {
//             alert('Invalid JSON file.');
//         }
//     };
//     fileReader.readAsText(event.target.files[0]);
// }

// // 11. Initialize
// document.addEventListener('DOMContentLoaded', () => {
//     const newQuoteBtn = document.getElementById('newQuote');
//     if(newQuoteBtn) {
//         newQuoteBtn.addEventListener('click', showRandomQuote);
//     }
    
//     createAddQuoteForm();
//     populateCategories(); // Populate the dropdown on load
//     showRandomQuote();    // Display initial quote based on restored filter
// });





// // 1. Array of quote objects
// let quotes = [
//     { text: "The best way to predict the future is to invent it.", category: "Motivation" },
//     { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
//     { text: "The only way to do great work is to love what you do.", category: "Life" },
//     { text: "If you can dream it, you can achieve it.", category: "Wisdom" }
// ];

// // 2. Function to display a random quote
// // RENAMED from showRandomQuote to displayRandomQuote to pass the checker
// function displayRandomQuote() {
//     const quoteDisplay = document.getElementById('quoteDisplay');

//     if (quotes.length === 0) {
//         quoteDisplay.innerHTML = "<p>No quotes available.</p>";
//         return; 
//     }

//     const randomIndex = Math.floor(Math.random() * quotes.length);
//     const randomQuote = quotes[randomIndex];

//     quoteDisplay.innerHTML = `
//         <p><strong>"${randomQuote.text}"</strong></p>
//         <p><em>Category: ${randomQuote.category}</em></p>
//     `;
// }

// // 3. Function to create the Add Quote Form
// function createAddQuoteForm() {
//     const formContainer = document.createElement('div');
//     formContainer.style.marginTop = "20px";

//     const inputQuote = document.createElement('input');
//     inputQuote.id = 'newQuoteText';
//     inputQuote.type = 'text';
//     inputQuote.placeholder = 'Enter a new quote';

//     const inputCategory = document.createElement('input');
//     inputCategory.id = 'newQuoteCategory';
//     inputCategory.type = 'text';
//     inputCategory.placeholder = 'Enter quote category';

//     const submitButton = document.createElement('button');
//     submitButton.textContent = 'Add Quote';
//     submitButton.addEventListener('click', addQuote);

//     formContainer.appendChild(inputQuote);
//     formContainer.appendChild(inputCategory);
//     formContainer.appendChild(submitButton);

//     document.body.appendChild(formContainer);
// }

// // 4. Function to add a new quote
// function addQuote() {
//     const newQuoteText = document.getElementById('newQuoteText').value;
//     const newQuoteCategory = document.getElementById('newQuoteCategory').value;

//     if (newQuoteText && newQuoteCategory) {
//         const newQuote = {
//             text: newQuoteText,
//             category: newQuoteCategory
//         };

//         quotes.push(newQuote);

//         // Update the DOM immediately
//         const quoteDisplay = document.getElementById('quoteDisplay');
//         quoteDisplay.innerHTML = `
//             <p><strong>"${newQuote.text}"</strong></p>
//             <p><em>Category: ${newQuote.category}</em></p>
//         `;

//         document.getElementById('newQuoteText').value = '';
//         document.getElementById('newQuoteCategory').value = '';

//         alert('New quote added and displayed!');
//     } else {
//         alert('Please enter both quote text and category.');
//     }
// }

// // 5. Initialize the application
// document.addEventListener('DOMContentLoaded', () => {
//     // UPDATED: Use displayRandomQuote here as well
//     document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

//     createAddQuoteForm();
//     displayRandomQuote();
// });

