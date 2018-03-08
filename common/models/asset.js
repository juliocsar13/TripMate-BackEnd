'use strict';
const formidable = require('formidable');
const request    = require('request');
import filestack from 'filestack-js';
 
const apikey = 'A5tRfehRUOvUnWCJpGSSgz';
const client = filestack.init(apikey);

module.exports = (Asset) =>{
    Asset.upload = (req, res, cb)=>{
        const form = new formidable.IncomingForm();
        form.parse(req);
        form.on('file', (name, file)=>{
            
            client.pick({file}).then((result)=> {
                console.log("URL DE STACK",result.filesUploaded[0].url)
            })
        })         
    }
    Asset.remoteMethod('upload',   {
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
        }
    });
};