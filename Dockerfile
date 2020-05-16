# pull official base image
#FROM python:3.8.0-alpine
FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
COPY ./backend/requirements.txt /code/
RUN pip install -r requirements.txt
COPY ./backend /code/
