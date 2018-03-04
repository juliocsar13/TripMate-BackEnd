
const elasticsearch = require('elasticsearch')

module.exports = Post => {

    const client  = new elasticsearch.Client({
        host:'localhost:9200'
    })


    Post.observe('after save', async (ctx,next) => {
        client.create({
            index:'post',
            type:'post',
            body: ctx.instance,
            id: ctx.instance.id.toString()
        })
        next()
    })


    Post.observe('before delete',function(ctx,next){
        client.delete({
            index:'post',
            type:'post',
            id:ctx.where.id	
        })
        next()
    })


    Post.remoteMethod('search',{
        accepts: {
            arg:'text', 
            type:'string'
        },
        returns: {
            arg:'results',
            type:'string'
        },
        http: {
            verb:'get'
        }
    })


    Post.search = async (text,cb) => {

        try {
            const res = await client.search({
                index:'post', 
                type:'post', 
                q: text
            })
    
            let results = []
            res.hits.hits.forEach((h) => {
                results.push(h._source)
            });
    
            return results           
        } catch (error) {
            throw new Error(err)
        }
    }
}



