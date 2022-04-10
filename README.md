# feed-back-number-sam

特定のURLで公開されているフィードを2時間に1回S3に平文で保存するためのリソース一式をAWS SAMでビルドしてデプロイする

## デプロイ

AWS SAM CLIを用いて以下のコマンドを実行する

```bash
sam build
sam deploy --guided
```

## ローカルでの実行

以下のコマンドでビルド

```bash
feed-back-number-sam$ sam build
```

以下のコマンドを実行することでローカルで実行できる

```bash
feed-back-number-sam$ sam local invoke FeedBackNumberFunction --event events/event.json
```

## 実行ログ取得

以下のコマンドでデプロイしたLambda関数のログを取得できる

```bash
feed-back-number-sam$ sam logs -n FeedBackNumberFunction --stack-name feed-back-number --tail
```

## リソースの削除

以下のコマンドでAWS常に展開したリソースを削除できる  
ただし、S3バケットは削除されないので削除する場合は手動で削除する

```bash
aws cloudformation delete-stack --stack-name feed-back-number
```
