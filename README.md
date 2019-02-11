# Api de uma locadora online

## Instalação

Após o clone do repositorio, configurar os dados de conexão ao banco de dados MYSQL no arquivo `.env`. Executar o comando `npm install` em seguida o comando `npm run setup` para carregar a lista inicial de filmes.

Rodando o comando `npm test`, são rodadas a criação do banco de dados de teste e o setup no ambiente. Em seguida são disparados os testes.

## Rotas

Para uma lista dos filmes disponíveis:
`GET  /movies`
retornará um array com os dados

Para buscar um dos filmes pelo titulo:
`GET /movies?title=fragmento do title`
retornará um array com o resultado da busca

Para criar um novo usuário:
`POST /signup`
no body do request deve ser informado `{name, email, password}`
o email deve ser único e a senha conter mais de 5 caracteres

Para executar o login do usuário e receber o token para executar os requests de
locação e devolução :
`POST /login`
informando no body do request `{email, password}`
retorna os dados do usuário e um token de authenticação

Para efetuar o logoff do usuário
`POST /logoff`
\*Deve ser informado o Header "Authorization:token"

Para alugar um filme:
`POST /rent-out`
informando o header "Authorization:token"
e o {movie_id} que se quer alugar

Para devolver um filme:
`POST /return-back`
informando o Header "Authorization:token"
e o {movie_id} que se deseja devolver
