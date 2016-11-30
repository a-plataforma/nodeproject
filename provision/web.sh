sudo apt-get update -y

echo "WEB:[Instalando NGINX]"
sudo apt-get install nginx -y

echo "WEB:[Language Pack UBUNTU]"
sudo apt-get install -y language-pack-en-base

echo "WEB:[Instalando Dependencias]"
sudo apt-get install software-properties-common python-software-properties  build-essential htop curl -y

echo "WEB:[Adicionando Repositório e instalando o NODE6.x]"
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install npm;

echo "WEB:[Copiando Virtual Host]"
sudo cp -rf /vagrant/provision/vhost /etc/nginx/sites-available/default

echo "WEB:[Reiniciando NGINX]"
sudo service nginx restart


sudo apt-get autoremove -y;
sudo service nginx restart;

cd /var/www ; 
echo "RUNNING NPM INSTALL"
npm install ; 

cd /var/www && npm start & 