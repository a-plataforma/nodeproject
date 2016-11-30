Vagrant.configure("2") do |config|
  config.vm.provision "shell", inline: "echo Hello"

  config.vm.define "web", primary: true do |web|
    web.vm.box = "bento/ubuntu-14.04"
    web.vm.provision "shell", path: "provision/web.sh"
    web.vm.provision "shell", path: "provision/start.sh", run: "always"
    web.vm.synced_folder "./", "/var/www/"
    web.vm.network "private_network", ip: "192.168.33.10"
    web.vm.network "forwarded_port", guest: 80, host: 80
    web.vm.provider "virtualbox" do |v|
	v.memory = 512
	v.cpus = 1
    end
  end

  config.vm.define "db" do |db|
    db.vm.box = "bento/ubuntu-14.04"
    db.vm.provision "shell", path: "provision/db.sh"
    db.vm.network "private_network", ip: "192.168.33.11"
    db.vm.network "forwarded_port", guest: 27017, host: 27017
    db.vm.provider "virtualbox" do |v|
	v.memory = 512
	v.cpus = 1
    end
  end
end
