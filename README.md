### Desafio final Fastfeet

É necessário instalar o node.js, yarn, expo, docker e baixar o container do postgres e redis.

**Backend**

````
Configurar o arquivo .env conforme o .envexample que segue junto com projeto.

clonar o projeto e executar os comandos abaixo:

ativar o docker
docker start fastfeet
docker start redisfasfeet
cd backend 
yarn 
yarn sequelize db:migrate
yarn sequelize db:seed:all
yarn dev

````
