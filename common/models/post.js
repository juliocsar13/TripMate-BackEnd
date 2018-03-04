'use strict';
const elasticsearch = require('elasticsearch')
module.exports = function(Post) {

   
    Post.upload = function(req, res, body, cb) {
        
    }
    Post.remoteMethod('upload', {
        
        description: 'Uploads a file',
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
        http: {path:'/uploadFile',verb: 'post'}
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



