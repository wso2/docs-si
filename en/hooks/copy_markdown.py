import html as html_lib
import os


def on_post_build(config, **kwargs):
    """For every source .md file, create a directory of the same name inside
    the site output containing an index.html that displays the raw markdown as
    plain text.  This makes the URL
        /quick-start-guide/quick-start-guide.md/
    serve an HTML page (no download prompt) on both `mkdocs serve` and
    GitHub Pages.
    """
    docs_dir = config["docs_dir"]
    site_dir = config["site_dir"]

    for root, _dirs, files in os.walk(docs_dir):
        for filename in files:
            if not filename.endswith(".md"):
                continue

            src = os.path.join(root, filename)
            rel = os.path.relpath(src, docs_dir)   # e.g. quick-start-guide/quick-start-guide.md

            # Create  site/<rel>/index.html  (the dir is named *.md)
            dst_dir = os.path.join(site_dir, rel)
            os.makedirs(dst_dir, exist_ok=True)

            with open(src, encoding="utf-8") as f:
                content = f.read()

            page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{html_lib.escape(filename)}</title>
<style>
  body {{
    font-family: monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    padding: 1.5rem;
    margin: 0;
    color: #24292f;
    background: #ffffff;
  }}
</style>
</head>
<body>{html_lib.escape(content)}</body>
</html>"""

            with open(os.path.join(dst_dir, "index.html"), "w", encoding="utf-8") as f:
                f.write(page)
