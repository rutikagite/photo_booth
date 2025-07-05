from flask import Flask, render_template, request, send_file
from PIL import Image
import base64
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    data = request.get_json()
    images_data = data['images']

    images = []
    for img_str in images_data:
        img_bytes = base64.b64decode(img_str.split(',')[1])
        img = Image.open(io.BytesIO(img_bytes))
        images.append(img)

    # Create strip
    widths, heights = zip(*(img.size for img in images))
    total_height = sum(heights)
    max_width = max(widths)

    strip = Image.new("RGB", (max_width, total_height))
    y_offset = 0
    for img in images:
        strip.paste(img, (0, y_offset))
        y_offset += img.height

    buffer = io.BytesIO()
    strip.save(buffer, format="PNG")
    buffer.seek(0)

    return send_file(buffer, mimetype='image/png', download_name="photo-strip.png")

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
