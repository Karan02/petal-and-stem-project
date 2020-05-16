PROJECT_NAME = "petalandstem"
BACKEND_DIR = "/home/vagrant/#{PROJECT_NAME}/src/backend"
FRONTEND_DIR = "/home/vagrant/#{PROJECT_NAME}/src/frontend"

Vagrant.require_version ">= 2.0.1"
Vagrant.configure(2) do |config|

  config.vm.hostname = PROJECT_NAME
  config.vm.box = "ubuntu/xenial64"

  config.vm.network :private_network, ip: "192.168.22.22"
#  config.vm.network :forwarded_port, guest: 22, host: 1234  
  config.vm.synced_folder "./backend", BACKEND_DIR
  config.vm.synced_folder "./frontend", FRONTEND_DIR
  
  config.vm.provider :virtualbox do |vb|
    vb.name = PROJECT_NAME
    vb.memory = "512"
    vb.cpus = 1
    vb.gui = false
  end

  config.vm.provision "ansible" do |ansible|
    ansible.playbook = "ansible/vagrant.yml"
    ansible.inventory_path = "ansible/inventory.yml"
    ansible.galaxy_roles_path = 'ansible/galaxy_roles'
    ansible.host_key_checking = false
    ansible.limit = "*"
  end
end
