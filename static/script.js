const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

async function startCapture() {
  let images = [];

  for (let i = 0; i < 3; i++) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let imgData = canvas.toDataURL("image/png");
    images.push(imgData);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 sec
  }

  fetch("/upload", {
    method: "POST",
    body: JSON.stringify({ images }),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.blob())
  .then(blob => {
    const url = URL.createObjectURL(blob);
    const img = document.getElementById("result");
    img.src = url;

    // Optional: auto-download
    const link = document.createElement("a");
    link.href = url;
    link.download = "photo-strip.png";
    link.textContent = "📥 Click to Download Photo Strip";
    document.body.appendChild(link);
  });
}
