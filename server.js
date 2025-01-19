const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const Levenshtein = require('levenshtein');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

const intentsPath = path.join(__dirname, 'intents'); // Path to the intents folder

// Predefined set of fallback responses
const fallbackResponses = [
    "We have routed your concern to the relevant officials for handling.",
    "Your request has been passed on to the designated authority for processing.",
    "Action has been initiated by the concerned department for your complaint.",
    "We have referred your issue to the concerned team for necessary action.",
    "Your concern has been directed to the responsible authority for immediate attention.",
    "The matter has been forwarded to the appropriate department for further review.",
    "For necessary action escalated to the concerned official."
];

// Set of greetings
const greetings = ['hi', 'hello', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening', 'howdy'];

// Function to load intents from the intents folder
function loadIntents() {
    const files = fs.readdirSync(intentsPath);
    const intents = [];
    files.forEach(file => {
        const intentData = JSON.parse(fs.readFileSync(path.join(intentsPath, file), 'utf8'));
        intents.push(intentData);
    });
    return intents;
}

const intents = loadIntents();

// Normalize input by removing non-alphanumeric characters and trimming spaces
function normalizeInput(input) {
    return input.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().trim();
}

// Levenshtein similarity check
function isSimilar(input, target) {
    const distance = new Levenshtein(input, target).distance;
    return distance <= 2;  // Allow minor variations
}

// Basic keyword matching (simple form of semantic matching)
function keywordMatch(message, trainingPhrase) {
    const words = trainingPhrase.split(' ');
    return words.some(word => message.includes(word));
}

// Function to find a response based on user input
function findResponse(message) {
    message = normalizeInput(message);  // Normalize user input

    // Check for greetings first (before checking intents)
    if (greetings.some(greeting => isSimilar(message, greeting))) {
        return "Hello! How can I assist you today?";  // Friendly greeting response
    }

    // Check for random symbols or nonsense input (if message is empty or contains only symbols)
    if (!message || /^[^a-zA-Z0-9]+$/.test(message)) {
        return "I'm here to help! Could you please provide more details?";
    }

    // Check intents for matching phrases
    for (const intent of intents) {
        if (intent.responses && intent.responses.length > 0) {
            const trainingPhrasesPath = path.join(intentsPath, `${intent.name}_usersays_en.json`);
            if (fs.existsSync(trainingPhrasesPath)) {
                const trainingPhrases = JSON.parse(fs.readFileSync(trainingPhrasesPath, 'utf8'));
                console.log(`Checking phrases for intent: ${intent.name}`);
                for (const phrase of trainingPhrases) {
                    if (phrase.data && phrase.data.length > 0) {
                        const phraseText = phrase.data.map(part => part.text).join('').toLowerCase().trim();
                        console.log(`Checking phrase: "${phraseText}" against message: "${message}"`);
                        
                        // First, check for exact match
                        if (message === phraseText) {
                            console.log('Exact match found!');
                            return getRandomResponse();
                        }

                        // Then, check for keyword-based match
                        if (keywordMatch(message, phraseText)) {
                            console.log('Keyword match found!');
                            return getRandomResponse();
                        }

                        // Finally, check for fuzzy Levenshtein match
                        if (isSimilar(message, phraseText)) {
                            console.log('Fuzzy match found!');
                            return getRandomResponse();
                        }
                    }
                }
            }
        }
    }
    console.log("No relevant intent found, returning fallback response.");
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];  // Fallback response
}



// Function to return a random response from the predefined set of responses
function getRandomResponse() {
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

app.post('/chat', (req, res) => {
    const userMessage = req.body.message;
    const response = findResponse(userMessage);
    res.json({ reply: response });
});

app.listen(3000, () => console.log('Chatbot running on http://localhost:3000'));
