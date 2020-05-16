# Petalandstem

# List of Endpoints
## main website:
 - https://www.petalandstem.com/

## Admin Panel

 - `http://api.petalandstem.local/admin/pands/category/` - a management page (Create/Update/Delete) of categories
 - `http://api.petalandstem.local/admin/pands/component/` - a management page (Create/Update/Delete) of components
 - `http://api.petalandstem.local/admin/pands/containeritem/` - a management page (Create/Update/Delete) of components in container
 - `http://api.petalandstem.local/admin/pands/container/` - a management page (Create/Update/Delete) of containers
 - `http://api.petalandstem.local/admin/pands/rawmaterial/` - a management page (Create/Update/Delete) of raw materials
 - `http://api.petalandstem.local/admin/pands/ingredient/` - a management page (Create/Update/Delete) of ingredients in recipe
 - `http://api.petalandstem.local/admin/pands/recipe/` - a management page (Create/Update/Delete) of recipes
 - `http://api.petalandstem.local/admin/pands/product/` - a management page (Create/Update/Delete) of products
 - `http://api.petalandstem.local/admin/pands/supplier/` - a management page (Create/Update/Delete) of suppliers
 - `http://api.petalandstem.local/admin/pands/currency/` - a management page (Create/Update/Delete) of currencies


## API
 - `http://api.petalandstem.local/api/auth/token/` - endpoint to create new auth token
 - `http://api.petalandstem.local/api/auth/revoke-token/` - endpoint revoke existing token
 - `http://api.petalandstem.local/api/auth/raw_materials/` - (CRUD) endpoint for raw materials
 - `http://api.petalandstem.local/api/auth/ingredients/` - (CRUD) endpoint for ingredients in recipe
 - `http://api.petalandstem.local/api/auth/recipes/` - (CRUD) endpoint for recipe
 - `http://api.petalandstem.local/api/auth/recipes/calculate/` - endpoint for recipe calculation
 - `http://api.petalandstem.local/api/auth/components/` - (CRUD) endpoint for components
 - `http://api.petalandstem.local/api/auth/containers/` - endpoint for containers
 - `http://api.petalandstem.local/api/auth/containers/calculate/` - endpoint for container calculation
 - `http://api.petalandstem.local/api/auth/products/` - (CRUD) endpoint for products
 - `http://api.petalandstem.local/api/auth/products/calculate/` - endpoint for product calculation
 - `http://api.petalandstem.local/api/auth/categories/` - endpoint for categories

***

# Local development

## Frontend

### Install Node, NPM and Yarn Locally (to run frontend outside of virtualbox)
 1. [Download](https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.xz)  Node and NPM
 2. Extract the file
 3. Go to the extracted directory
 4. run `./configure` ... `make` ... `sudo make install`
 5. Install Yarn

 `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`

  `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`

  `sudo apt-get update`

  `sudo apt-get install yarn`

### Run the frontend locally
1. `cd src/frontend`
2. `yarn install`
3. `yarn start`
This will start the app at http://localhost:3000 and launch a browser.


### Instruction to React (production version):
 1. Go to the react directory `cd frontend`
 2. Install packages `yarn install`
 3. Run `yarn build`
 4. Go to build directory `cd build`
 5. Install packages `yarn install`
 6. Run `yarn start`


## Backend:

### What's inside?
 * [Django](https://github.com/django/django)/[Django REST framework](https://github.com/tomchristie/django-rest-framework)
 * [PostgreSQL](https://github.com/postgres/postgres)
 * [Gunicorn](https://github.com/benoitc/gunicorn) WSGI HTTP Server
 * [nginx](https://nginx.org/)
 * [Supervisor](https://github.com/Supervisor/supervisor) - client/server process management system
 * Config samples for each tool from above
 * and more...

### Instruction:
 1. Copy repository `git clone …`
 2. Install [VirtualBox](https://www.virtualbox.org/wiki/Downloads) if not installed.
 3. Install [Vagrant](https://www.vagrantup.com/downloads.html) if not installed.
 4. Install  [Ansible](http://docs.ansible.com/ansible/intro_installation.html) if not installed.  (Version 2.4+ less than 2.9)
 5. Run `sudo ansible-galaxy install -r ./ansible/requirements.yml --force -p ./ansible/galaxy_roles` from root project directory for installing Ansible role dependencies.
 6. Run `sudo -- sh -c "echo '192.168.22.22 petalandstem.local api.petalandstem.local flower.petalandstem.local' >> /etc/hosts"` for simple accessing to Vagrant machine in your browser.
 7. Run `vagrant up` from root project directory for start the Vagrant machine. At first time machine will be automatically provisioned.

> `vagrant provision` this command is a great way to quickly to run provisioning new changes on virtual machine.

Note that the workflow for frontend on the vagrant is done with development on a laptop using the backend code within the vagrant


### Project Structure

#### Nginx configurations
Domain is located in `./ansible/group_vars/project.yml`|`./ansible/host_vars/staging/vars.yaml`|`./ansible/host_vars/production/vars.yaml` files and used by NGINX (`./ansible/group_vars/nginx.yaml`).
Default structure of domains:
 -  {site_domain} - by default `project.local`. A main domain which uses for React application.
 -  {api_domain} - by default `api.{site_domain}.local`. A sub-domain which uses for Django application.
 -  {flower_domain} - by default `flower.{site_domain}.local`. sub-domain for Flower (tool for monitoring and management of Celery)


#### Directory structure
The directory structure of the project in the virtual machine.

 *  `/home/{deploy user}/{project name}/` - Main director.
 *  `/home/{deploy user}/{project name}/etc/` - Directory contains configuration files.
 *  `/home/{deploy user}/{project name}/log/` - Directory contains logs.
 *  `/home/{deploy user}/{project name}/run/` - Directory contains unix sockets and pid files.
 *  `/home/{deploy user}/{project name}/src/` - Directory contains source code of project.
 *  `/home/{deploy user}/{project name}/bin/` - Directory contains scripts.
 *  `/home/{deploy user}/{project name}/venv/` - Directory contains virtualenv.

#### Manage services
>   `./ansible/group_vars/` directory contains files with variables for configuration files of Supervisor and Systemd.

#### List services
 List installed services.

> Names of services could be changed in `./ansible/group_vars/`

 -  Nginx - `sudo service nginx start|stop|restart|reload|force-reload|status`
 -  Postgresql - `sudo service postgresql start|stop|restart|reload|force-reload|status`
 -  Redis - `sudo service redis_6379 start|stop|restart|reload|force-reload|status`
 -  Celery worker - `sudo service {project_name}-worker start|stop|restart|reload|force-reload|status`
 -  Celery beat - `sudo service {project_name}-beat start|stop|restart|reload|force-reload|status`
 -  Gunicorn (WSGI HTTP Server) for Django - `sudo supervisorctl {actions: start|restart|stop|status|...} {gunicorn_supervisor_name|default({project_name}-gunicorn)}`
 -  Flower (Monitoring&Management of Celery) for Django - `sudo supervisorctl {actions: start|restart|stop|status|...} {flower_supervisor_name|default({project_name}-flower)}`

#### Restart Django & React applications on external/local machines.
##### Restart Django app by supervisorctl command
    sudo supervisorctl start/restart/stop {project_name}-gunicorn
> {project_name} - By default is 'petalandstem'

##### Restart React app by supervisorctl command
    sudo supervisorctl start/restart/stop {project_name}-webapp
> {project_name} - By default is 'petalandstem'

#### Django settings file
Ansible creates local_settings.py file (by template (`./ansible/roles/webtier/templates/local_settings.py`) and variables in `./ansible/group_vars/` and `./ansible/host_vars/`) which contains configs to services and libraries (DB/Redis/python libraries and etc) according to environment (vagrant/develop/staging/production - values are defined in `./ansible/host_vars/vagrant|develop|stating|production`).
 The local_settings.py is generated every time after deploying with Ansible and is in the root directory of Django code at the same level as `manage.py` file.

***

# Deploying

### _Notice!_ In this project is used Ansible Vault!
Files `./ansible/host_vars/develop/vault.yml` and `./ansible/host_vars/develop/vault.yml` are encrypted by default (Default password is `Ulumulu88`).
They're used to store sensitive data as db names, passwords, keys, secrets etc.
Before deploying to public servers as production or staging you must:

 1. Decrypt necessary files by command `ansible-vault decrypt ./ansible/host_vars/develop/vault.yml` (run it from ansible directory) using default password.
 2. Edit configuration in those files as needed.
    Also if it's first edition of those files you _SHOULD_ edit:
     - database name, user and password;
     - django secret key (http://www.miniwebtool.com/django-secret-key-generator/);
    For passwords better to use generated (http://passwordsgenerator.net/).
 3. Encrypt files again with your _NEW AND SECURE_ password using command `./ansible-vault encrypt ansible/host_vars/develop/vault.yml`.

### How to deploy the project to remote server(s)
 1. Edit respective files in a `host_vars` directory, as well as inventory files. This repo includes default configuration samples for production and staging environments.
 2. Execute `./deploy <inventory name> <tags>` command in the project's root directory, where <inventory name> is the name of your inventory (e.g. "staging" or "production"), and <tags> are optional tags that will execute only the tasks that were marked by this tag (e.g. "provision" tag, which will skip installing most part of the setup and only update the code from a repo and restart services).
 3. Give password to decrypt necessary vault data.
 3. Enjoy deployment :)

### Ansible
 - `bin/ansible-playbook -i ./ansible/{environment}.ini ./ansible/site.yml` - Deploy to {environment} servers.

### Deploy.sh script

### How to deploy the project to a server
 - `./deploy {inventory}` (both backend and frontend) - {inventory} e.g. production|staging|vagrant
 - `./deploy {inventory} frontend` - {inventory} e.g. production|staging|vagrant
 - `./deploy {inventory} backend` - {inventory} e.g. production|staging|vagrant
