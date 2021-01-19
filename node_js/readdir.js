let testFolder = './data';   // ./ : 현재디렉토리를 의미
let fs = require('fs');

fs.readdir(testFolder, function(err, filelist) {
    console.log(filelist);
});