
$(document).ready(function () {
    const ipc = null; 
    if(isElectron()){
        ipc = require('electron').ipcRenderer
    }
    
    var $video, $box, $progress, $list;
    
    var ipServer = "";
    var portServer = "";
    $('#example').on('submit',function(){
          var ipText = $('#ip').val();
          
          var validIP = false; 
           console.log('ipText..: ' + ipText);
          var ipParts = ipText.split(".");
          console.log('ipparts..: ' + ipParts.length);
          if(ipParts.length==4){
            for(i=0;i<4;i++){

              theNum = parseInt(ipParts[i]);
              if(theNum >= 0 && theNum <= 255){}
              else{break;}

            }
            if(i==4)validIP=true; 
          }
          console.log('ipvalid..: ' + validIP);
          if(validIP){
              $('#ip').css("border-color", "cyan");
              ipServer = ipText;
              portServer = $('#port').val();
              if(ipc){
                ipc.send('write-server-validator',ipServer,portServer);
              }else{
                //client = new BinaryClient('ws://'+ipServer+':'+portServer);
                //client.open();
              }
          }else{
              $('#ip').css("border-color", "red");
          }
        //return (validIP);
      });
  if(isElectron()){
        ipc.on('check-server-callback', function (event, server,port) {
            //const message = `Playing: ${comm}`
                console.log("Sessiong ip server.:"+server);
                $('#ip').val(server);
                $('#port').val(port);
                ipServer = server;
                portServer = port;
                client = new BinaryClient('ws://'+ipServer+':'+portServer);
                // video.list(setupList);

                //$box.on('dragenter', fizzle);
                //$box.on('dragover', fizzle);
                //$box.on('drop', setupDragDrop);

                console.log('client open...');

        });
        ipc.send('check-server-validator');
    }else{
          //client = new BinaryClient('ws://'+ipServer+':'+portServer);
          //client.open();
    }

 
    

    $video    = $('#video');
    $imageview    = $('#imageview');
    $box      = $('#upload-box');
    $progress = $('#progress');
    $list     = $('#list');
    $message =$('#message');

    $video.attr({
        controls : true,
        autoplay : true
    });
    if(client!=null){
  //var client = new BinaryClient('ws://'+ipServer+':9000');
  client.on('open', function (err) {

    if(err){
       //$list.empty();
       console.log(err);
       //$list.empty();
       //$message.css("color", "green");
       //$message.text('Conexão estabelecida!') 
       $message.css("color", "red");
       $message.text('Verifique se o servidor e a porta foram liberados corretamente!') 
    }else{
      try{
      video.list(setupList);

      $box.on('dragenter', fizzle);
      $box.on('dragover', fizzle);
      $box.on('drop', setupDragDrop);
      
      $message.css("color", "green");
      $message.text('Conexão estabelecida!') 
      console.log('client open...');
      }catch(err2){
        console.log(err2);
        $message.css("color", "red");
       $message.text('Verifique se o servidor e a porta foram liberados corretamente!') 
      }
    }

});

client.on('error', function (err) {
   //$list.empty();
       $message.css("color", "red");
       $message.text('Verifique se o servidor e a porta foram liberados corretamente!') 
});
client.on('stream', function (stream) {
    video.download(stream, function (err, src) {

        $video.attr('src', src);
        $imageview.attr('src', src);

    });
});
    }
  

    function isElectron() {
        // Renderer process
        if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
            return true;
        }
    
        // Main process
        if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
            return true;
        }
    
        // Detect the user agent when the `nodeIntegration` option is set to true
        if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
            return true;
        }
    
        return false;
    }

    function setupList(err, files) {
        var $ul, $li;

        $list.empty();

        $ul   = $('<ul>').appendTo($list);
        if(files!=null){
          files.forEach(function (file) {
              $li = $('<li>').appendTo($ul);
              $div = $('<div class="row">').appendTo($li);
              $div1 = $('<div class="col-sm-7">').appendTo($div);
              $div2 = $('<div class="col-sm-3">').appendTo($div);
              $div3 = $('<div class="col-sm-2">').appendTo($div);
              $a  = $('<a>').appendTo($div1);
              $a.attr('href', '#').text(file.file).click(function (e) {
                  fizzle(e);
                  var name = $(this).text();
                  video.request(name);
              });

              $selector = $('<select>');
              $selector.on('change', function (e) {
                  fizzle(e);
                  console.log('File ' + file.file + '..:'+ $(this).val());
                  video.moveto(file.file,$(this).val());
              });

              $selector.appendTo($div2);
              var options = ['Arquivo', 'Background', 'Icone'];
              for(var i =0;i<options.length;i++){
                $op = $('<option>'+options[i]+'</option>');
                $op.appendTo($selector);
              }
              $selector.val(file.folder);
              var $removeButton = $('<button>X</button>');
              $removeButton.appendTo($div3);
              $removeButton.on('click', function (e) {
                  fizzle(e);
                  var name = file.file;
                  var folder = file.folder;
                  video.remove(name,folder);
                  //$li.remove();
                  video.list(setupList);
              });
          });
        }else{
          $li = $('<li>').appendTo($ul);
          $div = $('<div class="row">Nenhum item listado</div>').appendTo($li);
          
        }

    }

    function setupDragDrop(e) {
        fizzle(e);

        var files = e.originalEvent.dataTransfer.files;
        for(var i=0 ;i<files.length;i++){
            var file = files[i];
            var tx   = 0;

            video.upload(file, function (err, data) {
                var msg;

                if (data.end) {
                    msg = "Upload complete: " + file.name;
                    tx = 0;
                    video.list(setupList);
                } else if (data.rx) {
                      msg = Math.round(tx += data.rx * 100) + '% complete';
                } else {
                    // assume error
                    tx = 0;
                    msg = data.err;
                }

                $progress.text(msg);

                if (data.end || data.err) {
                    setTimeout(function () {
                        $progress.fadeOut(function () {
                            $progress.text('Drop file here');
                        }).fadeIn();
                    }, 5000);
                }
            });
        }

    }




 
 

});
 
