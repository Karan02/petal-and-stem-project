import React from "react";
import { Popconfirm } from "antd";

class DeleteEntry extends React.Component {
  render() {
    return (
      <div>
        <Popconfirm
          title="Are you sure you want to delete ?"
          onConfirm={(e) => {e.stopPropagation();this.props.handleDelete()}}
          // onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <a href="#" onClick={(event)=>event.stopPropagation()}>Delete</a>
        </Popconfirm>
      </div>
    );
  }
}
export default DeleteEntry;
