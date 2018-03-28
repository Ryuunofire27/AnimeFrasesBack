var urlBase = 'http://107.170.225.213:3000';
var body = document.body;

function request(type, url, cb){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if(this.readyState == 4 && this.status == 200){
      cb(JSON.parse(this.responseText));
    }
  }
  xhttp.open(type, urlBase + url, true);
  xhttp.send();
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
    console.log(audiosUrl);
    if (audiosUrl.length !== 0){
      var random = Math.floor(Math.random() * audiosUrl.length);
      source.attributes.src.nodeValue = urlBase + '/files/' + audiosUrl[random];
      audio.load()
      audio.play();
    } else {
      request('GET', '/characters/' + id, function(res){
        for(var i = 0; i < res.phrases.length; i++){
          audiosUrl.push(res.phrases[i].audioRelUrl);
        }
        var random = Math.floor(Math.random() * audiosUrl.length);
        source.attributes.src.nodeValue = urlBase + '/files/' + audiosUrl[random];
        audio.load();
        audio.play();
      });
    }
  });

  document.body.appendChild(card);
}

(function(){
  request('GET', '/characters', function(res) {
    var characters = res.docs;
    for(var i = 0; i < characters.length; i++){
      createCard(characters[i]._id, characters[i].imgRelUrl);
    }
  });
})()

