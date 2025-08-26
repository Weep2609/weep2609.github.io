var discordWebhook = "https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN";

var msg = "Nội dung rất dài...";

// Tạo file Blob từ nội dung
var blob = new Blob([msg], { type: "text/plain" });
var formData = new FormData();
formData.append("file", blob, "message.txt");

// Gửi POST request
fetch(discordWebhook, {
    method: "POST",
    body: formData
}).then(response => {
    if(response.ok) {
        console.log("Gửi file thành công!");
    } else {
        console.error("Lỗi khi gửi file", response.statusText);
    }
});
