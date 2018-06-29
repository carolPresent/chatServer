/**
 * Created by Swapnil Kumar on 5/30/2017.
 */
const validations=require('../utils/validations.js');
const models=require('../utils/models.js');
const functions=require('../utils/functions.js');

//change it
var register=(registerModel)=>{
    var badRequestValidator=validations.validateRegisterModel(registerModel);

    if(badRequestValidator.statusCode!=200)
        return badRequestValidator;

    var id=validations.validateUserICode(registerModel.iCode);
    if(id==-1)
        return models.responseJson('Failed',200,'No invitation code found');

    if(id==-2)
        return models.responseJson('Failed',200,'User already registered');

    functions.updateUserOnRegistration(registerModel);
    return models.responseJson('Success',200,'User registered successfully');
};

var invitationCode=(inviteModel)=>{
    var badRequestValidator=validations.validateInviteRequest(inviteModel);

    if(badRequestValidator.statusCode!=200)
        return badRequestValidator;

    return functions.createInviteCode(inviteModel);
};

var handleAvailable=(userHandleAvailableModel)=>{
  if(!userHandleAvailableModel.handle)
      return models.responseJson("Failed",400,"handle does not exist");

  var user=functions.findUser(userHandleAvailableModel.handle);
  if(!user)
      return models.responseJson("Success",200,"Handle available");

  return models.responseJson("Failed",200,"Handle unavailable");
};

var login=(loginModel)=>{
    var badRequestValidator=validations.validateLoginModel(loginModel);

    if(badRequestValidator.statusCode!=200)
        return badRequestValidator;

    var getUser=functions.userLogin(loginModel);

    if(getUser.status==="Failed")
        return getUser;

    var user=functions.findUser(loginModel.handle);
    var createSession=functions.createNewUserSession(user);

    return models.responseJson("Success",200,'Successful login',createSession);
};

var logout=(logoutModel)=>{
    var badRequestValidator=validations.validateLogoutModel(logoutModel);

    if(badRequestValidator.statusCode!=200)
        return badRequestValidator;

    var getUser=functions.findUser(logoutModel.handle);

    if(!getUser)
        return models.responseJson("Failed",200,"Invalid user handle");
    return functions.userLogout(logoutModel,getUser.id);
};

module.exports={
    register,
    login,
    logout,
    handleAvailable,
    invitationCode
};