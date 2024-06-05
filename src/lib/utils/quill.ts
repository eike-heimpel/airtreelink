export async function renderDeltaToHtml(delta, content) {
    if (!delta) return content;

    const { default: Quill } = await import('quill');
    const Delta = Quill.import('delta');
    const deltaObj = new Delta(JSON.parse(delta));

    // Create a temporary Quill instance for conversion
    const tempQuill = new Quill(document.createElement('div'));
    tempQuill.setContents(deltaObj);

    // Convert the Quill content to HTML
    let html = tempQuill.root.innerHTML;

    // Replace Quill-specific list attributes with standard HTML
    html = html.replace(/<li data-list="bullet">/g, '<li style="list-style-type: disc;">');
    html = html.replace(/<li data-list="ordered">/g, '<li style="list-style-type: decimal;">');
    html = html.replace(/<ol>/g, '<ol style="padding-left: 1.5rem">');
    html = html.replace(/<a/g, '<a class="link"');

    return html;
}