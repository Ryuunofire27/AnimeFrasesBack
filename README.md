# AnimeFrasesBack

## REST Routes

### GET METHODS
```
  get all                           =>      characters/
  (query: search, sex, limit, page, pop ('asc' or 'desc' or 'abc'), void (0 or 1))
  get by id                         =>      characters/idCharacter
  get phrases by character          =>      characters/idCharacter/phrases
  get phrase by character and by id =>      characters/idCharacter/phrases/idPhrase

  get users                         =>      users
  get user by id                    =>      users/idUser

  get file                          =>      files/type/anime/file
  (type/anime/file = imgUrl or audio Url)
```

### POST METHODS

```
  save character                    =>      characters/
  (body: name, anime, sex, img, audio_0, phrase_0, ...)
  update phrases                    =>      characters/idCharacter/phrases
  (body: phrase_0, audio_0, ...)
  
  save user                         =>      users/
  (body: user, pssw)
  login                             =>      users/login
  (body: user, pssw)
```

### PUT METHODS

```
  update character                  =>      characters/idCharacter
  (body: name, anime, sex, img?)
  update phrase                     =>      characters/idCharacter/phrases/idPhrase
  (body: )
  update click                      =>      characters/idCharacter/click
```

### DELETE METHODS

```
  delete character                  =>      characters/
  delete phrase by character        =>      characters/idCharacter/phrases/idPhrase
  delete user                       =>      users/idUser
```

## Socket Events

### Emit Events

```
  get connections => pide informacion sobre las conexiones (un arreglo de conexiones las cuales tienen los atributos _id, date, connections)
```

### On Events

```
  get connections => recibe las conexiones (un arreglo de conexiones las cuales tienen los atributos _id, date, connections)
  connections => recibe las nuevas conexiones que se realizan (un objeto conexiones el cual tiene los atributos _id, date, connections);
```