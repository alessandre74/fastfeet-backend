### Desafio final Fastfeet

Depois de fazer um clone dos projetos, é necessário ter o node.js, yarn postgres e redis instalados.

**Backend**

````
Configurar o arquivo .env conforme o .envexample que segue junto com projeto.

Executar os comandos a abaixo:
cd FastFeet/backend yarn install yarn sequelize db:migrate yarn sequelize db:seed:all yarn dev
````

**Frontend**

````
Executar os comandos abaixo:
cd FastFeet/frontend
yarn install yarn start
````

**Mobile**

````
Instalar o expo e executar os comandos abaixo
cd FastFeet/mobile yarn start com o expo aberto podemos clicar no botao ao 
lado esquerdo Run on IOS simulator com o simulador aberto só autorizar o pedido 
de instalação do aplicativo. Podemos também rodar direto no device baixando o 
aplicativo expo pela Appstore e ativando pelo qrcode através da câmera do próprio
device, vai pedir autorização é só aceitar. Pelo device não podemos esquecer de 
trocar a url no backend pelo IP que aparece logo acima do qrcode, a url do model 
de file também.


OBS: Mobile só testado no IOS, foi desenvolvido todo pelo react native cli, porém 
tive muitos problemas para testar a câmera e para poder entregar o desafio completo, 
por isso criei um novo projeto expo e transferi todo o projeto já feito porém com algumas 
adaptações para funcionar.

```
