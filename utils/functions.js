/**
 * Created by Swapnil Kumar on 5/30/2017.
 */
const fs=require('fs');
const models=require('./models.js');
const security=require('./security.js');
const constants=require('./constants.js').get();

var fetchListJson=(path)=>{
    try{
        return JSON.parse(fs.readFileSync(path));
    }  catch(e){
        return [];
    }
};

var fetchJson=(path)=>{
    try{
        return JSON.parse(fs.readFileSync(path));
    }  catch(e){
        return {};
    }
};

var save=(path,item)=>{
    try{
        fs.writeFileSync(path,JSON.stringify(item,undefined,2));
    } catch(e){
        console.log(`Error occurred in saving to path : ${path}`);
    }
};

var getCurrentUserCount=()=>{
    var countFileJson=fetchJson(constants.databaseCount);
    return countFileJson.users;
};

var addNewUser=(userModel)=>{
    var usersList=fetchListJson(constants.databaseUsers);
    usersList.push(userModel);
    save(constants.databaseUsers,usersList);
    changeCountJson(models.count(1,0,0));
};

var createInviteCode=(inviteModel)=>{
    var userList=fetchListJson(constants.databaseUsers);
    var checkEmailUnique=userList.filter((user)=>user.email===inviteModel.email);
    if(checkEmailUnique.length>0)
        return models.responseJson("Failed",200,"Email already exist");

    var checkUserHandleUnique=findUser(inviteModel.handle);
    if(checkUserHandleUnique)
        return models.responseJson("Failed",200,"Handle already exist");

    var codeForInvitation=security.generateInviteCode(inviteModel);

    if(!emailVerification(inviteModel.email))
        return models.responseJson("Failed",200,"Email not verified");

    var newUser=models.user(getCurrentUserCount()+1,inviteModel.email,codeForInvitation,"",inviteModel.handle,"",false);
    addNewUser(newUser);
    return models.responseJson("Success",200,"Invite created successfully",models.invite(codeForInvitation,64));
};

var emailVerification=(email)=>{
    return true;
}

var changeCountJson=(count)=>{
    var countFileJson=fetchJson(constants.databaseCount);
    countFileJson.users+=count.users;
    countFileJson.groups+=count.groups;
    countFileJson.sessions+=count.sessions;
    save(constants.databaseCount,countFileJson);
}

var findUser=(userHandle)=>{
    var userList=fetchListJson(constants.databaseUsers);
    var user=userList.filter((user)=>user.handle==userHandle);
    if(user.length>0)
        return user[0];
    return false;
}

var userLogin=(loginModel)=>{
    var userList=fetchListJson(constants.databaseUsers);
    var user=userList.filter((user)=>user.handle==loginModel.handle);
    if(user.length==0)
        return models.responseJson("Failed",200,"User not found");
    var requestPasswordHash=security.createHash(loginModel.password);
    if(user[0].password!==requestPasswordHash)
        return models.responseJson("Failed",200,"Password not matched");

    return models.responseJson("Success",200,"Login successful");
};

var userLogout=(logoutModel,userId)=>{
    var sessionList=fetchListJson(constants.databaseSessions);
    var getUserSession=sessionList.filter((session)=>session.userId===userId);
    if(getUserSession.length==0)
        return models.responseJson("Failed",200,"No session detected");

    if(getUserSession[0].token===logoutModel.token)
    {
        var userSessionIndex=sessionList.findIndex((session)=>session.userId===userId);
        sessionList.splice(userSessionIndex,1);
        changeCountJson(models.count(0,0,-1));
        save(constants.databaseSessions,sessionList);
        return models.responseJson("Success",200,"Successful logout");
    }

    return models.responseJson("Failed",200,"Invalid token");
};

var createNewUserSession=(user)=>{
    var newSession=security.generateToken(user);
    var sessionList=fetchListJson(constants.databaseSessions);
    var findOldSession=sessionList.filter((session)=>session.userId===user.id);
    var returnSession=models.sessionPublic(user.handle,newSession.token,newSession.created,user.name);
    if(findOldSession.length>0){
        var findOldSessionIndex=sessionList.findIndex((session)=>session.userId===user.id);
        sessionList[findOldSessionIndex]=newSession;
        save(constants.databaseSessions,sessionList);
        return returnSession;
    }
    sessionList.push(newSession);
    save(constants.databaseSessions,sessionList);
    changeCountJson(models.count(0,0,1));
    return returnSession;
};

var updateUserOnRegistration=(registerModel)=>{
    var userList=fetchListJson(constants.databaseUsers);
    var userIndex=userList.findIndex((user)=>user.iCode===registerModel.iCode);
    userList[userIndex].password=security.createHash(registerModel.password);
    userList[userIndex].status=true;
    userList[userIndex].name=registerModel.name;
    save(constants.databaseUsers,userList);
};

var findLoggedInUser=(token)=>{
    var sessionList=fetchListJson(constants.databaseSessions);
    var getSession=sessionList.filter((session)=>session.token===token);
    if(getSession.length==0)
        return [];

    var userList=fetchListJson(constants.databaseUsers);
    var user=userList.filter((user)=>user.id===getSession[0].userId);
    return user;
};

var createNewGroupThread=(gId)=>{
    return security.genreateGroupThreadSuffix(`grp_${gId}`);
};

module.exports={
    fetchListJson,
    getCurrentUserCount,
    addNewUser,
    findUser,
    createNewUserSession,
    userLogin,
    userLogout,
    createInviteCode,
    updateUserOnRegistration,
    fetchJson,
    createNewGroupThread,
    findLoggedInUser,
    save,
    changeCountJson
};