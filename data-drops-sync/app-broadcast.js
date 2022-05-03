var BinaryServer = require('binaryjs').BinaryServer;

binaryHandler = {
  server: null,

  init: function (server) {
    this.server = new BinaryServer({server: server, path: '/binary-endpoint'});
  },

  eventHandler: function(client, server, console){
    console.log('Binary Server connection started');

    client.on('stream', function(stream, meta) {
      if (meta.data === 'audio') {
        console.log('>>>Incoming audio stream');

        // broadcast to all other clients
        for(var id in server.clients){
          if(server.clients.hasOwnProperty(id)){
            var otherClient = server.clients[id];
            if(otherClient != client){
              var send = otherClient.createStream(meta);
              stream.pipe(send);
            } // if (otherClient...
          } // if (binaryserver...
        } // for (var id in ...

        stream.on('end', function() {
          console.log('||| Audio stream ended');
        });
      } else {
        // console.log('.');
      }
    });

  client.on('close', function () {
    console.log('BinaryJS Server connection closed for client:', client.id);
  })

  }

};

module.exports = binaryHandler;
