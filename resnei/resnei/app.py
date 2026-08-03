import os
import random
from flask import Flask, render_template, jsonify, request
from werkzeug.utils import secure_filename
from uploads.markdown_renderer import parse_markdown

app = Flask(__name__, template_folder='templates', static_folder='static')
UPLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

# Sample data for the network graph
def generate_sample_nodes():
    return [{"id": f"paper_{i}", "label": f"Paper {i}", "group": random.randint(1, 5)} for i in range(1, 11)]

def generate_sample_edges():
    return [{"source": f"paper_{random.randint(1, 10)}", "target": f"paper_{random.randint(1, 10)}"} for _ in range(15)]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/render-article', methods=['POST'])
def render_article():
    file = request.files.get('file')
    if not file:
        return jsonify({'error': 'No file uploaded'}), 400

    os.makedirs(UPLOADS_DIR, exist_ok=True)
    file_path = os.path.join(UPLOADS_DIR, secure_filename(file.filename or 'upload.md'))
    file.save(file_path)

    html_output = parse_markdown(file_path)
    return jsonify({'html': html_output})
    
@app.route('/network-data')
def network_data():
    return jsonify({"nodes": generate_sample_nodes(), "edges": generate_sample_edges()})

if __name__ == '__main__':
    app.run(debug=True)