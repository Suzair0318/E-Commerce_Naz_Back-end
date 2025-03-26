const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Initialize WhatsApp client with session storage
const client = new Client({
  authStrategy: new LocalAuth(), // Saves session automatically
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

client.on("qr", (qr) => {
  console.log("Scan this QR Code to login:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("WhatsApp is ready and session is saved!");
});


module.exports = client;
