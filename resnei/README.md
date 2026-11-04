# ResNei prototype

Small Flask prototype for uploading a Markdown document and rendering it as HTML, with a sample network-graph endpoint.

## Run

```bash
cd resnei
python -m venv .venv
source .venv/bin/activate
pip install flask markdown
python app.py
```

Open http://127.0.0.1:5000.

## Files

- `app.py`: the primary entry point. `template_folder='.'` serves `index.html`; it imports the renderer from `uploads/markdown_renderer.py`.
- `index.html`: the page served at `/`.
- `uploads/markdown_renderer.py`: Markdown-to-HTML renderer and the graph-data endpoint used by the upload route.
- `resnei/resnei/`: a nested duplicate of the prototype. `resnei/resnei/templates/index.html` is byte-identical to `resnei/index.html`, and `resnei/resnei/app.py` differs only in the Flask `template_folder` argument. Prefer the outer `app.py` unless you are specifically reproducing the nested variant.
- `resnei/resnei/uploads/markdown_renderer.py`: duplicate of the outer renderer inside the nested variant.

## Routes

- `GET /`: upload page.
- `POST /render-article`: accepts a Markdown file and returns rendered HTML.
- `GET /network-data`: sample nodes and edges for the graph.

## Notes

The prototype has no pinned dependency file; install `flask` and `markdown` in a local virtual environment. Do not commit uploaded documents or a `.venv`.
