const video = document.getElementById("qr-video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

let scanning = false;

// カメラから映像を取得する関数
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        scanning = true;
        scanQRCode();
    } catch (error) {
        console.error("カメラを起動できませんでした: ", error);
    }
}

// QRコードをスキャンする関数
function scanQRCode() {
    if (video.readyState === video.HAVE_ENOUGH_DATA && scanning) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            scanning = false;
            displayQRCodeData(code.data);
        } else {
            requestAnimationFrame(scanQRCode);
        }
    } else {
        requestAnimationFrame(scanQRCode);
    }
}

// QRコードのデータを表示する関数
function displayQRCodeData(data) {
    const resultElement = document.getElementById("result");
    resultElement.textContent = `QRコードデータ: ${data}`;

    // データがURL形式であれば、リンクを開くボタンを表示
    if (isValidURL(data)) {
        const openLinkButton = document.getElementById("open-link-button");
        openLinkButton.style.display = "block";

        // ボタンがクリックされたらリンクを開く
        openLinkButton.addEventListener("click", () => {
            window.location.href = data;
        });
    }
}

// 文字列が有効なURLかどうかを確認する関数
function isValidURL(str) {
    const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return pattern.test(str);
}

// カメラを起動する
startCamera();
