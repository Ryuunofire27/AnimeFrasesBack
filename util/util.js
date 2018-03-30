const fs = require('fs');

const directory = '/var/animefrases';

class Util {
  static format(name) {
    const date = new Date();
    return `${date.getTime()}_${name}`;
  }
  
  static getArrPhrasesPart(keys, values, part) {
    if (!keys || !values || !part) throw new Error('Send all parameters');
    let j = 0;
    const arr = [];
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] === `${part}_${j}`) {
        arr.push(values[i]);
        j++;
      }
    }
    return arr;
  }
  
  static deleteFile (filePath) {
    fs.stat(filePath, (err) => {
      if (!err) {
        fs.unlink(filePath, (err1) => {
          if (!err1) console.log('eliminado con exito');
        });
      }
    });
  }
  
  static existDirectory(fileDirectory, cb) {
    fs.readdir(`${directory}/${fileDirectory}`, (err) => {
      if (err) {
        fs.mkdirSync(`${directory}/${fileDirectory}`);
      }
      if (cb) {
        cb();
      }
    });
  }
  
  static addPhrases(phrases, phrasesArr, audiosArr, animeDirectory) {
    for (let i = 0; i < phrasesArr.length; i++) {
      const audioPath = `${directory}/audio/${animeDirectory}/${this.format(audiosArr[i].name)}`
      audiosArr[i].mv(audioPath, (err) => {
        if(err) {
          this.deleteFile(audioPath);
          throw err;
        }
      });
      phrases.push({
        phrase: phrasesArr[i],
        audioRelUrl: audioPath.split(directory+'/')[1]
      });
    }
  }
}

module.exports = Util;
