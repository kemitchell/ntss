/**
 * Created by XadillaX on 2014/4/7.
 */
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var filename403 = process.cwd() + "//pages//403.ejs";
var filename404 = process.cwd() + "//pages//404.ejs";
var filename502 = process.cwd() + "//pages//502.ejs";

/**
 * show error 403.
 * @param uri
 * @param resp
 */
exports.show403 = function(uri, resp) {
    var filename = filename403;
    fs.readFile(filename, "utf8", function(err, html) {
        if(err) {
            resp.send(502, "502 Error");
        } else {
            try {
                resp.setHeader("content-type", "text/html");
            } catch(e) {
                //...
            }
            resp.send(502, ejs.render(html, { uri: uri }));
        }
    });
};

/**
 * show error 502
 * @param uri
 * @param resp
 */
exports.show502 = function(uri, resp) {
    var filename = filename502;
    fs.readFile(filename, "utf8", function(err, html) {
        if(err) {
            resp.send(502, "502 Error");
        } else {
            try {
                resp.setHeader("content-type", "text/html");
            } catch(e) {
                //...
            }
            resp.send(502, ejs.render(html, { uri: uri }));
        }
    });
};

/**
 * show error 404
 * @param uri
 * @param resp
 */
exports.show404 = function(uri, resp) {
    var filename = filename404;
    fs.readFile(filename, "utf8", function(err, html) {
        if(err) {
            resp.send(404, "404 Error");
        } else {
            try {
                resp.setHeader("content-type", "text/html");
            } catch(e) {
                //...
            }
            resp.send(404, ejs.render(html, { uri: uri }));
        }
    });
};
