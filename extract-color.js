//const Vibrant = require('node-vibrant');
/*const fs = require('fs');
const path = './.';
const bannedDirectories = ['node_modules', 'public'];

const searchFiles = (path, bannedFiles, filesArray = [], filename) => {
  filename = filename || path.substr(path.lastIndexOf('/') + 1);
  const basePath = path.indexOf('*') !== -1 ? path.split('*')[0] : path.split(filename)[0];
  const files = fs.readdirSync(basePath, (err, files) => {
    return files;
  });
  
  let directories = [];
  files.map((file) => {
    let isFileBanned = false;
    for(banned in bannedDirectories){
      if(file.indexOf(bannedDirectories[banned]) !== -1){
        isFileBanned = true;
      }
    }
    if(!isFileBanned){
      if(file.indexOf('.') === -1) {
        directories.push(`${file}/`);
      }else{
        if(filename === file || filename === '*.*' || filename === '*' || (filename.indexOf('*.') !== -1)){
          filesArray.push(`${basePath}${file}`);
        }
      }
    }
  });
  if(directories.length !== 0){
    directories.map((dir) => {
      searchFiles(`${basePath}${dir}`, bannedFiles, filesArray,filename);
    })
  }
  return filesArray;
}

console.log(searchFiles(path, bannedDirectories));*/

/*Vibrant.from('./img/*.jpg')
  .getPalette()
  .then((palette) => {
    console.log(palette);
  })
  .catch( err => {
    console.log(err);
  });*/