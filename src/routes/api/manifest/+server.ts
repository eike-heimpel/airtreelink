// src/routes/manifest.json/+server.js
export function GET({ url }) {
    const slug = url.searchParams.get('listingHash');
  
    if (!slug) {
      return new Response('Missing slug parameter', { status: 400 });
    }
  
    const manifest = {
      "name": `Page ${slug}`,
      "short_name": `Page ${slug}`,
      "start_url": `/?slug=${slug}`,
      "display": "standalone",
      "background_color": "#f2f2f2",
      "lang": "en",
      "scope": `./?slug=${slug}`,
      "description": `PWA for page ${slug}`,
      "theme_color": "#65c3c8",
      "icons": [
        {
          "src": "/icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "/icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    };
  
    return new Response(JSON.stringify(manifest), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  