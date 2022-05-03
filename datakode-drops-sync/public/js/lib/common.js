var hostname, client;
$.ajax({
    url: "config.json",
    dataType: "json",
    success: function(response) {
      /*$.each(response.Users, function(item) {
        informationArray.push(item);
      });
      informationArray.push("success");*/
      const config = response;

      hostname =  config.server;
      port = config.port;
      client   = new BinaryClient('ws://' + hostname + ':'+port);
      $('#ip').val(hostname);
      $('#port').val(port);
          
   
    }
  });
//hostname = window.location.hostname;
//hostname =  process.env.DATA_SERVER_IP;
//client   = new BinaryClient('ws://' + hostname + ':9000');

function fizzle(e) {
    e.preventDefault();
    e.stopPropagation();
}

function emit(event, data, file) {
    file       = file || {};
    data       = data || {};
    data.event = event;

    return client.send(file, data);
}
