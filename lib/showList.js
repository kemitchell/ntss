/**
 * Created by XadillaX on 2014/4/7.
 */
var fs = require("fs");
var ejs = require("ejs");
var async = require("async");
var path = require("path");
var showError = require("./showError");
var html = "";
var listPage = process.cwd() + "//pages//list.ejs";

/**
 * show directory list.
 * @param dir
 * @param resp
 */
module.exports = function(dir, uri, resp) {
    async.series({
        list: function (callback) {
            fs.readdir(dir, function (err, list) {
                callback(err, list);
            })
        },

        html: function(callback) {
            if(!html) {
                fs.readFile(listPage, "binary", function(err, h) {
                    if(err) {
                        callback(err);
                    } else {
                        html = h;
                        callback(null, html);
                    }
                })
            } else {
                callback(null, html);
            }
        }
    }, function(err, result) {
        if(err) {
            showError.show502(uri, resp);
        } else {
            resp.setHeader("content-type", "text/html");
            resp.send(200, ejs.render(result.html, { list: result.list, baseUri: path.normalize(uri.pathname.substr(1)) }));
        }
    });
};
