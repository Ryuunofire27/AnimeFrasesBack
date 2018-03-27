const fs = require('fs');

const directory = '/var/animefrases';

class FilesController{
  getFile(req, res, next){
    const type = req.params.type;
    const anime = req.params.anime;
    const file = req.params.file;

    if(type && anime && file){
      const path = `${directory}/${type}/${anime}/${file}`;
      fs.exists(path, (exists) => {
        if(exists){
          const readable = fs.createReadStream(path); 
          readable.pipe(res)
        }else{ 
          res.status(500).send({msg : 'File not found'});
        }
      })
    }else{
      res.status(500).send({msg : 'File not found'});
    }
  }
}

module.exports = FilesController;