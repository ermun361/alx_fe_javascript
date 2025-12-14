// 1. Array of quote objects
let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "The only way to do great work is to love what you do.", category: "Life" },
    { text: "If you can dream it, you can achieve it.", category: "Wisdom" }
];

// 2. Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Check if there are quotes available
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available.</p>";
        return; 
    }

    // Generate a random index
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Display the quote using DOM manipulation
    // FIX: Used .innerHTML instead of .innerText so the <p> tags render correctly
    quoteDisplay.innerHTML = `
        <p><strong>"${randomQuote.text}"</strong></p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;
}

// 3. Function to create the Add Quote Form
function createAddQuoteForm() {
    // Create the container div
    const formContainer = document.createElement('div');
    
    // Add some inline styles/class for layout (optional but looks better)
    formContainer.style.marginTop = "20px";

    // Create input for quote text
    const inputQuote = document.createElement('input');
    inputQuote.id = 'newQuoteText';
    inputQuote.type = 'text';
    inputQuote.placeholder = 'Enter a new quote';

    // Create input for quote category
    const inputCategory = document.createElement('input');
    inputCategory.id = 'newQuoteCategory';
    inputCategory.type = 'text';
    inputCategory.placeholder = 'Enter quote category';

    // Create submit button
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Add Quote'; // .textContent is slightly faster than .innerText
    
    // Attach event listener
    submitButton.addEventListener('click', addQuote);

    // Append inputs and button to the container
    formContainer.appendChild(inputQuote);
    formContainer.appendChild(inputCategory);
    formContainer.appendChild(submitButton);

    // Append the form container to the body
    document.body.appendChild(formContainer);
}

// 4. Function to add a new quote
function addQuote() {
    // FIX: Ensure variable names match what is used in the validation check
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    // Validate inputs
    if (newQuoteText && newQuoteCategory) {
        // Create new quote object
        const newQuote = {
            text: newQuoteText,
            category: newQuoteCategory
        };

        // Add the new quote to the quotes array
        quotes.push(newQuote);

        // Clear input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        alert('New quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

// 5. Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Attach event listener to the "Show New Quote" button
    const newQuoteBtn = document.getElementById('newQuote');
    if(newQuoteBtn) {
        newQuoteBtn.addEventListener('click', showRandomQuote);
    }

    // Create and display the add quote form
    createAddQuoteForm();

    // Show an initial random quote
    showRandomQuote();
});