# fabric imports
import os
import sys
import shutil
from os.path import join

from fabric.api import local, lcd, sudo, cd, env, put, run
from fabric.contrib.files import exists

from fabric.tasks import Task

# misc imports

# fabric configuration
env.user="sethbkz"
env.group="sethbkz"
env.host="healthywatt.com"

# LOCAL configuration
CLONE_DIR="/tmp/pw"
REPO="git@github.com:sudobkz/web-services.git"

# REMOTE configuration
TARGET_ROOT_TMP = "/tmp"
TARGET_ROOT = "/home/sethbkz/webapps"
TARGET_VENV_ROOT = join(TARGET_ROOT, "django10", "venv")
TARGET_VENV_NAME = "hw"
TARGET_VENV = join(TARGET_VENV_ROOT, TARGET_VENV_NAME)
TARGET_PYTHON = join(TARGET_VENV,"bin","python")
TARGET_PYVENV = "/usr/local/bin/pyvenv-3.5"

DJANGO_ROOT = join(TARGET_ROOT, "django10", "pw")
DJANGO_SETTINGS_FILE = "project.settings.prod"
DJANGO_USER = "sethbkz"
DJANGO_GROUP = "sethbkz"
RSYNC_LOCAL=join(CLONE_DIR, "web-services/pw/")
LOCAL_REQUIREMENTS=join(CLONE_DIR, "web-services/INSTALL","requirements_server.txt")
REMOTE_REQUIREMENTS= join(TARGET_ROOT, "django10", "requirements.txt")
RSYNC_REMOTE=DJANGO_ROOT

RESTART_CMD="/home/sethbkz/webapps/django10/apache2/bin/restart"


env.activate = 'source {0}/bin/activate'.format(TARGET_VENV)

class Deploy(Task):
    """ package the code into a tarball excluding common garbage files"""

    # name of the task to run
    name = "deploy"

    def clone(self, branch):
        if os.path.exists(CLONE_DIR):
            shutil.rmtree(CLONE_DIR)
        os.mkdir(CLONE_DIR)
        with lcd(CLONE_DIR ):
            local("git clone --depth 1 {0} -b {1}".format(REPO,branch))

    def rsync(self):
         local("""rsync -avz --delete --exclude ".git*" --exclude ".rope*" {0} {2}@{3}:{1}""".format(RSYNC_LOCAL,RSYNC_REMOTE,env.user,env.host)   )
         put(LOCAL_REQUIREMENTS,REMOTE_REQUIREMENTS)

    def venv(self):
        # create the parent venv dir
        if not exists(TARGET_VENV_ROOT):
            run("mkdir %s" % TARGET_VENV_ROOT)
            
        with cd(TARGET_VENV_ROOT):
            # create the actual venv
            if not exists(TARGET_VENV):
                run("{0} {1}".format(TARGET_PYVENV,TARGET_VENV_NAME))
            # update the environment
            run("{0} && pip install -r {1}".format(env.activate, REMOTE_REQUIREMENTS))

    def collectstatic(self):
        with cd(DJANGO_ROOT):
            cmd = '{0} ./manage.py collectstatic --noinput --settings="{1}"'.format(TARGET_PYTHON, DJANGO_SETTINGS_FILE)
            run("{0} && {1}".format(env.activate, cmd))            

    def restart(self):
        run(RESTART_CMD)
            
    def run(self, branch="master"):
        """fabric execution method for class Task"""
        self.clone(branch)
        self.rsync()
        self.venv()
        self.collectstatic()
        self.restart()

# make "restart" available
deploy = Deploy()
