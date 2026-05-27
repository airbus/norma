import tempfile

from app.tasks.document_processor import extract_text


def test_extract_text_from_txt():
    with tempfile.NamedTemporaryFile(suffix=".txt", mode="w", delete=False) as f:
        f.write("Hello, this is a test document.")
        f.flush()
        text = extract_text(f.name)
    assert text == "Hello, this is a test document."


def test_extract_text_from_md():
    with tempfile.NamedTemporaryFile(suffix=".md", mode="w", delete=False) as f:
        f.write("# Title\n\nSome content here.")
        f.flush()
        text = extract_text(f.name)
    assert "# Title" in text
    assert "Some content here." in text


def test_extract_text_from_csv():
    with tempfile.NamedTemporaryFile(suffix=".csv", mode="w", delete=False) as f:
        f.write("name,value\nfoo,1\nbar,2")
        f.flush()
        text = extract_text(f.name)
    assert "name,value" in text
    assert "foo,1" in text
