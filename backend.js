var http = require('http')

http.createServer(function(req,res){

    res.end("Test 8080")

}).listen(8080)