// Thiết lập múi giờ (có thể thay đổi theo nhu cầu)
const timeZone = 'Asia/Kolkata';

// Hàm lấy thời gian hiện tại theo định dạng yyyy-mm-dd hh:mm:ss
function getCurrentDate() {
    const now = new Date();
    return now.toLocaleString('sv-SE', { timeZone });
}

// Lấy thông tin User-Agent, IP và endpoint
const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
const user_agent = req.headers['user-agent'];
const endpoint = req.url;

// Nội dung thông báo gửi lên Discord
const log_message = `**Seems like you have a HIT**\n
Date: ${getCurrentDate()}\nIP: ${ip_address}\nUser-Agent: ${user_agent}\nPath: ${endpoint}
\n`;

// URL webhook Discord (thay thế bằng URL của bạn)
const webhook_url = "https://discordapp.com/api/webhooks/1286552704042270791/Eachfj6P1R5gwnd5qxwUEkJuSu2goAHeVUAtkKsrhkR4P8c32ZhYmG6X0RE-qylVMv77";

// Yêu cầu gửi POST đến Discord
const axios = require('axios');

const message = {
    content: log_message
};

axios.post(webhook_url, message, {
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => {
    console.log("Message sent successfully to Discord!");
})
.catch(error => {
    console.error("Failed to send message to Discord:", error);
});

// Nội dung hiển thị trên trang web
console.log("<body><h1>Hit Me Harder :) </h1></body>");
