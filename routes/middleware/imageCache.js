// Original Gist: https://gist.github.com/dboskovic/23858511bf3c1cbebdbd
var keystone = require('keystone');
var crypto = require('crypto');
var request = require('request');
var path = require("path");
var fs = require('fs');
var s3 = require('s3');
var image_cache = keystone.list('ImageCache').model;
var temp_dir = path.join(process.cwd(), 'temp/');
if (!fs.existsSync(temp_dir)) {
  fs.mkdirSync(temp_dir);
}

S3_BUCKET = process.env.S3_BUCKET;
AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
CLOUDFRONT_URL = process.env.CLOUDFRONT_URL;

var s3_client = s3.createClient({
  multipartUploadThreshold: 209715200, // this is the default (20 MB)
  multipartUploadSize: 157286400, // this is the default (15 MB)
  s3Options: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

// TO USE:
// - show a product photo where product has already been loaded from controller and put into scope
// - notice the keystone cloudinary photo method simply returns an http://... url to the cloudinary image
// - the gi() method just requests that url and sends it to s3, and then updates the database when it's available.
// img(src=ic(product.photo.limit(100,138)))

exports = module.exports = function(req, res, next) {
  res.locals.ic = function(img) {
    // Show warning if the required enviroment variables aren't set
    if (S3_BUCKET === undefined ||
        AWS_ACCESS_KEY === undefined ||
        AWS_SECRET_KEY === undefined ||
        CLOUDFRONT_URL === undefined) {
      var error = "Image caching to S3 requires the following enviroment"+
       "variables: S3_BUCKET, AWS_ACCESS_KEY, AWS_SECRET_KEY, CLOUDFRONT_URL";
      console.error(error);
      return img;
    }

    // console.log('looking for image =>',img)
    var md5 = crypto.createHash('md5');
    var hash = md5.update(img).digest('hex');
    var db_image;

    function getImage(hash) {
      var response;
      image_cache.where({hash:hash}).findOne(function(err,data){
        response = data
      })
      while(response === undefined) {
        require('deasync').sleep(3);
      }
      return response;
    }

    db_image = getImage(hash)

    if(!db_image || !db_image.uploaded) {
      if(!db_image) {
        image_cache.create({hash:hash,uploaded:0},function(err,$img){
          request(img).pipe(fs.createWriteStream(temp_dir+"/"+hash+".jpg"))
            .on('close', function (error, response, body) {
              var params = {
                localFile: temp_dir+"/"+hash+".jpg",
                s3Params: {
                  Bucket: S3_BUCKET,
                  Key: hash+'.jpg',
                  ACL:'public-read',
                  ContentType:'image/jpeg'
                },
              };
              var uploader = s3_client.uploadFile(params);
              uploader.on('error', function(err) {
                $img.remove()
              });
              uploader.on('end', function() {
                $img.uploaded = true;
                $img.save()
              });
            })
        })
      }
      return img
    } else {
      var url = req.protocol+'://';
      if (CLOUDFRONT_URL) {
        url += CLOUDFRONT_URL+'/';
      } else {
        url += S3_BUCKET+'.s3.amazonaws.com/';
      }
      url += hash+'.jpg';
      return url;
    }
  }

  next();
}