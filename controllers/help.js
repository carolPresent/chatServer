/**
 * Created by Swapnil Kumar on 5/31/2017.
 */
const functions=require('../utils/functions.js');
const constants=require('../utils/constants.js').get();

var getApiHelpPageData=()=>{
    return functions.fetchListJson(constants.databaseApiHelp);
};

module.exports={
    getApiHelpPageData
};