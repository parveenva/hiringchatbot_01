<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Webchat</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh;
            background-color: #f9f9f9;
        }
        #chatbox {
            width: 400px; height: 600px; border: 1px solid #ccc; border-radius: 10px; background: #fff;
            display: flex; flex-direction: column; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        #messages {
            flex: 1; padding: 10px; overflow-y: auto; border-bottom: 1px solid #ddd;
        }
        #messages div { margin: 5px 0; }
        .user { text-align: right; color: #4a90e2; }
        .bot { text-align: left; color: #555; }
        #inputArea {
            display: flex; padding: 10px; gap: 5px;
        }
        #userInput {
            flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 5px;
        }
        #sendBtn {
            padding: 8px 15px; border: none; background: #4a90e2; color: #fff; border-radius: 5px; cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="chatbox">
        <div id="messages"></div>
        <div id="inputArea">
            <input type="text" id="userInput" placeholder="Type a message..." />
            <button id="sendBtn">Send</button>
        </div>
    </div>

    <script>
        const webhookUrl = "https://hook.make.com/your-webhook-url"; // Replace with your Make.com webhook URL

        const messagesDiv = document.getElementById("messages");
        const inputField = document.getElementById("userInput");
        const sendButton = document.getElementById("sendBtn");

        // Function to add a message to the chat
        function addMessage(content, sender = "bot") {
            const message = document.createElement("div");
            message.className = sender; // "user" or "bot"
            message.textContent = content;
            messagesDiv.appendChild(message);
            messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll
        }

        // Send user message to Make.com webhook
        async function sendMessage() {
            const userMessage = inputField.value.trim();
            if (!userMessage) return;

            addMessage(userMessage, "user"); // Display user message
            inputField.value = ""; // Clear input

            try {
                const response = await fetch(webhookUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: userMessage })
                });

                const data = await response.json();
                addMessage(data.reply || "No response from bot."); // Display bot response
            } catch (error) {
                addMessage("Error connecting to the bot. Please try again later.");
                console.error("Error:", error);
            }
        }

        // Handle Send Button Click
        sendButton.addEventListener("click", sendMessage);

        // Handle Enter Key Press
        inputField.addEventListener("keypress", (event) => {
            if (event.key === "Enter") sendMessage();
        });
    </script>
</body>
</html>