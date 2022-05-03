/**
 * File Uploading and Streaming with BinaryJS
 */
'use strict';

var BinaryServer, express, http, path, app, video, server, bs;

BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
http         = require('http');
path         = require('path');
app          = express();
video        = require('./lib/video');
const util = require('util');

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

server = http.createServer(app);

server.listen(3000, function () {
    console.log('Video Server started on http://0.0.0.0:3000');
});

bs = new BinaryServer({ port: 9000 });

bs.on('connection', function (client) {
    console.log('Client conected on http://0.0.0.0:9000');

    // broadcast to all other clients
        for(var id in bs.clients){
          if(bs.clients.hasOwnProperty(id)){

            var otherClient = bs.clients[id];
            console.log(`Id..: ${otherClient.id} Domain..: ${otherClient.domain}` );
          }
        }

    client.on('stream', function (stream, meta) {
        switch(meta.event) {
            // list available videos
            case 'list':
                console.log(`client${client.id} ..:list`);
                video.list(stream, meta);
                break;

            // request for a video
            case 'request':
                console.log(`client${client.id} ..:request`);
                video.request(client, meta);
                break;

            case 'remove':
                console.log(`client${client.id} ..:remove`);
                video.remove(client,meta);
                break;
            case 'moveto':
                console.log(`client${client.id} ..:moveto`);
                video.moveto(client,meta);
                break;
            // attempt an upload
            case 'upload':
            default:
                console.log(`client${client.id} ..:upload`);
                video.upload(stream, meta);
        }
    });
    client.on('close', function () {
      console.log('BinaryJS Server connection closed for client:', (client!=null)?client.id:"Client Not Found");
    });
    client.on('error',function(err){
        console.log(err);
    });
});
