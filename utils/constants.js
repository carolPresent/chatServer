/**
 * Created by Swapnil Kumar on 5/30/2017.
 */
const path = require('path');
var appDir = path.dirname(require.main.filename);

var get=()=>{
  return {
      databaseCount:appDir+'/database/count.json',
      databaseGroups:appDir+'/database/groups.json',
      databaseSessions:appDir+'/database/sessions.json',
      databaseUsers:appDir+'/database/users.json',
      databaseApiHelp:appDir+'/database/apihelp.json',
      databaseMessages:appDir+'/database/messages.json'
  };
};

module.exports={
    get
};