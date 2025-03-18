from flask import Flask, render_template, jsonify
import random

app = Flask(__name__, template_folder='templates', template_folder='uploads', static_folder='static')

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
    
    file_path = f"uploads/{file.filename}"
    file.save(file_path)
    
    html_output = parse_markdown(file_path)
    return jsonify({'html': html_output})
    
@app.route('/network-data')
def network_data():
    return jsonify({"nodes": generate_sample_nodes(), "edges": generate_sample_edges()})

if __name__ == '__main__':
    app.run(debug=True)