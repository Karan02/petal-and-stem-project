import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import { Button, Icon, Input, Modal, Table,Checkbox,Popconfirm } from "antd";
import DeleteEntry from "../common/delete/index";
import s from "./ComponentsModal.css";
import { PAGE_SIZE } from "../../constants";
import {
  changeSelectedRows,
  closeComponentsModal,
  getComponents,
  selectComponents,
  handleDelete,
  getComponentsSelectedCategory,
  handleDeleteAll
} from "../../reducers/components";
import debounce from "lodash/debounce";

class ComponentsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentSearch: "",
      selectedrow: null,
      selectedRows:[],
      currentPage:0,
      cat:this.props.cat

    };
    // this.getComponents = debounce(this.props.getComponents, 800)
  }
  componentWillMount() {
    this.props.getComponents({ page: 1, page_size: PAGE_SIZE,search:undefined,only_mine:0 });
  }

  componentWillUnmount(){
    this.props.getComponentsSelectedCategory(this.props.selectedCategory,this.props.myComponents)
  }

  handleDeleteAll = () => {
    const ids = this.state.selectedRows.map(row => row.id && !row.is_biz)
    const defaultids = this.state.selectedRows.map(row => !row.is_biz)
    this.props.handleDeleteAll(ids,this.state.currentPage,defaultids)
    this.setState({selectedRows:[]})
  }

  handleChangeSelection =  (keys, selectedRows) => {
    // console.log("selected rows",selectedRows)
    this.setState({selectedRows:selectedRows})
    this.props.changeSelectedRows(keys, selectedRows)
  }

  changeComponentSearch = e => {
    const search = e;
    this.setState({ componentSearch: search });
    if(search == ""){
    this.props.getComponents({ search, page: 1,cat:this.state.cat,page_size: PAGE_SIZE });
      return
    }
    this.props.getComponents({ search, page: 1,cat:1000,page_size: PAGE_SIZE });
  };

  ok = () => {
    this.props.selectComponents(this.props.selectedRows);
    this.props.closeComponentsModal();
  };

  handleDelete = () => {
    this.props.handleDelete(this.state.selectedrow.id);
  };

  setSelectedRow = record => {
    this.setState({
      selectedrow: record
    });
  };
  allowDelete = () => {
    if (this.state.selectedRows.length == 0) return true
    const owner = this.state.selectedRows.map(row => row.is_biz)
    
    const filteredIDS = owner.filter(row=>row)
    
    return filteredIDS.length > 0 ? true:false
  }

  render() {
    // console.log("cat",this.state.cat)
    const {
      loading,
      selectedRows,
      changeSelectedRows,
      componentsModalOpened,
      getComponents,
      closeComponentsModal,
      components
    } = this.props;

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        width: 140
      },
      {
        title: "Size",
        dataIndex: "size",
        key: "size",
        sorter: true,
        className: s.sizeColumn,
        sortDirections:["descend", "ascend", "descend"],
        width: 75
      },
      {
        title: "Size Unit",
        dataIndex: "size_unit",
        key: "size_unit",
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.sizeUnitColumn,
        width: 75,
        render: categories => {
          // categories are empty
          return categories;
        }
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.quantityColumn,
        width: 100,
        render: quantity => parseFloat(quantity).toFixed(2)
      },
      {
        title: "Price/Unit",
        dataIndex: "ppu",
        key: "price",
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.ppuColumn,
        width: 90,
        render: price => parseFloat(price).toFixed(2)
      },
      {
        title: 'Cur.',
        dataIndex: 'currency.name',
        key: 'currency__name',
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.currencyColumn,
        width: 75,
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category__name",
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.categoryColumn,
        width: 90,
        render: categories => categories.map(item => item.name).join(", ")
      },
      {
        title: "Supplier",
        dataIndex: "supplier.name",
        key: "supplier__name",
        className: s.supplierColumn,
        sorter:true,
        sortDirections:["descend", "ascend", "descend"],
        width: 100
      },
      // {
      //   title: "Action",
      //   key: "delete",
      //   width: 60,
      //   render: () => <DeleteEntry handleDelete={this.handleDelete} />
      // }
    ];

    const { componentSearch } = this.state;

    return (
      <Modal
        visible={componentsModalOpened}
        width={1100}
        bodyStyle={{ height: 450 }}
        title={"Select Containers"}
        destroyOnClose={true}
        onCancel={closeComponentsModal}
        footer={
          <React.Fragment>
            <Button key="cancel" onClick={closeComponentsModal}>
              Cancel
            </Button>
            <Button
              key="ok"
              type="primary"
              disabled={!selectedRows.length}
              onClick={this.ok}
            >
              OK
            </Button>
          </React.Fragment>
        }
      >
              <div className={s.displayFlex}>

        <Input.Search
          // value={componentSearch}
          // onChange={this.changeComponentSearch}
          className={s.searchInput}
          placeholder="Search"
          allowClear
          onSearch={search => {
            this.changeComponentSearch(search);
            // this.props.getComponents({search,page:1,page_size:PAGE_SIZE}
          }}
        />
        
        
      <div className={s.alignCenter}>
      <span className={s.myComponent}><Checkbox
        value={this.props.only_mine}
        onChange={(e) => {
          const value = e.target.checked ? 1:0
          
          this.props.getComponents({only_mine:value})}
        }
      >
        Show only my Components
      </Checkbox></span>
        {<Popconfirm
          title="Are you sure you want to delete selected components? Once deleted it can't be recovered."
          onConfirm={this.handleDeleteAll}
          // onCancel={cancel}
          okText="Yes"
          cancelText="No"
          disabled={this.state.selectedRows.length > 0 ? false:true}
        ><Button disabled={this.allowDelete()}><a>Delete</a></Button></Popconfirm>}
        </div>
      </div>
        <Table
          scroll={{ y: 250 }}
          size="small"
          columns={columns}
          dataSource={components}
          // pagination={{ pageSize: 6 }}
          pagination={{
            pageSize: PAGE_SIZE,
            total: this.props.count
            // onChange:(page) =>{
            // this.props.getComponents({page})}
          }}
          rowKey={record => record.id}
          onChange={(pagination, filters, sorter) =>{ 
            this.setState({currentPage:pagination.current}) 
            getComponents({
              search: this.state.componentSearch,
              filters,
              sorter,
              page: pagination.current,
              page_size: PAGE_SIZE
            })}
          }
          loading={loading}
          rowSelection={{
            selectedRowKeys: selectedRows.map(item => item.id),
            onChange: this.handleChangeSelection
          }}
          onRow={(record, index) => {
            return {
              onClick: event => {
                this.setSelectedRow(record);
              }
            };
          }}
        />
        <p className={"alignRight"}>Total Components:{this.props.count}</p>

      </Modal>
    );
  }
}

const mapState = state => ({
  ...state.components
});

const mapDispatch = {
  getComponents,
  closeComponentsModal,
  changeSelectedRows,
  selectComponents,
  handleDelete,
  getComponentsSelectedCategory,
  handleDeleteAll
};

export default connect(mapState, mapDispatch)(withStyles(s)(ComponentsModal));
