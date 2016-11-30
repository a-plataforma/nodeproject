# Fluxei
A Plataforma fluxei irá unir pessoas a objetivos comuns e ajuda-lás a realizar esse encontro seja virtual ou pessoal.


## Usando o Vagrant
Para instalar o vagrant acesse: https://www.vagrantup.com/ e faça o download de acordo com seu sistema operacional (mac, windows ou linux).
Também é necessário a instalação do virtualbox (https://www.virtualbox.org/wiki/Downloads).

Após a instalação do vagrant e do virtualbox digite em seu prompt:

```
vagrant up
```

Caso seu ambiente nunca tenha sido executado antes, ele irá instalar tudo pela primeira vez, o que pode demorar alguns minutos (cerca de 3 a 10 minutos dependendo da sua conexão com a internet)

Para acessar via SSH a VM onde temos o nginx e o node instalados use:

```
vagrant ssh web
```

Caso queira entrar na instancia com o MongoDB instalado use:

```
vagrant ssh db
```

Caso queira destruir seus ambientes e criar novamente use o comando:

```
vagrant destroy --force && vagrant up 
```

Caso queira apenas rodar o processo de do banco ou do nginx use: 

```
vagrant provision web 
```

Ou 


```
vagrant provision db
```

----------


Caso queira conectar na maquina do banco com o mongo, use a conexão:

```
mongo 192.168.33.11:27017/fluxei
```




### Problema Frequente

Caso seu nginx apresente a mensagem 502 Bad Gateway acesse a instancia *web* e inicie o serviço do Node, que pode não ter sido iniciado por algum motivo

```
1: vagrant ssh web
2: cd /var/www/ ; npm start &  
3: Control + D
```

Para verificar como é feito o proxy_pass no nginx com o node, vejam na pasta *provision/vhost*

--- 


Caso precise acessar os logs do nginx, basta seguir os seguintes passos:


```
1: vagrant ssh web
2: sudo tail -f /var/log/nginx/fluxei.access.log -f /var/log/nginx/fluxei.error.log
```

(esses arquivos estão referenciados no vhost na pasta *provision/vhost*)



---------------------------------
Pre-requisites:


1. Install Node.js from https://nodejs.org/en/
2. Install MongoDB from https://www.mongodb.org
3. Clone this repository
4. Start server by running the command "node server" from de root folder, where the app.js file is located
5. Test the server using the following URL: http://localhost:3000