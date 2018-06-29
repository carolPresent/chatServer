/**
 * Created by Swapnil Kumar on 5/30/2017.
 */
const crypto=require('crypto');
const models=require('./models.js');

var generateToken=(user)=>{
    var messageToDigest=user.userHandle+new Date().getDate().toString()+new Date().getTime().toString();
    var hash=crypto.createHash('sha256').update(messageToDigest).digest('base64');
    return models.session(user.id,hash,new Date().toDateString()+' , '+ new Date().toTimeString());
};

var createHash=(txt)=>{
    var hash=crypto.createHash('sha256').update(txt).digest('base64');
    return hash;
};

var generateInviteCode=(inviteModel)=>{
    return crypto.createHash('sha256').update(inviteModel.handle+inviteModel.email).digest('hex');
};

var genreateGroupThreadSuffix=(groupId)=>{
    var hash=crypto.createHash('sha256').update(groupId).digest('hex');
    return groupId+hash.substr(0,10);
};

module.exports={
    generateToken,
    createHash,
    generateInviteCode,
    genreateGroupThreadSuffix
};