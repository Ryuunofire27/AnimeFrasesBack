# AnimeFrasesBack

## Routes

### GET METHODS
```
  get all                           =>      characters?limit=number&page=number
  get by id                         =>      characters/idCharacter
  get phrases by character          =>      characters/idCharacter/phrases
  get phrase by character and by id =>      characters/idCharacter/phrases/idPhrase

  get users                         =>      users
  get user by id                    =>      users/idUser
```

### POST METHODS

```
  save character                    =>      characters/
  save user                         =>      user/
  (body: user, pssw)
  login                             =>      user/login
  (body: user, pssw)
```

### PUT METHODS

```
  update character                  =>      characters/
  update phrases                    =>      characters/idCharacter/phrases
```

### DELETE METHODS

```
  delete character                  =>      characters/
  delete phrase by character        =>      characters/idCharacter/phrases
  delete user                       =>      users/idUser
```