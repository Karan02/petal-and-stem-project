import { message } from "antd";
import messages from "../messages";

const fileStatusChecker = (event,selectedFileList,uid) => {
    switch (event.file.status) {
        case "uploading":
          selectedFileList = [event.file];
          break;
        case "done":
         
          selectedFileList = [event.file];
          break;
  
        default:
          
          selectedFileList = [];
      }
    
      return selectedFileList;
}


export const uploadHelper = (event,uid,selectedFileList) => {
    
if (uid === event.file.uid) {
    // } else {
    
     return [fileStatusChecker(event,selectedFileList,uid),uid]
    }
    uid = event.file.uid;
  
    
    selectedFileList = fileStatusChecker(event,selectedFileList,uid);

    if (
     
      checkMimeType(event.file) &&
      checkFileSize(event.file)
    ) {
   
  
    
      return [selectedFileList,uid,event.file]
    
    }
   
    return [selectedFileList,uid]
}

const checkMimeType = (file, event) => {
    
    let err = "";
   
    const types = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"];
  
  
    if (types.every(type => file.type !== type)) {
      
      err = file.type + "This is not a supported format.  Only excel files are supported at this time\n";
    }
  
    if (err !== "") {
      message.error(err);
  
      return false;
    }
    return true;
  };
  
  const checkFileSize = file => {
    let size = 200000;
    let err = "";
  
    if (file.size > size) {
      err = file.type + " is too large, please pick a smaller file\n";
    }
  
    if (err !== "") {
      message.error(err);
  
      return false;
    }
  
    return true;
  };