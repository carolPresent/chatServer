/**
 * Created by Swapnil Kumar on 5/30/2017.
 */
var responseJson=(st,sC,m,dat)=>{
    return {
        status:st,
        statusCode:sC,
        message:m,
        data:dat
    };
};

var user=(i,em,ic,nam,han,pas,stat)=>{
    return{
        id:i,
        email:em,
        iCode:ic,
        name:nam,
        handle:han,
        password:pas,
        status:stat
    };
};

var login=(han,pas)=>{
    return {
        handle:han,
        password:pas
    };
};

var register=(nam,code,pas)=>{
    return{
        name:nam,
        iCode:han,
        password:pas
    };
};

var group=(i,des,th,creator,han,uls)=>{
  return {
      id:i,
      description:des,
      thread:th,
      handle:han,
      createdBy:creator,
      userList:uls
  };
};

var count=(us,grp,ses)=>{
    return {
        users:us,
        groups:grp,
        sessions:ses
    }
};

var session=(id,tok,dat)=>{
    return {
        userId:id,
        token:tok,
        created:dat
    };
};

var logout=(tok,han)=>{
  return {
      token:tok,
      handle:han
  };
};

var message=(msg,thr,han)=>{
  return {
      message:msg,
      thread:thr,
      handle:han,
      date:new Date().getTime()+' , '+new Date().getDate()
  }
};

var invite=(code,len)=>{
    return {
        iCode:code,
        length:len
    };
};

module.exports={
    responseJson,
    login,
    register,
    user,
    group,
    session,
    logout,
    invite,
    message,
    count
};