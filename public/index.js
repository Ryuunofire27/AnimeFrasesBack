var urlBase = 'http://107.170.225.213:3000';
var body = document.body;
var playingAudio = null;

function request(type, url, cb){
  fetch(urlBase + url, {method: type, cache: 'default'})
    .then(res => res.json())
    .then(data => cb(data))
    .catch(err => console.log(err));
}

function createCard(id, imgUrl){
  var card = document.createElement('div');
  var img = document.createElement('img');
  var audio = document.createElement('audio');
  var source = document.createElement('source');

  audio.setAttribute('controls', '');
  source.setAttribute('src', '');
  source.setAttribute('type', 'audio/mpeg');

  var audiosUrl = [];

  img.classList.add('img');
  img.setAttribute('src', urlBase + '/files/' + imgUrl);
  audio.appendChild(source);

  card.appendChild(img);
  card.appendChild(audio);

  card.addEventListener('click', function(){
    if(playingAudio){
      playingAudio.pause();
    }
    if (audiosUrl.length !== 0){
      var random = Math.floor(Math.random() * audiosUrl.length);
      source.attributes.src.nodeValue = urlBase + '/files/' + audiosUrl[random];
      audio.load()
      audio.play();
      playingAudio = audio;
    } else {
      request('GET', '/characters/' + id, function(res){
        console.log(res);
        for(var i = 0; i < res.phrases.length; i++){
          audiosUrl.push(res.phrases[i].audioRelUrl);
        }
        var random = Math.floor(Math.random() * audiosUrl.length);
        source.attributes.src.nodeValue = urlBase + '/files/' + audiosUrl[random];
        audio.load();
        audio.play();
        playingAudio = audio;
      });
    }
  });

  document.body.appendChild(card);
}

(function(){
  fetch(urlBase + '/characters', {method: 'GET'})
    .then( res => res.json())
    .then( data => {
      var characters = data.docs;
      for(var i = 0; i < characters.length; i++){
        createCard(characters[i]._id, characters[i].imgRelUrl);
      }
    });
})()
