import { app, shell, BrowserWindow, ipcMain, dialog, Menu, MenuItem } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import vm from 'vm'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1028,
    height: 900,
    show: false,
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
      // additionalArguments: ['--csp=img-src \'self\' data: file://*']
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('select-image', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
    })
    return result.filePaths[0]
  })

  // 创建菜单
  const menu = new Menu()
  menu.append(
    new MenuItem({
      label: '测试',
      submenu: [
        {
          label: '执行云端js',
          click: async () => {
            await encodeBase64()
          }
        }
      ]
    })
  )

  // 设置应用程序菜单
  Menu.setApplicationMenu(menu)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// 下载 base64.js 并执行
async function encodeBase64(): Promise<void> {
  console.log('encodeBase64')
  // 下载 base64.js
  const url = 'https://base64.xpcha.com/base64.js'
  const response = await axios.get(url)

  // 删除 response.data 的最后两行，并在末尾添加一个 "}"
  let scriptData = response.data.split('\n')
  scriptData.pop() // 删除最后一行
  scriptData.pop()
  scriptData.push('}') // 添加 "}"
  scriptData = scriptData.join('\n')

  // 打印脚本数据
  console.log(scriptData)

  // 创建一个新的上下文并执行脚本
  const script = new vm.Script(scriptData)
  const context = vm.createContext({})
  script.runInContext(context)

  // 调用 base64encode 函数
  const encodedStr = context.base64encode('Hello, World!')
  console.log('Encoded String:', encodedStr)
  // 调用 base64decode 函数
  const decodedStr = context.base64decode(encodedStr)
  console.log('Decoded String:', decodedStr)
}
