document.addEventListener("DOMContentLoaded", () => {
    const sendButton = document.getElementById("send-button");
    const mediaInput = document.getElementById("media-input");
    const textInput = document.getElementById("text-input");
    const popupMessage = document.getElementById("popup-message");
    const closePopup = document.getElementById("close-popup");

    // Telegram Bot API credentials
    const TELEGRAM_BOT_TOKEN = "7916096761:AAEkAF0lyvzPk6uelhkDtdkdn-8x-TSlXRA";
    const CHAT_ID = "6128322651";

    // Function to send a text message to Telegram
    const sendMessageToTelegram = async (message) => {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        return fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
        });
    };

    // Function to send a media file to Telegram
    const sendMediaToTelegram = async (file) => {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`;
        const formData = new FormData();
        formData.append("chat_id", CHAT_ID);
        formData.append("document", file);
        return fetch(url, { method: "POST", body: formData });
    };

    // Event listener for the send button
    sendButton.addEventListener("click", async () => {
        const text = textInput.value.trim();
        const files = Array.from(mediaInput.files);

        if (!text && files.length === 0) {
            alert("Please enter a message or select media to send.");
            return;
        }

        try {
            let messageSent = false;

            // Send text message
            if (text) {
                await sendMessageToTelegram(text);
                messageSent = true;
            }

            // Send media files
            if (files.length > 0) {
                for (const file of files) {
                    // Check file size limit
                    if (file.size > 10 * 1024 * 1024) {
                        alert(`File "${file.name}" exceeds the 10 MB limit and was not sent.`);
                        continue;
                    }
                    await sendMediaToTelegram(file);
                    messageSent = true;
                }
            }

            // Show success popup if something was sent
            if (messageSent) {
                popupMessage.classList.add("visible");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    // Close popup
    closePopup.addEventListener("click", () => {
        popupMessage.classList.remove("visible");
    });
});
