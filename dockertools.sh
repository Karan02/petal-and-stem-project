#!/bin/bash

##########
# DOCKER #
##########
alias d='docker'
alias dc='docker-compose'
#alias docker-ps='be; cd $GITS/code-on-website; NODE_ENV=development docker-compose run all && docker-compose logs -f codeonwebsite'
alias docker-ps='be; docker-compose run all && docker-compose logs -f bp'
alias dst='docker stop $(docker ps -a -q)'
#alias drm='docker rm -f $(docker ps -a -q)'
alias di='docker inspect $@ |less'

# lxc
alias lxcip='cat /var/lib/misc/dnsmasq.lxcbr0.leases'
alias lxcstart='sudo lxc-start -n mt4'
alias lxcstop='sudo lxc-stop -n mt4'

# ec2
alias ec2='ssh -i ~/.ssh/keypair1.pem ubuntu@ec2-django'
alias eh='sudo emacs -nw /etc/hosts'

# functions
function venv {

    if [ $# -eq 0 ]
    then
        echo "Available environments:"
        ls "$HOME/venv/"
    else
        source "$HOME/venv/$1/bin/activate"
    fi        
}

function dex {
   exe="docker exec -it $1 bash"
   echo "$exe"
   eval $exe
}

function gits {
    cd "$GITS/$1"
}

function biz {
    echo "$BIZ/$1"
    cd "$BIZ/$1"
}

function ex {
    export PYTHONPATH=`pwd`
    if [ $# -eq 0 ]
    then
        export DJANGO_SETTINGS_MODULE=project.settings
    else
        export DJANGO_SETTINGS_MODULE="$1"    
    fi    
}

function drmc {
    docker container stop $@
    docker container rm $@
}

function drmi {
    docker image rm $@
}

function drmv {
    docker volume rm $@
}


function drmiall {
    images=`docker image ls -a | grep -v REPOSITORY | awk '{print $3}' | tr '\n' ' '`
    drmi $images
}

function drmcall {
    containers=`docker container ls -a | grep -v CONTAINER | perl -pe 's/ .*$//g' | tr '\n' ' '`
    drmc $containers
}

function drmvall {
    volumes=`docker volume ls | grep -v DRIVER | awk '{print $2}'`
    drmv $volumes
}

function drmall {
    drmcall
    drmvall
    drmiall
}

function dls {
    echo " "    
    echo "Docker Networks"
    echo "###############"
    docker network ls
    echo " "    
    echo "Docker Volumes"
    echo "#################"
    docker volume ls
    echo " "    
    echo "Docker Images"
    echo "#################"
    docker image ls -a
    echo " "    
    echo "Docker Containers"
    echo "#################"
    docker container ls -a
}
