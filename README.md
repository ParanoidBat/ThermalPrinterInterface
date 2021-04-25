# ThermalPrinterInterface
A minimal example of EPSON thermal printer interfacing with NodeJs server

The project is built in and tested on **Windows 10** and ***won't run on Linux***. **EPSON TM-T88V** is used for this project.  
Once you've cloned into or downloaded the repo, most of the dependencies will be downloaded through a simple ```npm install```  
but you might need to download another dependency: [Printer](https://www.npmjs.com/package/printer) manually.

Once your EPSON printer is setup with your Windows system, your nodeJs server up and running, visit ```localhost:3000/print``` to test the printing.  
Explore more options on the module's official git [node-thermal-printer](https://github.com/Klemen1337/node-thermal-printer)

**Note:**  
If you get an error something on the line of:
> Not a Win32 application

This is a [Printer](https://www.npmjs.com/package/printer) error and can be rectified by removing the package and installing again by  
`npm install printer --build-from-source`  
and make sure you meet all other package requirements.
