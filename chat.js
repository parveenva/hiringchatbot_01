// chat.js
const messagesDiv = document.getElementById("messages");
const inputField = document.getElementById("userInput");
const sendButton = document.getElementById("sendBtn");

/**
 * Add a message to the chat window
 * @param {string} content - The message content
 * @param {string} sender - The sender type ('user' or 'bot')
 */
function addMessage(content, sender = "bot") {
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    message.textContent = content;
    messagesDiv.appendChild(message);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the latest message
}

/**
 * Send the user's message to the webhook and handle the response
 */
async function sendMessage() {
    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, "user"); // Display the user's message
    inputField.value = ""; // Clear input field

    try {
        // Send message to the webhook
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        });

        // Check the response type
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
            // Handle JSON response
            const data = await response.json();
            addMessage(data.reply || "No response received.");
        } else {
            // Handle plain text response
            const text = await response.text();
            addMessage(text || "No response received.");
        }
    } catch (error) {
        addMessage("Error connecting to the server. Please try again later.");
    }
}

// Event listeners
sendButton.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});
