import React from "react";
// import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from "./Recipe.css";
import { Upload, Button, Icon, Tooltip, message } from "antd";
// () => window.location = "api.petalandstem.local/static/ingredients_template.xlsx"
export const RecipeUploadComponent = ({
  onRecipeImportChange,
  onDownloadClick,
  selectedFileList,
  dummyRequest,
  openAddIngredientsModal
}) => {
  return (
    <div className={s.ingredientsLabelTwo}>
       <div className={s.icons}>
        <Tooltip title="Add Ingredients">
          <Button className="buttonExtra paddingTopButton"  onClick={() =>{      
            openAddIngredientsModal()
           }} shape="circle">
            {/* <Icon type="plus" className="iconExtra" /> */}
            <img src={require("../../static/plus.png")} height={"24px"} width={"24px"} />
          </Button>
        </Tooltip>
      </div>
      <div className={s.icons}>
        <Upload
          onChange={e => {
            console.log("herererererer",e)
            onRecipeImportChange(e);
            const { status } = e.file;
            console.log("----------------> status = ", status)
            console.log("----------------> e.file = ", e.file)
            console.log("----------------> e = ", e)                        
            if (status !== "uploading") {
              // console.log(e.file, e.fileList);
            }
            if (status === "done") {
             
              
            } else if (status === "error") {
              message.error(`Ingredients upload failed.`);
              
            }
            
           
          }}
          fileList={selectedFileList}
          customRequest={dummyRequest}
        >
          <Tooltip title="Upload ingredients data">
            <Button className="buttonExtra"  shape="circle">
              {/* <Icon type="upload" className="iconExtra" /> */}
            <img src={require("../../static/upload.png")} height={"27px"} width={"27px"} />
              
            </Button>
          </Tooltip>
        </Upload>
      </div>
      <div className={s.icons}>
        <Tooltip title="Download ingredients data template">
          <Button className="buttonExtra"  onClick={onDownloadClick} shape="circle">
            {/* <Icon type="download" className="iconExtra" /> */}
            <img src={require("../../static/download.png")} height={"27px"} width={"27px"} />

          </Button>
        </Tooltip>
      </div>
      <div>
        <Tooltip
          placement="topLeft"
          title="You can upload your custom ingredients using an Excel file but it needs to be in a specific format.   Use the download link (down arrow) to get the format of the template to use.   If you have any problems please contact us and we will try to resolve the issue right away.   If you need help integrating your ingredients or just want us to do it we can do that too."
          arrowPointAtCenter
        >
          <Button className="buttonExtra paddingTopButton"  shape="circle">
            {/* <Icon type="info" className="iconExtra" /> */}
            <img src={require("../../static/info.png")} height={"24px"} width={"24px"} />

          </Button>
        </Tooltip>{" "}
      </div>
    </div>
  );
};

// export default (withStyles(s)(RecipeUploadComponent));
