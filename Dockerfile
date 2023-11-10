# Dockerfile
# 因为我们项目使用的是pnpm安装依赖，所以找了个支持pnpm的基础镜像，如果你们使用npm，这里可以替换成node镜像
# FROM nginx:alpine
FROM gplane/pnpm:8 as builder

# 设置工作目录
WORKDIR /data/web/

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# 这里有个细节，为了更好的使用node_modules缓存，我们先把这两个文件拷贝到镜像中，镜像会检测发现这两个文件没有变化，就不会去重新安装依赖了。
COPY package.json pnpm-lock.yaml /data/web/

# 安装依赖，如果上面两个文件没有改动，就不会重现安装依赖。
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# 把当前仓库代码拷贝到镜像中
COPY . /data/web/
# 运行build命令，可以替换成 npm run build
RUN pnpm run build
# 上面我们把代码编译完成后，会在镜像里生成dist文件夹。

# 下面我们把打包出来的静态资源放到nginx中部署
# 使用nginx做基础镜像
FROM nginx:alpine as nginx
# 设置时区
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone 
# 设置工作目录
WORKDIR /data/web/
# 在nginx镜像中创建 /app/www文件夹
RUN mkdir -p /app/www/
# 把上一步编译出来dist文件夹拷贝到刚才新建的/app/www文件夹中
COPY --from=builder /data/web/dist /app/www

# 暴露 80端口和443端口，因为我们服务监听的端口就是80，443端口是为了支持https。
EXPOSE 80 
EXPOSE 443

# 如果镜像中有nginx配置，先给删了
RUN rm -rf /etc/nginx/conf.d/default.conf
# 把项目里的./nginx/config.sh shell脚本复制到ngxin镜像/root文件夹下
COPY ./nginx/config.sh /root
# 给刚复制进去的shell脚本设置权限，让镜像启动的时候可以正常运行这个shell脚本。
RUN chmod +x /root/config.sh
# 镜像启动的时候运行config.sh脚本
CMD ["/root/config.sh"]
