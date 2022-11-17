### Docker Image 생성

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

- 이미지 생성 전 확인
  - nginx 설정을 바꿀 default.conf이 있는지
  - default.conf

    - ```nginx
        server {
          listen       80;
          listen  [::]:80;
          server_name  localhost;

          location / {
            root   /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/ /index.html;
          }

          location /login {
            root /usr/share/nginx/html;
            index  index.html index.htm;
            try_files $uri $uri/index.html =404;
          }

          location ^~ /api {
            proxy_pass [backend dns or ip]
            proxy_http_version 1.1;
            proxy_set_header Host $host;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_connect_timeout 3600;
            proxy_send_timeout 3600;
            proxy_read_timeout 3600;
          }

          error_page   500 502 503 504  /50x.html;
          location = /50x.html {
            root   /usr/share/nginx/html;
          }
        }
      ```

  - `.env` 파일 생성 후 BACKEND_BASE_URL, BACKEND_BASE_PORT 값 정의

- Dockerfile

  - ```Dockerfile
    #-------------------------------------------
    # STEP 1 : build executable binary
    #-------------------------------------------
    FROM node:18.8.0-alpine as builder

    ADD . /usr/src/app

    WORKDIR /usr/src/app
    RUN apk update && apk upgrade && \
        apk add --no-cache bash git openssh
    RUN npm rebuild esbuild
    RUN npm install --no-optional
    RUN npm run generate

    #-------------------------------------------
    # STEP 2 : build a image
    #-------------------------------------------
    FROM nginx:1.23.1-alpine

    RUN rm -rf /usr/share/nginx/html/connect /usr/share/nginx/html/device /usr/share/nginx/html/event /usr/share/nginx/html/system /usr/share/nginx/html/tag /usr/share/nginx/html/test /usr/share/nginx/html/user /usr/share/nginx/html/auth /usr/share/nginx/html/emit-prop /usr/share/nginx/html/monitoring /usr/share/nginx/html/dashboard

    # 기존 설정파일 삭제
    RUN rm /etc/nginx/conf.d/default.conf
    # 수정한 설정파일을 복사
    COPY ./default.conf /etc/nginx/conf.d/

    COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

    RUN sed -i 's/js;/js mjs;/' /etc/nginx/mime.types

    ENV HOST 0.0.0.0
    ENV BACKEND_PORT 3001

    ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
    ```

### Local Docker 실행

1. default.conf 변경

    - ```nginx
      server {
        listen       80;
        listen  [::]:80;
        server_name  localhost;

        location / {
          root   /usr/share/nginx/html;
          index  index.html index.htm;
          # try_files $uri $uri/index.html =404;
          try_files $uri $uri/ /index.html;
        }

        location /login {
          root /usr/share/nginx/html;
          index  index.html index.htm;
          try_files $uri $uri/index.html =404;
        }

        location ^~ /api {
          proxy_pass [BackEndServer];
          proxy_http_version 1.1;
          proxy_set_header Host $host;

          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
          proxy_connect_timeout 3600;
          proxy_send_timeout 3600;
          proxy_read_timeout 3600;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   /usr/share/nginx/html;
        }
      }
      ```

2. docker build
    - ex) `docker build --tag [tag 명] [경로] --no-cache`

3. docker 실행
    - ex) `docker run -p [Host Port]:[Container Port] [Tag 명]`
      - Port값 미설정 시 80으로 생성
