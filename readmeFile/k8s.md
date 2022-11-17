### K8s 환경 실행

![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)

#### yaml example

- 대괄호의 항목들은 환경에 맞춰서 바꿔준다.
- **Deployment, Service, configMap yaml file**

- ```yaml
  apiVersion: apps/v1
  kind: Deployment
  metadata:
    name: [deployment name]
    namespace: [namespace]
  spec:
    replicas: 1
    selector:
      matchLabels:
        [label key]: [label value]
    template:
      metadata:
        labels:
          [label key]: [label value]
      spec:
        containers:
        - image: [image]
          name: [containers name]
          ports:
          - containerPort: 80
          volumeMounts:
          - name: [volumes name]
            mountPath: /etc/nginx/conf.d/default.conf
            subPath: default.conf
        volumes:
          - name: [volumes name]
            configMap:
              name: [configMap name]

  ---

  apiVersion: v1
  kind: Service
  metadata:
    name: [service name]
    namespace: [namespace]
    labels:
      [label key]: [label value]
  spec:
    type: NodePort
    ports:
    - port: [port]
      targetPort: 80
      nodePort: [node port]
    selector:
      [label key]: [label value]

  ---

  apiVersion: v1
  kind: ConfigMap
  metadata:
      name: [configMap name]
      namespace: [namespace]
  data:
    default.conf: |+
      server {
        listen 80;
        listen [::]:80;
        server_name localhost;

        location / {
          root /usr/share/nginx/html;
          index index.html index.htm;
          try_files $uri $uri/ /index.html;
        }

        location /login {
          root /usr/share/nginx/html;
          index  index.html index.htm;
          try_files $uri $uri/index.html =404;
        }

        location ^~ /api {
          proxy_pass [proxy_pass 할 주소];
          proxy_http_version 1.1;
          proxy_set_header Host [Host 명];

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
