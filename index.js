(function(module) {
    var http = require("http"),
        url  = require("url");

    module.exports = function(from, to, cb) {
        var toUrl    = url.parse(to),
            returned = false,
            put;

        function callback(error) {
            if (returned) {
                return;
            }

            returned = true;
            cb(error);
        }

        http.get(from, function(res) {
            res.on("error", callback);

            if (res.statusCode != 200) {
                res.on("end", function() {
                    callback(new Error("Got http code " + res.statusCode + " for " + from));
                });

                // suck stream in
                res.resume();
            } else {
                put = http.request({
                    host    : toUrl.hostname,
                    port    : toUrl.port,
                    method  : "PUT",
                    path    : toUrl.path,
                    headers : {
                        "Content-Length": res.headers['content-length']
                    }
                });

                put.on("response", function(res) {
                    if (res.statusCode != 201 && res.statusCode != 204) {
                        res.on("end", function() {
                            callback(new Error("HTTP put failed with code " + res.statusCode + " for " + to));
                        });
                    } else {
                        res.on("end", callback);
                    }

                    // suck stream in
                    res.resume();
                });

                put.on("error", function(error) {
                    // because we need to put it somewhere
                    res.unpipe(put);
                    res.resume();

                    callback(error);
                });

                res.pipe(put);
            }
        }).on("error", callback);
    };
})(module);
