const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  // Building filepath by going to the public file and then checking if the url is "/" which if it is, then go to the index.html file
  let filePath = path.join(
    __dirname,
    "public",
    req.url === "/" ? "index.html" : `${req.url}.html`
  );

  // If the filePath ends with index.html, extname will equal '.html'
  let extname = path.extname(filePath);
  // Used to indicate the media type of the resource
  let contentType = "text/html";

  /* Checks the extname and sets the content type based on it
     Without using Content-type header we will get the content in bytes, which isn't of use */
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  // Read file (getting the content of the file, and loading it up onto the server)
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // If the page is not found then load up the 404.html file
      if (err.code == "ENOENT") {
        fs.readFile(
          path.join(__dirname, "public", "404.html"),
          (err, content) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content, "utf8");
          }
        );
      } else {
        // 500 - Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Else if there is no error, then load up the relevant file
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf8");
    }
  });
});

const PORT = process.env.PORT || 5000;

// Listens for the PORT and then actually runs the server based on the PORT provided
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
