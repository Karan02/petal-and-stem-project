import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Container.css";
import { Button, Card, Select, Spin } from "antd";
import {
  changeContainerSearch,
  changeSelectedContainer,
  getContainers,
  openContainersModal,
  onContainerImportChange,
  onDownloadClick
} from "../../reducers/container";
import ContainersModal from "./ContainersModal";
import debounce from "lodash/debounce";
import { MdList } from "react-icons/md";
import Components from "../Components/Components";
import ComponentsForm from "../Components/ComponentsForm";
import { deselectComponent, saveFields } from "../../reducers/components";
import  ContainerUploadComponent  from "./ContainerUpload";
import AddContainerModal from "./AddContainerModal";

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 1000);
};

class Container extends React.Component {
  constructor(props) {
    super(props);
    // this.setState({});
    this.getContainers = debounce(props.getContainers, 800);
  }

  componentWillMount() {
    // TODO get initial list of popular containers
    // this.props.getContainers();
  }

  getContainerFromAPI = () => {
    this.props.getContainers();
  };
  render() {
    const {
      containers,
      loading,
      selectedContainer,
      changeSelectedContainer,
      openContainersModal,
      containersModalOpened,
      selectedComponents,
      deselectComponent,
      prices,
      currency,
      currencies,
      error,
      formRef,
      onSubmit,
      fields,
      saveFields,
      onContainerImportChange,
      onDownloadClick,
      selectedFileList,
      
    } = this.props;
    const tabList = [
      {
        key: "Step 2: Add all container items",
        tab: "Step 2: Add all container items"
      }
    ];

    return (
      <Card
        className={s.container}
        title={"Container Parts"}
        bodyStyle={{ minHeight: 50 }}
        tabList={tabList} 
        extra={<div>
          {
            <ContainerUploadComponent
              onContainerImportChange={onContainerImportChange}
              onDownloadClick={onDownloadClick}
              selectedFileList={selectedFileList}
              dummyRequest={dummyRequest}
            />
          }
        </div>}               
      >
        <div className={s.ingredientsLabelI}>
          
        </div>
        <Components getContainerFromAPI={this.getContainerFromAPI} />
        <ComponentsForm
          ref={formRef}
          prices={prices}
          currency={currency}
          currencies={currencies}
          error={error}
          loading={loading.prices}
          selectedComponents={selectedComponents}
          deselectComponent={deselectComponent}
          fields={fields}
          saveFields={saveFields}
          selectedContainer={selectedContainer}
        />
      </Card>
    );
  }
}

const mapState = state => ({
  ...state.container,
  selectedComponents: state.components.selectedComponents,
  fields: state.components.fields,
  currency: state.global.currency,
  currencies: state.global.currencies
});

const mapDispatch = {
  getContainers,
  changeContainerSearch,
  changeSelectedContainer,
  openContainersModal,
  deselectComponent,
  saveFields,
  onContainerImportChange,
  onDownloadClick
};

export default connect(mapState, mapDispatch)(withStyles(s)(Container));
