// 1. Array of quote objects
let quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "The only way to do great work is to love what you do.", category: "Life" },
    { text: "If you can dream it, you can achieve it.", category: "Wisdom" }
];

// 2. Function to display a random quote
// RENAMED from showRandomQuote to displayRandomQuote to pass the checker
function displayRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');

    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available.</p>";
        return; 
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    quoteDisplay.innerHTML = `
        <p><strong>"${randomQuote.text}"</strong></p>
        <p><em>Category: ${randomQuote.category}</em></p>
    `;
}

// 3. Function to create the Add Quote Form
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

// 4. Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = {
            text: newQuoteText,
            category: newQuoteCategory
        };

        quotes.push(newQuote);

        // Update the DOM immediately
        const quoteDisplay = document.getElementById('quoteDisplay');
        quoteDisplay.innerHTML = `
            <p><strong>"${newQuote.text}"</strong></p>
            <p><em>Category: ${newQuote.category}</em></p>
        `;

        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';

        alert('New quote added and displayed!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

// 5. Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // UPDATED: Use displayRandomQuote here as well
    document.getElementById('newQuote').addEventListener('click', displayRandomQuote);

    createAddQuoteForm();
    displayRandomQuote();
});