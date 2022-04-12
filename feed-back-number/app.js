const AWS = require('aws-sdk');
const axios = require('axios');
const SHA256 = require("crypto-js/sha256");
const moment = require("moment-timezone");
let response;

const TIME_ZONE = 'Asia/Tokyo';

exports.lambdaHandler = async (event) => {
  try {
    const {url, name} = event;
    const folder = SHA256(url).toString();

    const feed = await axios(url);
    const Bucket = process.env.BUCKET_NAME;

    const Key = `${folder}/${name}_${moment.tz(TIME_ZONE).format('YYYYMMDDHHmmss')}.xml`;
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
        output: Key,
      })
    }
  } catch (err) {
    console.log(err);
    return err;
  }

  return response;
};
