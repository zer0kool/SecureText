/**
 * Initializes Materialize tabs.
 */
var apptabs = document.querySelectorAll('.tabs');
M.Tabs.init(apptabs, {});

// Define settings object for the page elements
const pageSettings = {
    encrypt: {
        textElementId: '#encryptText',
        keyElementId: '#encryptionKey',
        displayElementId: '#encoded',
        inputTextElement: null,
        encryptionKeyElement: null,
        displayElement: null
    },
    decrypt: {
        textElementId: '#decryptText',
        keyElementId: '#decryptionKey',
        displayElementId: '#decoded',
        inputTextElement: null,
        encryptionKeyElement: null,
        displayElement: null
    }
};

/**
 * Initialize the page settings by querying the DOM for element references.
 */
function initializePageSettings() {
    for (let action in pageSettings) {
        const { textElementId, keyElementId, displayElementId } = pageSettings[action];
        pageSettings[action].inputTextElement = document.querySelector(textElementId);
        pageSettings[action].encryptionKeyElement = document.querySelector(keyElementId);
        pageSettings[action].displayElement = document.querySelector(displayElementId);
    }
}

/**
 * Encrypts a string using AES encryption.
 * @param {string} string - The string to encrypt.
 * @param {string} encryptionKey - The encryption key.
 * @returns {string} The encrypted string.
 * @throws {Error} Throws an error if the input string or encryption key is invalid.
 */
function encryptString(string, encryptionKey) {
    validateInput(string, 'Input string');
    validateInput(encryptionKey, 'Encryption key');

    const encrypted = CryptoJS.AES.encrypt(string, encryptionKey).toString();
    return encrypted;
}

/**
 * Decrypts a string using AES decryption.
 * @param {string} encryptedString - The encrypted string to decrypt.
 * @param {string} encryptionKey - The encryption key.
 * @returns {string} The decrypted string.
 * @throws {Error} Throws an error if the input encrypted string or encryption key is invalid.
 */
function decryptString(encryptedString, encryptionKey) {
    validateInput(encryptedString, 'Encrypted string');
    validateInput(encryptionKey, 'Decryption key');

    const decrypted = CryptoJS.AES.decrypt(encryptedString, encryptionKey).toString(CryptoJS.enc.Utf8);
    return decrypted;
}

/**
 * Validates input string.
 * @param {string} input - The input string to validate.
 * @param {string} inputName - The name of the input (for error messages).
 * @throws {Error} Throws an error if the input is missing or empty.
 */
function validateInput(input, inputName) {
    if (!input || !input.trim()) {
        throw new Error(`${inputName} is required.`);
    }
}

/**
 * Process text, perform encryption/decryption, and display the result.
 * @param {HTMLElement} inputTextElement - The input text element.
 * @param {HTMLElement} encryptionKeyElement - The encryption key element.
 * @param {HTMLElement} displayElement - The display element.
 * @param {Function} processFunction - The function to process the text (encrypt or decrypt).
 * @param {string} processName - The name of the process (encryption or decryption).
 */
function processAndDisplay(inputTextElement, encryptionKeyElement, displayElement, processFunction, processName) {
    // Check if elements exist before accessing their properties
    if (inputTextElement && encryptionKeyElement && displayElement) {
        const inputText = inputTextElement.value;
        const encryptionKey = encryptionKeyElement.value;

        try {
            const processedText = processFunction(inputText, encryptionKey);
            if (processedText == "") {
                displayElement.innerText = "Please check the decryption key or text string and try again.";
            }else{
                displayElement.innerText = processedText;    
            }   
        } catch (error) {
            console.error(`${processName} error:`, error.message);
        }
    } else {
        console.error('One or more required elements are missing.');
    }
}

/**
 * Encrypts text and displays it.
 */
function encryptAndDisplay() {
    const { inputTextElement, encryptionKeyElement, displayElement } = pageSettings.encrypt;
    processAndDisplay(inputTextElement, encryptionKeyElement, displayElement, encryptString, 'Encryption');
}

/**
 * Decrypts text and displays it.
 */
function decryptAndDisplay() {
    const { inputTextElement, encryptionKeyElement, displayElement } = pageSettings.decrypt;
    processAndDisplay(inputTextElement, encryptionKeyElement, displayElement, decryptString, 'Decryption');
}

// Initialize page settings
initializePageSettings();


// Wait for DOM content to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('encryptButton').addEventListener('click', encryptAndDisplay);
    document.getElementById('decryptButton').addEventListener('click', decryptAndDisplay);
});
