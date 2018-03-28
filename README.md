# AnimeFrasesBack

## Routes

### GET METHODS
```
  get all                           =>      characters/
  (query: search, sex, anime, limit, page)
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
  save user                         =>      users/
  (body: user, pssw)
  login                             =>      users/login
  (body: user, pssw)
```

### PUT METHODS

```
  update character                  =>      characters/idCharacter
  (body: name, anime, sex, img?)
  update phrases                    =>      characters/idCharacter/phrases
  (body: phrase_0, audio_0, ...)
```

### DELETE METHODS

```
  delete character                  =>      characters/
  delete phrase by character        =>      characters/idCharacter/phrases/idPhrase
  delete user                       =>      users/idUser
```