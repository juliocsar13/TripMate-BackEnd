'use strict';
const elasticsearch = require('elasticsearch')
const filestack = require('filestack-js');
const request = require('request');

module.exports = function(Post) {

   
      Post.observe('before save',(context,next)=>{
          console.log('ANTES DE GUARDAR',context.instance)
          
          next();
      })
      /*Post.observe('before delete', (context, next) => {
        const Container = Post.app.models.Container;
    
        Post.findOne({where: context.where}, (error, post) => {
          if (error) return next(error);
    
          const filename = post.filename;
          Container.removeFile(BUCKET, filename, (error, reply) => {
            if (error) {
              return next(new Error(error));
            }
    


            next();
          });
        });
      });*/
    
      
    

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



