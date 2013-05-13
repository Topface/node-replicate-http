replicate-http
====

Copy remote files with webdav protocol by urls.

```
npm install replicate-http
```

### Usage

Note that destination must support webdav PUT method.

```javascript
var replicate = require("replicate-http");

replicate("http://pewpewpew.com/passwords.txt", "http://backup.pewpewpew.com/passwords.txt", function() {
    if (error) {
        throw error;
    }

    console.log("File successfully copied!");
});

```

### Authors

* [Ian Babrou](https://github.com/bobrik)
