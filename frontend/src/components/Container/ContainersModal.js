import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import { Input, Modal, Table } from "antd";
import s from "./ContainersModal.css";
import {
  changeSelectedContainer,
  closeContainersModal,
  getContainers
} from "../../reducers/container";
import debounce from "lodash/debounce";

class ContainersModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      containerSearch: undefined
    };

    this.getContainers = debounce(this.props.getContainers, 800);
  }

  changeContainerSearch = e => {
    const search = e.target.value;
    this.setState({ containerSearch: search });
    this.getContainers({ search });
  };

  selectContainer = container => {
    this.props.changeSelectedContainer(container);
    this.props.closeContainersModal();
  };

  render() {
    const {
      loading,
      containersModalOpened,
      getContainers,
      closeContainersModal,
      containers
    } = this.props;

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: true,
        width: 220
      },
      {
        title: "Total Price",
        dataIndex: "total_price",
        key: "totalPrice",
        sorter: true,
        className: s.priceColumn
      }
    ];

    const { containerSearch } = this.state;

    return (
      <Modal
        visible={containersModalOpened}
        width={900}
        title={"Select Container"}
        onCancel={closeContainersModal}
        footer={null}
      >
        <Input.Search
          value={containerSearch}
          onChange={this.changeContainerSearch}
          className={s.searchInput}
          placeholder="Search"
          onSearch={search => getContainers({ search })}
        />
        <Table
          scroll={{ y: 500 }}
          size="small"
          columns={columns}
          dataSource={containers}
          pagination={false}
          rowKey={record => record.id}
          rowClassName={s.row}
          onChange={(pagination, filters, sorter) =>
            getContainers({ filters, sorter })
          }
          loading={loading.containers}
          onRow={record => ({
            onClick: () => this.selectContainer(record)
          })}
        />
      </Modal>
    );
  }
}

const mapState = state => ({
  ...state.container
});

const mapDispatch = {
  getContainers,
  closeContainersModal,
  changeSelectedContainer
};

export default connect(mapState, mapDispatch)(withStyles(s)(ContainersModal));
