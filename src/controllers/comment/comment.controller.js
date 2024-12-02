



const {
    createcomment,
    updateComment,
    getAllComments,
    getCommentsByListingId,
    deleteComment,
} = require("./comment.service");

exports.createcomment = async (req, res) => {
    const comment = await createcomment(req.user_id, req.body);
    res.json({message: 'Create comment successed', data: comment});
}

exports.updateComment = async (req, res) => {
    const comment = await updateComment(req.params, req.user_id, req.body);
    res.json({message: 'Updated comment successed', data: comment});
}

exports.getAllComments = async (req, res) => {
    const comments = await getAllComments(req.query);
    res.json({message: 'Comments', data: comments});
}

exports.getCommentsByListingId = async (req, res) => {
    const comments = await getCommentsByListingId(req.params, req.query);
    res.json({message: 'Comments', data: comments});
}

exports.deleteComment = async (req, res) => {
    await deleteComment(req.params, req.user_id);
    res.json({message: 'Delete comment successed', data: true});
}



/* 
getAllComments
getCommentsByListingId
deleteComment

*/
