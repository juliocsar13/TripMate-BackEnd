'use strict';
//const async = require('async')

module.exports = function(app) {

//const mongoDs = Post.dataSources.mongoDs;

/*var mongoDs = app.dataSources.mongoDs;
async.parallel({
	posts:async.apply(createPosts)
},function(err,results){
	if (err) throw err;
	createPosts(results.posts,function(err){
		console.log('> models created succesfully')
	})
})

function createPosts(cb){
	mongoDs.automigrate('Post',function(err){
		if (err) return cb(err);
		const Post = app.models.Post;
		
		Post.create([{
			name:"aaaaaaa",
			description:"bbbbbbbb",
			destination:"cccccccc",
			schedule:"ddddddddd"
		}],cb)
	})
}*/

//Post.remoteMethod()
};
