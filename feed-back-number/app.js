const AWS = require('aws-sdk');
const axios = require('axios');
const SHA256 = require("crypto-js/sha256");
let response;

exports.lambdaHandler = async (event) => {
  try {
    console.log('===============');
    console.log(event.body);
    console.log('===============');
    const {url, name} = event;
    const folder = SHA256(url).toString();

    const feed = await axios(url);
    const date = new Date();

    const padding = (str, n = 2) => str.toString().padStart(n, '0');

    const [y, m, d, h, i, s] = [
      date.getFullYear(),
      padding((date.getMonth() + 1)),
      padding(date.getDate()),
      padding(date.getHours()),
      padding(date.getMinutes()),
      padding(date.getSeconds()),
    ];
    const Bucket = process.env.BUCKET_NAME;

    const Key = `${folder}/${name}_${y}${m}${d}${h}${i}${s}.xml`;
    const Body = feed.data.trim();

    const s3 = new AWS.S3({apiVersion: '2006-03-01'});
    const uploadParams = {
      Bucket,
      Key,
      Body,
    };

    await new Promise(((resolve, reject) => {
      s3.putObject(uploadParams, function (err, data) {
        if (err) {
          console.log("Error", err);
          reject(err);
        }
        if (data) {
          console.log("Upload Success: " + Key);
          resolve(data);
        }
      });
    }))

    response = {
      'statusCode': 200,
      'body': JSON.stringify({
        name,
        content: feed.data.trim(),
      })
    }
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
