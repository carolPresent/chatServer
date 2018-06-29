/**
 * Created by Swapnil Kumar on 5/30/2017.
 */
const validator=require('validator');

const functions=require('./functions.js');
const models=require('./models.js');
const constants=require('./constants.js').get();

var validateUserICode=(iCode)=>{
    var userList=functions.fetchListJson(constants.databaseUsers);
    var findParticularUser=userList.filter((user)=>user.iCode===iCode);
    if(findParticularUser.length==0)
        return -1;
    if(findParticularUser[0].status===true)
        return -2;
    return 1;
};

var validateRegisterModel=(registerModel)=>{
    if(!registerModel.name)
        return models.responseJson('Failed',400,'name field does not exist');
    if(!registerModel.iCode)
        return models.responseJson('Failed',400,'iCode field does not exist');
    if(!registerModel.password)
        return models.responseJson('Failed',400,'password field does not exist');
    if(registerModel.name.length==0)
        return models.responseJson('Failed',400,'name field should have some length');
    if(registerModel.iCode.length!=64)
        return models.responseJson('Failed',400,'iCode field is invalid');
    if(registerModel.password.length==0)
        return models.responseJson('Failed',400,'password field should have some length');

    return models.responseJson('Success',200,'All good');
};

var validateLoginModel=(loginModel)=>{
    if(!loginModel.handle)
        return models.responseJson('Failed',400,'handle field does not exist');
    if(!loginModel.password)
        return models.responseJson('Failed',400,'password field does not exist');
    if(loginModel.handle.length==0)
        return models.responseJson('Failed',400,'handle field should have some length');
    if(loginModel.password.length==0)
        return models.responseJson('Failed',400,'password field should have some length');

    return models.responseJson('Success',200,'All good');
};

var validateLogoutModel=(logoutModel)=>{
    if(!logoutModel.handle)
        return models.responseJson('Failed',400,'handle field does not exist');
    if(!logoutModel.token)
        return models.responseJson('Failed',400,'token field does not exist');
    if(logoutModel.handle.length==0)
        return models.responseJson('Failed',400,'handle field should have some length');
    if(logoutModel.token.length==0)
        return models.responseJson('Failed',400,'token field is invalid');

    return models.responseJson('Success',200,'All good');
};

var validateInviteRequest=(inviteModel)=>{
    if(!inviteModel.email)
        return models.responseJson('Failed',400,'email field does not exist');
    if(!inviteModel.handle)
        return models.responseJson('Failed',400,'handle field does not exist');
    if(inviteModel.handle.length==0)
        return models.responseJson('Failed',400,'handle field should have some length');
    if(!validator.isEmail(inviteModel.email))
        return models.responseJson('Failed',400,'email field is invalid');

    return models.responseJson('Success',200,'All good');
};

var validateCreateGroupRequest=(newGroupModel)=>{
    if(!newGroupModel.handle)
        return models.responseJson("Failed",400,"handle field for group does not exist");
    if(!newGroupModel.userToken)
        return models.responseJson("Unauthorized request",401,"userToken is not found");
    if(!newGroupModel.description)
        return models.responseJson("Failed",400,"description is not found");

    return models.responseJson("Success",200,"All good");
};

var validateAddNewMember=(addMemberToGroupModel)=>{
    if(!addMemberToGroupModel.newUserHandle)
        return models.responseJson("Failed",400,"newUserHandle does not exist");
    if(!addMemberToGroupModel.handle)
        return models.responseJson("Failed",400,"handle does not exist");
    if(!addMemberToGroupModel.userToken)
        return models.responseJson("Failed",400,"userToken does not exist");

    return models.responseJson("Success",200,"All good");
};

module.exports={
    validateUserICode,
    validateRegisterModel,
    validateLoginModel,
    validateLogoutModel,
    validateInviteRequest,
    validateCreateGroupRequest,
    validateAddNewMember
};