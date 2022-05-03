
const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'buildapp-win32-x64')
  console.log(path.join(rootPath, 'assets', 'icons', 'win', 'icon.ico'));
  return Promise.resolve({
    //appDirectory: path.join(outPath, 'Electron-tutorial-app-win32-ia32/'),
    appDirectory: outPath,
    authors: 'DataKode',
    description: 'Ap pto Sync files',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'buildapp.exe',
    setupExe: 'DropsInstaller.exe',
    setupIcon: path.join(rootPath, 'images', 'logo.ico')
  })
}
