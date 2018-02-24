'use strict';
const elasticsearch = require('elasticsearch')
var multer = require('multer');
var fs = require('fs');
module.exports = function(Post) {

    /*
    var uploadedFileName = '';
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // checking and creating uploads folder where files will be uploaded
            var dirPath = 'client/uploads/'
            if (!fs.existsSync(dirPath)) {
                var dir = fs.mkdirSync(dirPath);
            }
            cb(null, dirPath + '/');
        },
        filename: function (req, file, cb) {
            // file will be accessible in `file` variable
            var ext = file.originalname.substring(file.originalname.lastIndexOf("."));
            var fileName = Date.now() + ext;
            uploadedFileName = fileName;
            cb(null, fileName);
        }
    });*/
    Post.upload = function(req, res, body, cb) {
        /*var upload = multer({
         storage: storage
         
         }).array('file', 12);
         upload(req, res, function (err) {
             if (err) {
                 // An error occurred when uploading
                 res.json(err);
             }
             res.json(uploadedFileName);
         });   */
    }
    Post.remoteMethod('upload', {
        accepts: [{
            arg: 'req',
            type: 'object',
            http: {
                source: 'req'
            }
        }, {
            arg: 'res',
            type: 'object',
            http: {
                source: 'res'
            }
        }],
        returns: {
             arg: 'result',
             type: 'string'
        },
        http: {path:'/uploadFile',verb: 'post'}
        /*description: 'Uploads a file',
        accepts: [
          {arg: 'req', type: 'object', http: {source: 'req'}},
          {arg: 'res', type: 'object', http: {source: 'res'}},
          {arg: 'body', type: 'object', http: {source: 'body'}}
        ],
        returns: {
          arg: 'fileObject',
          type: 'object',
          root: true
        },
        http: {path:'/uploadFile',verb: 'post'}*/
    });

    let client  = new elasticsearch.Client({
        host:'localhost:9200'
    })

    Post.observe('after save',function(ctx,next){
        console.log("dsadsdas")
        let myId = ctx.instance.id;
        delete ctx.instance.id;
        client.create({index:'post',type:'post',body:ctx.instance,id:JSON.stringify(myId)
        }).then(function(res){
            next()
        },function(err){
            throw new Error(err)
        })
    })
    Post.observe('before delete',function(ctx,next){
        client.delete({index:'post',type:'post',id:ctx.where.id	
        }).then(function(resp) {		
            next();	
        }, function(err) {		
            throw new Error(err);	
        })
    })
    Post.remoteMethod('search',{
        accepts:{arg:'text', type:'string'},
        returns:{arg:'results',type:'string'},
        http:{
            verb:'get'
        }
    })

    Post.search = function(text,cb){
		client.search({index:'post', type:'post', q:text}).then(function(res) {
			let results = []
			res.hits.hits.forEach(function(h) {
				results.push(h._source)
			});
			cb(null, results);
		}, function(err) {
			throw new Error(err)
		})
    }
   
}



