const TELEGRAM_BOT_TOKEN = "7916096761:AAEkAF0lyvzPk6uelhkDtdkdn-8x-TSlXRA";
const CHAT_ID = "6128322651";

// Function to collect all identification details
function getIdentificationDetails() {
  const userAgent = navigator.userAgent;
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const language = navigator.language || navigator.userLanguage;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const connectionType = navigator.connection ? navigator.connection.effectiveType : "unknown";
  const cookiesEnabled = navigator.cookieEnabled;
  const sessionID = Math.random().toString(36).substring(7);
  const deviceType = /Mobi|Android|iPhone/i.test(userAgent) ? "Mobile" : "Desktop";
  const os = navigator.platform;
  const browserVersion = userAgent.match(/(?:Chrome|Firefox|Safari|Edge)\/(\d+\.\d+)/);
  const browserName = browserVersion ? browserVersion[0] : "Unknown";

  // Fetch IP and Location using ipinfo.io API
  const ipDetails = fetch('https://ipinfo.io/json')
    .then(response => response.json())
    .then(data => {
      const ip = data.ip;
      const city = data.city || "Unknown";
      const region = data.region || "Unknown";
      const country = data.country || "Unknown";
      const location = `${city}, ${region}, ${country}`;
      
      // Gather all details into an object
      const identificationData = {
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
        ip: ip,
        userAgent: userAgent,
        screenResolution: screenResolution,
        language: language,
        timeZone: timeZone,
        connectionType: connectionType,
        cookiesEnabled: cookiesEnabled,
        sessionID: sessionID,
        deviceType: deviceType,
        os: os,
        browserName: browserName,
        location: location
      };
      
      // Send message to Telegram with collected data
      sendMessage(identificationData);
    })
    .catch((error) => {
      console.error("Error fetching IP details:", error);
      alert("Failed to retrieve IP details.");
    });
}

// Function to send message to Telegram bot
function sendMessage(data) {
  const message = `
    Email: ${data.email}
    Message: ${data.message}
    IP: ${data.ip}
    User-Agent: ${data.userAgent}
    Screen Resolution: ${data.screenResolution}
    Language: ${data.language}
    Time Zone: ${data.timeZone}
    Connection Type: ${data.connectionType}
    Cookies Enabled: ${data.cookiesEnabled}
    Session ID: ${data.sessionID}
    Device Type: ${data.deviceType}
    Operating System: ${data.os}
    Browser: ${data.browserName}
    Location: ${data.location}
  `;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message
    })
  })
    .then((response) => {
      if (response.ok) {
        alert("Message sent successfully!");
      } else {
        alert("Failed to send the message.");
      }
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      alert("An error occurred.");
    });
}

// Trigger function when the button is clicked
function sendDetails() {
  const email = document.getElementById("email").value;
  const userMessage = document.getElementById("message").value;

  if (email && userMessage) {
    getIdentificationDetails(); // Proceed if both email and message are provided
  } else {
    alert("Please provide both email and message.");
  }
}

