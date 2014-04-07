/**
 * Created by XadillaX on 2014/4/7.
 */
var url = require("url");
var querystring = require("querystring");
var argv = require("optimist").argv;
var path = require("path");
var log4js = require('log4js');
var logger = log4js.getLogger();
var showError = require("./lib/showError");
var showFile =require("./lib/showFile");
var fs = require("fs");
var showList =require("./lib/showList");

var directory = argv.path ? argv.path : ".";
var port = argv.port ? argv.port : 80;
var defaultPage = argv.default ? argv.default : "index.html|index.htm|default.html|default.htm";
var notListIndex = argv.nlist ? argv.nlist : false;

defaultPage = defaultPage.split("|");
directory = path.resolve(process.cwd(), directory);
if(argv.path && argv.path.indexOf("~") === 0) {
    directory = argv.path;
}

function getIp(req) {
    if(req.headers["cf-connecting-ip"]) {
        return req.headers["cf-connecting-ip"];
    } else if(req.headers["x-real-ip"]) {
        return req.headers["x-real-ip"];
    } else {
        return req.socket.remoteAddress;
    }
}

function strengthResp(resp) {
    resp.send = function(status, html) {
        resp.statusCode = status;

        if(typeof html === "object") {
            html = JSON.stringify(html, null, 2);
        }

        if(undefined === resp.getHeader("content-type")) {
            resp.setHeader("content-type", "text/plain");
        }

        resp.setHeader("X-Powered-By", "小鳥遊死月の小型靜態服務器 [https://github.com/XadillaX/ntss] (Node.js " + process.version + ")");
        resp.write(html);
        resp.end();
    }
}

var http = require("http");
http.createServer(function(req, resp) {
    // parse req...
    var u = url.parse(req.url);
    u = {
        originalUrl     : req.url,
        pathname        : "." + u.pathname,
        query           : querystring.parse(u.query),
        sharp           : ""
    };

    var log = "[" + getIp(req) + "] 访问了 \"" + u.originalUrl + "\" 【" + req.headers["user-agent"] + "】";
    logger.trace(log);

    strengthResp(resp);

    // path...
    if(u.pathname.indexOf("/../") !== -1) {
        showError.show404(u, resp);
        return;
    }


    var dir = path.resolve(directory, u.pathname);
    fs.stat(dir, function(err, stats) {
        //console.log(err);
        if(err) {
            if(err.code === "ENOENT") {
                showError.show404(u, resp);
            } else {
                showError.show502(u, resp);
            }
            return;
        }

        // directory...
        if(stats.isDirectory()) {
            for(var i = 0; i < defaultPage.length; i++) {
                var filename = path.normalize(dir + "/" + defaultPage[i]);

                try {
                    stats = fs.statSync(filename);
                    if(stats.isDirectory()) {
                        continue;
                    }

                    //console.log(filename);
                    showFile(filename, u, resp);
                    return;
                } catch(e) {
                    //...
                }
            }

            // ... list
            if(!notListIndex) {
                showList(dir, u, resp);
            } else {
                showError.show403(u, resp);
            }
        } else {
            showFile(dir, u, resp);
        }
    });
}).listen(port);

logger.info("Node Tiny Static Server started at port " + port + ".");
logger.info("Static directory: [ " + directory + " ].");
