const Client = require('ftp');
const config = require('./config');

const filesDir = 'pub/animefrases';

class FtpClient {
  constructor() {
    this.client = new Client();
  }

  getFile(file, callback, cbend) {
    this.connect();
    this.client.get(`${filesDir}/${file}`, (err, fileStream) => {
      if (err) throw err;
      fileStream.on('data', chunk => callback(chunk));
      fileStream.on('end', () => {
        this.client.end();
        if(cbend) cbend();
      });
    });
  }

  putFile(directory, file) {
    this.connect();
    this.client.on('ready', () => {
      this.client.put(file, `/${filesDir}/${directory}/${file}`, (err) => {
        if (err) throw err;
        this.client.end();
        return `${directory}/${file}`;
      });
    });
  }

  connect() {
    this.client.connect(config);
  }

  static getFileEncoding(file) {
    if (typeof file !== 'string') throw new Error('The file must be a string');
    const fileType = file.split('.')[1];
    if (fileType === ('jpg' || 'jpeg' || 'png' || 'mp4' || 'm4a' || 'mp3')) {
      return 'Base64';
    } else if (fileType === ('txt')) {
      return 'utf8';
    }
    return '';
  }
}

module.exports = FtpClient;
