/**
 * Created by Swapnil Kumar on 5/30/2017.
 */
const functions=require('../utils/functions.js');
const constants=require('../utils/constants.js').get();
const models=require('../utils/models.js');
const validations=require('../utils/validations.js');


var createGroup=(newGroupModel)=>{
    var badRequestValidator=validations.validateCreateGroupRequest(newGroupModel);

    if(badRequestValidator.statusCode!=200)
        return badRequestValidator;

    var groupCount=getGroupCount();
    var groupThread=functions.createNewGroupThread(groupCount+1);
    var groupCreater=functions.findLoggedInUser(newGroupModel.userToken);

    if(groupCreater.length==0)
        return models.responseJson("Unauthorized request",401,"User not logged in");

    var newGroup=models.group(groupCount+1,newGroupModel.description,groupThread,groupCreater[0].id,newGroupModel.handle,[groupCreater[0].id]);
    var groupList=functions.fetchListJson(constants.databaseGroups);
    var findIfGroupHandleExist=groupHandleAvailable({handle:newGroupModel.handle});
    if(findIfGroupHandleExist.status==="Failed")
        return models.responseJson("Failed",200,"Group handle is not available");
    groupList.push(newGroup);
    functions.save(constants.databaseGroups,groupList);
    functions.changeCountJson(models.count(0,1,0));
    return models.responseJson("Success",200,"Group created successfully",
        {thread:groupThread,handle:newGroupModel.handle,description:newGroupModel.description});
};

var addMemberToGroup=(addMemberToGroupModel)=>{
    var badRequestValidator=validations.validateAddNewMember(addMemberToGroupModel);

    if(badRequestValidator.statusCode!=200)
        return badRequestValidator;

    var groupList=functions.fetchListJson(constants.databaseGroups);
    var groupToAddMember=groupList.filter((group)=>group.handle===addMemberToGroupModel.handle);

    if(groupToAddMember.length==0)
        return models.responseJson("Failed",200,"Group does not exist");
    var userList=functions.fetchListJson(constants.databaseUsers);
    var userPerformingAddAction=functions.findLoggedInUser(addMemberToGroupModel.userToken);

    if(userPerformingAddAction.length==0)
        return models.responseJson("Unauthorized request",401,"User not logged in");

    userPerformingAddAction=userPerformingAddAction[0];
    if(userPerformingAddAction.id!=groupToAddMember[0].createdBy)
        return models.responseJson("Unauthorized request",401,"User have not sufficient rights to add a member");

    var userToAdd=userList.filter((user)=>user.handle===addMemberToGroupModel.newUserHandle);

    if(userToAdd.length==0)
        return models.responseJson("Failed",200,`No user found with handle: ${addMemberToGroupModel.newUserHandle}`);

    var userInGroup=groupToAddMember[0].userList.filter((userId)=>userId===userToAdd[0].id);
    if(userInGroup.length>0)
        return models.responseJson("Failed",200,"User is already present in the group");
    var groupIndex=groupList.findIndex((group)=>group.handle===addMemberToGroupModel.handle);
    var user=functions.findUser(addMemberToGroupModel.newUserHandle);
    groupList[groupIndex].userList.push(user.id);
    functions.save(constants.databaseGroups,groupList);
    return models.responseJson("Success",200,"Member added");
};

var getGroupThread=(findThreadModel)=>{
    if(!findThreadModel.groupHandle)
        return models.responseJson("Failed",400,"groupHandle does not exist");

    var groupList=functions.fetchListJson(constants.databaseGroups);
    var group=groupList.filter((grp)=>grp.handle===findThreadModel.groupHandle);
    if(group.length==0)
        return models.responseJson("Failed",200,"Group does not exist");

    return models.responseJson("Success",200,"Group found",{thread:group[0].thread});
};

var getGroupCount=()=>{
    var coutJson=functions.fetchJson(constants.databaseCount);
    return coutJson.groups;
};

var groupHandleAvailable=(groupHandleRequest)=>{
    if(!groupHandleRequest.handle)
        return models.responseJson("Failed",400,"handle does not exist");

    var groupList=functions.fetchListJson(constants.databaseGroups);
    var groupSearch=groupList.filter((group)=>group.handle===groupHandleRequest.handle);

    if(groupSearch.length!=0)
        return models.responseJson("Failed",200,"Group handle not available");

    return models.responseJson("Success",200,"Group handle available");
};

var sendMessage=(token,msg,thread)=>{
    var sessionList=functions.fetchListJson(constants.databaseSessions);
    var getCurrentUserSession=sessionList.filter((session)=>session.token===token)[0];
    var userList=functions.fetchListJson(constants.databaseUsers);
    var getCurrentUser=userList.filter((user)=>user.id===getCurrentUserSession.userId);
    return models.responseJson("Success",200,"Successfully sent message",models.message(msg,thread,getCurrentUser[0].handle));
};

var authorizeMessage=(msg)=>{
    var user=functions.findLoggedInUser(msg.token);
    if(user.length==0)
        return false;
    var groupList=functions.fetchListJson(constants.databaseGroups);
    var group=groupList.filter((group)=>group.thread===msg.thread);
    if(group.length==0)
        return false;
    var usersInGroup=group[0].userList;
    var findUser=usersInGroup.filter((userId)=>userId===user[0].id);
    return findUser.length>0;
};

module.exports={
    sendMessage,
    authorizeMessage,
    createGroup,
    groupHandleAvailable,
    addMemberToGroup,
    getGroupThread
};