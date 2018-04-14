const fs = require('fs');
const directory = require('../config/directory').directory;;

class FilesController{
  getFile(req, res){
    const type = req.params.type;
    const anime = req.params.anime;
    const file = req.params.file;

    if(type && anime && file){
      const path = `${directory}/${type}/${anime}/${file}`;
      fs.exists(path, (exists) => {
        if (exists) {
          const readable = fs.createReadStream(path); 
          readable.pipe(res)
        } else { 
          res.status(404).send({ msg: 'File not found' });
        }
      });
    } else {
      res.status(400).send({ msg: 'Falta completar campos' });
    }
  }
}

module.exports = FilesController;
