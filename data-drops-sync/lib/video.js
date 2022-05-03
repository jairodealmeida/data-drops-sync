/**
 * Manages uploading and streaming of video files.
 *
 * @module video
 */
'use strict';

var fs, uploadPath, supportedVideoTypes,supportedImageTypes, supportedDocumentTypes;

fs             = require('fs');
var fse = require('fs-extra')
var copydir = require('copy-dir');
const mime = require('mime');
const { join } = require('path')
//const electron = require('electron');
//const app = electron.app;
uploadPath     =  join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data','Image');

var listenerDirs = [];
listenerDirs.push({path: join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data','Background'), folder:'Background'});
listenerDirs.push({path: join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data','Icone'), folder:'Icone'});
listenerDirs.push({path: join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data','Image'), folder:'Arquivo'});
listenerDirs.push({path: join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data','Pdf'), folder:'Arquivo'});
listenerDirs.push({path: join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data','Video'), folder:'Arquivo'});
var projectjson = createProjectJson();
//var uploadImagePath = null;
//var uploadPdfPath = null;
//var uploadVideoPath = null;

var basepath = getProjectBasePath();
mountProjectData(basepath);

function isDev() {
  console.log("isdev mode ..: name : " + process.mainModule.filename);
  return process.mainModule.filename.indexOf('app.asar') === -1;
}

function getProjectBasePath(){
  var lastpath = 'Data/Drops';

  var home = require("os").homedir();
  var userpath = home + '/Documents/';
  var fullpath = join(userpath, lastpath);

  mkDirData(join(userpath, "Data"));

  return fullpath;
}

function getDataCopyPath(){
  var lastpath = '/../DropsPlayer/projects/sync/Data';
  var fullpath = __dirname + lastpath;
  if(!isDev()){
    console.log("Is not Dev mode");
    var calcpath = __dirname.substring(0, __dirname.length-19);
    fullpath = calcpath + lastpath;
  }else{
    console.log("Dev mode");
  }
  console.log("getDataCopyPath ..:" +fullpath);
  return fullpath;
}

function mountProjectData  (basepath){
  //$scope.copyProject = function(basepath,project){

    //TODO mover para  string
    //var fileFrom = join(project.directory,"infosetup.json");

    mkDirData(basepath);
    mkDirData(basepath + '/DropsPlayer/');
    mkDirData(basepath + '/DropsPlayer/projects/');
    mkDirData(basepath + '/DropsPlayer/projects/sync/');
    mkDirData(basepath + '/DropsPlayer/projects/sync/Data/');
    mkDirData(basepath + '/DropsPlayer/projects/sync/Data/Image/');
    mkDirData(basepath + '/DropsPlayer/projects/sync/Data/Video/');
    mkDirData(basepath + '/DropsPlayer/projects/sync/Data/Pdf/');
    mkDirData(basepath + '/DropsPlayer/projects/sync/Data/Browser/');
    mkDirData(basepath + '/DropsPlayer/projects/sync/Data/Background/');
    mkDirData(basepath + '/DropsPlayer/projects/sync/Data/Icone/');
    //var dataCopyFrom =  getDataCopyPath();
    //var dataCopyTo = basepath + '\\DropsPlayer\\projects\\sync\\Data\\';
    //copydir.sync(dataCopyFrom, dataCopyTo);

    mkDirData(basepath + '/DropsPlayer/unityDebug/');
    mkDirData(basepath + '/DropsPlayer/unityDebug/naebwcydoerfk/');
    mkDirData(basepath + '/DropsPlayer/unityDebug/naebwcydoerfk/j0s01o012n0123/');
    var fileTo = basepath + '/DropsPlayer/unityDebug/naebwcydoerfk/j0s01o012n0123/infosetup.json';
    fs.writeFileSync(fileTo, JSON.stringify(projectjson));
    console.log('project create ..: ' + fileTo);
    //log.info("file copy ..: "+ fileFrom + " to " + fileTo);
    //fs.createReadStream( fileFrom ).pipe(fs.createWriteStream( fileTo ));
  //}
}
function mkDirData (targetDir){
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir);
          console.log(`Directory : ${targetDir} created`);
        }else{
          console.log(`Directory already exists: ${targetDir}`);
        }
}
supportedVideoTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg'
];
supportedImageTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg'
];
supportedDocumentTypes = [
    'application/pdf'
];

module.exports = {
    list    : list,
    request : request,
    upload  : upload,
    remove : remove,
    moveto : moveto
};

_checkUploadDir();

function _checkUploadDir(cb) {
    cb = cb || function () {};

    /*fs.stat(__dirname + '/' + filename, function (err, stat) {
        if (err) {
            console.log(err);
            return;
        }
        // ...
    });*/
    if(uploadPath!=null){
      console.log("upload path ..:" + uploadPath);
      fs.stat(uploadPath, function (err, stats) {
          console.log('stats ..: '+ JSON.stringify(stats));
          if (err && err.errno === 34 ) {
              // if there's no error, it means it's not a directory - remove it
              if (!err) {
                  fs.unlinkSync(uploadPath);
              }

              // create directory
              console.log('mkdir ..: '+ uploadPath);
              fs.mkdir(uploadPath, cb);
              return;
          }else{

          }

          cb();
      });
    }

}

/**
 */
function list(stream, meta)  {


    //for(var i=0; i<dirs.length;i++){
      //uploadPath = getUploadPath(meta.type);
      _checkUploadDir(function () {
        var allfiles = [];
        for(var i=0;i<listenerDirs.length;i++){
          var dir = listenerDirs[i].path;
          var folder = listenerDirs[i].folder;
          fs.readdirSync(dir).forEach(file => {
            console.log(file);
            allfiles.push({file:file,folder:folder});
          });
        }
        /*fs.readdirSync(dirs[1]).forEach(file => {
          console.log(file);
          allfiles.push(file);
        });
        fs.readdirSync(dirs[2]).forEach(file => {
          console.log(file);
          allfiles.push(file);
        });*/
        //console.log("All files ..:" + allfiles);
        //stream.write({ files : allfiles });
        refreshProjectJson();
        stream.write({ files : allfiles })

          /*var basedir = dirs[0];
          console.log("List past ...:" + basedir);
          fs.readdir(basedir, function (err, files) {
            //console.log("List past ..:" + files);
            for(var i=0;i<files.length;i++){
              if (fs.statSync(basedir + '/' + file).isDirectory()) {
                fs.readdir(basedir, function (err, files) {
                  allfiles.concat(files);
                });
              }
            }
            console.log("All files ..:" + allfiles);
            stream.write({ files : allfiles });
          });*/


      });
    //}
}

/**
 */
function request(client, meta) {
    var metatype = mime.getType( meta.name);
    console.log('request client..:' + meta.name + ' metatype...: '+ metatype);
    uploadPath = getUploadPath(metatype);
    var file = fs.createReadStream(uploadPath + '/' + meta.name);
    refreshProjectJson();
    client.send(file);
}
function remove(client, meta){


  var metatype = mime.getType( meta.name);
  console.log('remove client..:' + meta.name + ' metatype...: '+ metatype);
  var basepath = getUploadPathV2(meta.folder, metatype);
  var file = basepath + '/' + meta.name;
  try {
    fs.unlinkSync(file);
    console.log('successfully deleted ..:' + file);
    refreshProjectJson();
  } catch (err) {
    console.log('error deleted ..:' + err);
  }
  client.send("");
}

function moveto(client, meta){
  var metatype = mime.getType( meta.name);
  var folder = meta.folder;
  console.log('moveto client..:' + meta.name + ' metatype...: '+ metatype + 'to ..:' + folder);
  var basepath = getUploadPath(metatype);
  var dirto = getUploadPath(metatype);
  if(folder=='Background' || folder == 'Icone'){
    dirto = join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data', folder);
    try {
      var filefrom = basepath + '/' + meta.name;
      var fileto = dirto + '/' + meta.name;
      //copydir.sync(filefrom, fileto);
      //fs.createReadStream(filefrom).pipe(fs.createWriteStream(fileto));
      fse.move(filefrom, fileto, function (err) {
       if (err) return console.error(err)
         console.log('successfully copy ..:' + fileto);
         console.log('successfully deleted ..:' + filefrom);
         refreshProjectJson();
      })

      //if (fs.existsSync(filefrom)) {
        //fs.unlinkSync(filefrom);
      //}

    } catch (err) {
      console.log('error deleted ..:' + err);
    }
  }


  client.send("");
}
function getUploadPathV2(folder, metatype){
  /*for(var i=0;i<listenerDirs.length;i++){
    var dir = listenerDirs[i].path;
    var fol = listenerDirs[i].folder;
    if(folder == fol){
      uploadPath = join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data','Image');
    }
  }*/
  if(folder=='Arquivo'){
    return getUploadPath(metatype);
  }else{
    return join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data',folder);
  }
}
function getUploadPath(metatype){
  
  var uploadPath = null;
  if(~supportedImageTypes.indexOf(metatype)){
    uploadPath = join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data','Image');
  }else if(~supportedVideoTypes.indexOf(metatype)){
    uploadPath = join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data','Video');
  }else if(~supportedDocumentTypes.indexOf(metatype)){
    uploadPath = join(getProjectBasePath(),'DropsPlayer','projects', 'sync', 'Data', 'Pdf');
  }
  return uploadPath;
}
/**
 */
function upload(stream, meta) {
    console.log('upload file..:' + meta.name + ' type..:'+meta.type);
    if (!~supportedImageTypes.indexOf(meta.type) &&
        !~supportedVideoTypes.indexOf(meta.type) &&
        !~supportedDocumentTypes.indexOf(meta.type)) {
        stream.write({ err: 'Unsupported type: ' + meta.type });
        stream.end();
        return;
    }

    uploadPath =getUploadPath(meta.type);
    console.log('upload file destiny ..:' + uploadPath);
    var file = fs.createWriteStream(uploadPath + '/' + meta.name);
    stream.pipe(file);

    stream.on('data', function (data) {
        stream.write({ rx : data.length / meta.size });
    });

    stream.on('end', function () {
        stream.write({ end: true });
    });
}
function refreshProjectJson(){
  var basepath = getProjectBasePath();
  var fileTo = basepath + '\\DropsPlayer\\unityDebug\\naebwcydoerfk\\j0s01o012n0123\\infosetup.json';
  fs.writeFileSync(fileTo, JSON.stringify(projectjson));
  console.log('project create ..: ' + fileTo);
}
function createProjectJson(){
  var json = {
  	"projectKey": "sync",
  	"isnew": false,
  	"directory": join(getProjectBasePath(),'DropsPlayer','projects', 'sync'),
  	"projectName": "Sync",
  	"bgImage": "Data/Background/background.png",
  	"bgimagesizeW": 2048,
  	"bgimagesizeH": 1024,
  	"bgColor": "#3a6fa5",
  	"dropsImage": "Data/Icone/logo.png",
  	"dropsimagesizeW": 48,
  	"dropsimagesizeH": 50,
  	"tileDropsImage": "1,1",
  	"dropsColor": "#3a6fa5ff",
  	"dropsImageColor": "#3a6fa5ff",
  	"dropsPdfColor": "#3a6fa5ff",
  	"dropsVideoColor": "#3a6fa5ff",
  	"dropsBrowserColor": "#3a6fa5ff",
  	"dropsOpacity": 1,
  	"dropsImageOpacity": 1,
  	"dropsPdfOpacity": 1,
  	"dropsVideoOpacity": 1,
  	"dropsBrowserOpacity": 1,
  	"dropsbw": true,
  	"prop": "16:9",
  	"inches": "11",
  	"gridprop": "2:2",
  	"position": "vertical",
  	"screen": {
  		"screensH": "1",
  		"screensV": "1"
  	},
  	"resolTela": "",
  	"screensize": {
  		"width": 45,
  		"heigth": 80
  	},
  	"grid": [
  		{
  			"count": 1,
  			"id": "0:0",
  			"x": -11.25,
  			"y": 20,
  			"DquadH": 22.5,
  			"DquadV": 40
  		},
  		{
  			"count": 2,
  			"id": "0:1",
  			"x": 11.25,
  			"y": 20,
  			"DquadH": 22.5,
  			"DquadV": 40
  		},
  		{
  			"count": 3,
  			"id": "1:0",
  			"x": -11.25,
  			"y": -20,
  			"DquadH": 22.5,
  			"DquadV": 40
  		},
  		{
  			"count": 4,
  			"id": "1:1",
  			"x": 11.25,
  			"y": -20,
  			"DquadH": 22.5,
  			"DquadV": 40
  		}
  	]
  };
  return json;
}
