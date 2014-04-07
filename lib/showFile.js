/**
 * Created by XadillaX on 2014/4/7.
 */
var showError = require("./showError");
var fs = require("fs");
var path = require("path");
var mime = require("./mime");

/**
 * show a normal file.
 * @param filename
 * @param uri
 * @param resp
 */
module.exports = function(filename, uri, resp) {
    fs.readFile(filename, { encoding: "binary" }, function(err, html) {
        if(err) {
            showError.show404(resp);
        } else {
            var extName = path.extname(filename).substr(1);
            try {
                if (mime[extName]) {
                    resp.setHeader("content-type", mime[extName]);
                } else {
                    resp.setHeader("content-type", "application/" + extName);
                }
            } catch(e) {
                //...
            }

            resp.statusCode = 200;
            resp.setHeader("X-Powered-By", "Death Moon's Tiny Static Server [https://github.com/XadillaX/ntss] (Node.js " + process.version + ")");
            resp.write(html, "binary");
            resp.end();
        }
    });
};
