## Description

NCDC フロント課題のバックエンドリポジトリ
![](./Design/画面/20220615/03_title_edit.png)

## Installation & exec

```bash
# install
$ npm install
# migration
$ npm run migration:run
# start build
$ npm run build
# 実行
$ npm run start
```

## API

API の Document は、  
アプリを起動後、`http://localhost:3000/api` にて Swagger で確認できる。  
![](./doc/images/swagger.png)

## DB を初期状態に戻す

```bash
$ cp ./data/bk-dev.sqlite ./data/dev.sqlite
```
