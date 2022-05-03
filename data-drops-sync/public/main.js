const {app, BrowserWindow} = require('electron');
  const path = require('path');
  const url = require('url');
  const os = require('os');
  const fs = require('fs');
  const { join } = require('path')
  var log = require('electron-log');
  const electron = require('electron');
  const ipc =  electron.ipcMain
  // Mantenha uma referencia global do objeto da janela, se você não fizer isso, a janela será
  // fechada automaticamente quando o objeto JavaScript for coletado.
  let win

  var syncDir = getDataSyncPath();
  createBaseDirectories(syncDir);
  // Example when handled through fs.watch listener
  fs.watch(syncDir, (eventType, filename) => {
     console.log('event is: ' + eventType);
     if (filename) {
         console.log('filename provided: ' + filename);
     } else {
         console.log('filename not provided');
     }
  });
  fs.watch(join(syncDir,"Data/Image"), (eventType, filename) => {
     console.log('event is: ' + eventType);
     if (filename) {
         console.log('filename provided: ' + filename);
     } else {
         console.log('filename not provided');
     }
  });
  fs.watch(join(syncDir,"Data/Video"), (eventType, filename) => {
     console.log('event is: ' + eventType);
     if (filename) {
         console.log('filename provided: ' + filename);
     } else {
         console.log('filename not provided');
     }
  });
  fs.watch(join(syncDir,"Data/Pdf"), (eventType, filename) => {
     console.log('event is: ' + eventType);
     if (filename) {
         console.log('filename provided: ' + filename);
     } else {
         console.log('filename not provided');
     }
  });
  function getDataSyncPath(){

    var lastpath = 'Data\\Drops\\DropsPlayer\\projects\\sync\\';
    var home = require("os").homedir();
    var userpath = home + '\\Documents\\';
    var fullpath = join(userpath, lastpath);
    console.log("Config path ..:" +fullpath);
    return fullpath;
  }
  
  var config = getConfig();
  if(config!=null){
    process.env.DATA_SERVER_IP = config.server;
    console.log("config DATA_SERVER_IP ..: " + config.server );
  }else{
    console.log("config file not found ! " );
  }

  function createBaseDirectories(syncDir){
    var directories = [
      syncDir,
      join(syncDir,"Data","Image"),
      join(syncDir,"Data","Video"),
      join(syncDir,"Data","Pdf"),
      join(syncDir,"Data","Browser"),
      join(syncDir,"Data","Background"),
      join(syncDir,"Data","Icone")
    ];
    for(var i = 0;  i < directories.length; i++) {
      var projectFolder = directories[i];
      if (!fs.existsSync(projectFolder)) {
        fs.mkdirSync(projectFolder);
        console.log(`Directory : ${projectFolder} created`);
      }else{
        console.log(`Directory already exists: ${projectFolder}`);
      }
    }
  }

  function isDev() {
    return process.mainModule.filename.indexOf('app.asar') === -1;
  }
  function getConfig(){
      var configPath = getConfigFilePath();
      log.info("Init config ..: " +configPath);
      var homedir = os.homedir();
      log.info("User dir ..: "+homedir);
      var serverConfig=fs.readFileSync(configPath, "utf8");
      var config = JSON.parse(serverConfig);
      return config;
  }

  function getConfigFilePath(){
    var configPath = __dirname +"/config.json";
    if(!isDev()){
      console.log("Is not Dev mode");
      var calcpath = __dirname.substring(0, __dirname.length-19);
      configPath = calcpath + "/config.json";
    }else{
      console.log("Dev mode");
    }
    console.log("Config path ..:" +configPath);
    return configPath;
  }

  function createWindow () {
    // Criar uma janela de navegação.
    win = new BrowserWindow({width: 800, height: 600})

    // e carrega index.html do app.
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))

    // Abre o DevTools.
    //  win.webContents.openDevTools()
    // Emitido quando a janela é fechada.
    win.on('closed', () => {
      // Elimina a referência do objeto da janela, geralmente você iria armazenar as janelas
      // em um array, se seu app suporta várias janelas, este é o momento
      // quando você deve excluir o elemento correspondente.
      win = null
    })

  }

  // Este método será chamado quando o Electron tiver finalizado
  // a inicialização e está pronto para criar a janela browser.
  // Algumas APIs podem ser usadas somente depois que este evento ocorre.
  app.on('ready', createWindow)

  // Finaliza quando todas as janelas estiverem fechadas.
  app.on('window-all-closed', () => {
    // No macOS é comum para aplicativos e sua barra de menu
    // permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  })

  ipc.on('check-server-validator', function (event) {
      console.log('Check server ..: ' + config.server + 'port.:'+config.port);
      event.sender.send('check-server-callback', config.server, config.port);
  })
  ipc.on('write-server-validator', function (event, ip,port) {

      console.log('Set server ..: ' + ip + ' port.:'+port);
      var configPath = getConfigFilePath();
      config.server = ip;
      config.port = port;
      fs.writeFileSync(configPath, JSON.stringify(config), 'utf8');
      //event.sender.send('write-server-callback', arg);
  })

  // Neste arquivo, você pode incluir o resto do seu aplicativo especifico do processo
  // principal. Você também pode colocar eles em arquivos separados e requeridos-as aqui.
