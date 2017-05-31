const express=require('express');
const fs=require('fs');
const hbs=require('hbs');
var app=express();
const portNumber=process.env.PORT || 6969;
const http=require('http').Server(app);
const socket=require('socket.io');
const io=socket(http);
const bodyParser=require('body-parser');

const accountController=require('./controllers/account.js');
const chatController=require('./controllers/chat.js');
const helpController=require('./controllers/help.js');

var mainMessageThread="main_thread";
var unauthorizedThread="unauth_thread";

hbs.registerPartials(__dirname+'/views/partials');
app.set('view-engine','hbs');
app.use(bodyParser.json());
app.use((req,res,next)=>{
    var now=new Date().toString();
    var body,requestHeaders=JSON.stringify(req.headers,undefined,2);
    if(req.method==="POST")
    body=JSON.stringify(req.body);
    var log=`${now}\nHttp method: ${req.method}\nPath: ${req.url}\nBody: ${body}\nRequest headers: ${requestHeaders}\n****************\n`;
    fs.appendFile('server.log',log,(err)=>{
        if(err){
            console.log('Unable to respond to server.log');
        }
    });
    next();
});
//Maintenance section starts.
//Uncomment below to set site under maintenance

// app.use((req,res,next)=>{
//     return res.render('maintenance.hbs',{message:'Under maintenance'});
//     next();
// });

//Maintenance section ends.
app.get('/',(req,res)=>{
    res.render('chat.hbs',{
        title:'Real time chat server',
        message:'Lets get started'
    });
});

app.get('/api/help',(req,res)=>{
   res.render('apiHelpPage.hbs',{
       title:"Api help"
   });
});

var onlineUsers=0;

hbs.registerHelper('getCurrentYear',()=>{
        return new Date().getFullYear();
    });

hbs.registerHelper('getHelpPageData',()=>{
        return JSON.stringify(helpController.getApiHelpPageData(),undefined,2);
});

io.on('connection',(socket)=>{
    onlineUsers++;
    console.log(`User connected\nOnline user count: ${onlineUsers}`);
   socket.on(`${mainMessageThread}`,(msg)=>{
       console.log(msg);
       var authFlag=chatController.authorizeMessage(msg);
       if(authFlag)
           io.emit(msg.thread, chatController.sendMessage(msg.token,msg.message,msg.thread));
       else
           io.emit(msg.thread,{status:"Unauthorized request",statusCode:401,message:"User not logged in"});
   });
   socket.on('disconnect',()=>{
       onlineUsers--;
       console.log(`User disconnected\nOnline user count: ${onlineUsers}`);
   });
});

app.post('/api/register',(req,res)=>{
    res.send(accountController.register(req.body));
});

app.post('/api/login',(req,res)=>{
   res.send(accountController.login(req.body));
});

app.post('/api/logout',(req,res)=>{
   res.send(accountController.logout(req.body));
});

app.post('/api/handle',(req,res)=>{
    res.send(accountController.handleAvailable(req.body));
});

app.post('/api/invite',(req,res)=>{
    res.send(accountController.invitationCode(req.body));
});

app.post('/api/creategroup',(req,res)=>{
    res.send(chatController.createGroup(req.body));
});

app.post('/api/addgroupmember',(req,res)=>{
    res.send(chatController.addMemberToGroup(req.body));
});

app.post('/api/grouphandleavailable',(req,res)=>{
    res.send(chatController.groupHandleAvailable(req.body));
});

app.post('/api/groupthread',(req,res)=>{
    res.send(chatController.getGroupThread(req.body));
});

http.listen(portNumber,()=>{
    console.log(`Server is running on port #${portNumber} , ${new Date().toTimeString()}`);
});