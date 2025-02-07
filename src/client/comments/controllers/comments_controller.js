
const comment_service = require('../services/comments_services');

module.exports =  {
     
    create_comments : async(req , res) => {
        try{
            const {_id} = req.auth_user;
           const comment_created = await
            comment_service.create_comment_service(_id , req.body);
           res.status(201).json(comment_created);
        }
        catch(error){
            res.status(400).json({ message : 'Error creating comment' , error : error.message });
        }
    }
}