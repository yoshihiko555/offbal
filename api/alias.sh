#!/bin/bash
file=~/.bashrc

echo "alias djangoup='python manage.py runserver 0.0.0.0:8000'" >> ${file}
echo "alias migrations='python manage.py makemigrations'" >> ${file}
echo "alias migrate='python manage.py migrate'" >> ${file}
echo "alias createuser='python manage.py createsuperuser'" >> ${file}

shopt -s expand_aliases
source ${file}
