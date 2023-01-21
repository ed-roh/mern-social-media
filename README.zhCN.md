# 全栈社交媒体应用

Complete React MERN是一个全栈社交媒体应用程序。
对于希望贡献的用户，我计划为社区贡献和其他功能以及改进和修复创建一个单独的分支。
我还没有决定我将使用的确切工作流。但我们很快就会把它弄出来！

# 如何启动[在安装node环境之后]

1. 复制`server/.env.example`文件到`server/.env`。
2. 去[mongodb](https://www.mongodb.com/) 注册登录并创建免费的 MongoDB 数据库。
3. 获取上一步创建数据库的链接信息，替换 `.env` 文件中的 `MONGO_URL` 字段，替换连接信息中的`<password>`为你设置的MongoDB数据库的用户的密码。
4. 在首次启动的时候注释掉`server/index.js`66-67行。
5. 进入的服务的目录，安装依赖 并启动。

```bash
cd server
npm install
npm run start
```
