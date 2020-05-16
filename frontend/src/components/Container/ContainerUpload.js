import React from "react";
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import s from "./Container.css";
import { Upload, Button, Icon, Tooltip, message } from "antd";
import {openAddContainerModal} from "../../reducers/container";
import {connect} from "react-redux";

class  ContainerUploadComponent extends React.Component{
  
  render(){
  const {
      onContainerImportChange,
      onDownloadClick,
      selectedFileList,
      dummyRequest,
      openAddContainerModal
    } = this.props
  return (
    <div className={s.ingredientsLabelTwo}>
      <div className={s.icons}>
        <Tooltip title="Add Component">
          <Button className="buttonExtra paddingTopButton"  onClick={() =>{  
                
            openAddContainerModal();
           }} shape="circle">
            {/* <Icon type="plus" className="iconExtra" /> */}
            <img src={require("../../static/plus.png")} height={"24px"} width={"24px"} />

          </Button>
        </Tooltip>
      </div>
      <div className={s.icons}>
        <Upload
          // onChange={onContainerImportChange}
          customRequest={dummyRequest}
          fileList={selectedFileList}
          onChange={e => {
            const { status } = e.file;
            onContainerImportChange(e);
            if (status !== "uploading") {
            }
            if (status === "done") {
              
              return
            } else if (status === "error") {
              message.error(`Components upload failed.`);
              return
            }
          }}
        >
          <Tooltip title="Upload components data">
            <Button className="buttonExtra"  shape="circle">
              {/* <Icon type="upload" className="iconExtra" /> */}
            <img src={require("../../static/upload.png")} height={"27px"} width={"27px"} />

            </Button>
          </Tooltip>
        </Upload>
      </div>
      <div className={s.icons}>
        <Tooltip title="Download components data template">
          <Button className="buttonExtra"  onClick={onDownloadClick} shape="circle">
            {/* <Icon type="download" className="iconExtra" /> */}
            <img src={require("../../static/download.png")} height={"27px"} width={"27px"} />

          </Button>
        </Tooltip>
      </div>
      <div>
        <Tooltip
          placement="topLeft"
          title="You can upload your custom containers using an Excel file but it needs to be in a specific format.   Use the download link (down arrow) to get the format of the template to use.   If you have any problems please contact us and we will try to resolve the issue right away.   If you need help integrating your containers or just want us to do it we can do that too."
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
  }
};
const mapDispatch = {
  openAddContainerModal
}
export default connect(null,mapDispatch)(withStyles(s)(ContainerUploadComponent));
