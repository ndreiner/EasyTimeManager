const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;
const {Task,TaskList} = require("./Task.js");

let mainWindow;
let addWindow;
let taskList = new TaskList();





// listen until app reports ready
app.on('ready', function(){
    // Create Window
    mainWindow = new BrowserWindow(
        {
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
            }
        }
    );


    // Load html File into window
    mainWindow.loadFile('mainWindow.html')

    // Make Window from Template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);

});// end app.on

// Handle add Window creation
function createAddWindow(){
    // Create Window
    addWindow = new BrowserWindow(
        {
            width: 200,
            height: 180,
            title:'Add Work Item',
            webPreferences: {
                nodeIntegration:true,
                contextIsolation: false
            }
        }
    );

    // Load html File into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname,'addWindow.html'),
        protocol:'file',
        slashes: true
    }));
    // garbage Collection handle
    addWindow.on('close', function(){
        addWindow = null;
    });
};

// catch item add
ipcMain.on('item:add',function(event,item){
    let newTask = new Task(item.name, item.timestamp, null);
    taskList.push(newTask);
    mainWindow.webContents.send('item:add', item);
    mainWindow.webContents.send('taskList:update', taskList);
    console.log(taskList)
    addWindow.close();
});

// Create Menu Template
const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items'
            },
            {
                label: 'Quit',
                // add hotkey
                accelerator: process.plattform == 'darwin'? 'Command+Q': //identify os (darwin => mac)
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//if mac add empty object on Menu
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
}

// Add dev Options if not in Production
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label:'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I':
                'Ctrl+I',
                click:(item,focusedwindow) => {
                    focusedwindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}