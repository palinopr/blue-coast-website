const express = require('express');
const path = require('path');

const app = express();

// Serve the static site. `extensions: ['html']` enables clean URLs
// (e.g. /servicios resolves to servicios.html).
app.use(
  express.static(__dirname, {
    extensions: ['html'],
    setHeaders: (res, filePath) => {
      if (/\.(?:jpg|jpeg|png|webp|svg|woff2?)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
    },
  })
);

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log(`Blue Coast website listening on port ${port}`);
});
