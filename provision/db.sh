sudo apt-get update -y

echo "DB:[Language Pack UBUNTU]"
sudo apt-get install -y language-pack-en-base

echo "DB:[Instalando Dependencias]"
sudo apt-get install software-properties-common python-software-properties htop curl -y

echo "DB:[Instalando MongoDB]"
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu trusty/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update -y
sudo apt-get install -y mongodb-org

echo "DB:[liberando acesso remoto ao MongoDB]"
sudo sed -i "s/.*bindIp.*/  bindIp: 0.0.0.0/" /etc/mongod.conf 
sudo service mongod restart

