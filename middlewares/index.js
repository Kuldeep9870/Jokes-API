import fs from 'fs';

function logReqRes(filename){
    return (req,res,next)=>{
        fs.appendFile(filename, `\n${new Date()} - ${req.ip}  ${req.method}  ${req.path}`,(err,data)=> next());
    }
}

export {logReqRes};

// fs.appendFile(filename, `${new Date()} - ${req.ip}  ${req.method}  ${req.path}`,(err,data)=> next());