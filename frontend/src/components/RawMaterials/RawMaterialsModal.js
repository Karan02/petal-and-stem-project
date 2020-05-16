import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import { Button, Icon, Input, Modal, Table, Checkbox,Popconfirm, Tooltip, message } from "antd";
import s from "./RawMaterialsModal.css";
import { PAGE_SIZE } from "../../constants";
import {
  changeSelectedRows,
  closeRawMaterialsModal,
  getRawMaterials,
  selectRawMaterials,
  handleDelete,
  getRawMaterialsForSelectedCategory,
  handleDeleteAll
} from "../../reducers/rawMaterials";
import debounce from "lodash/debounce";
import DeleteEntry from "../common/delete/index";

class RawMaterialsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rawMaterialSearch: "",
      selectedrow: null,
      selectedRows:[],
      currentPage:0,
      cat:this.props.cat
    };

    // this.getRawMaterials = debounce(this.props.getRawMaterials({page:1}), 800)
  }

  componentWillMount() {
    this.props.getRawMaterials({ page: 1, page_size: PAGE_SIZE,search:null,only_mine:0 });
  }
  componentWillUnmount() {
    this.props.getRawMaterialsForSelectedCategory(this.props.selectedCategory,this.props.myIngredients)
  }

  changeRawMaterialSearch = e => {
    const search = e;
    this.setState({ rawMaterialSearch: search });
    if(e == ""){
      this.props.getRawMaterials({ search, page: 1,cat:this.state.cat,page_size: PAGE_SIZE });
      return
    }
    this.props.getRawMaterials({ search, page: 1,cat:1000,page_size: PAGE_SIZE });
  };
  
  handleChangeSelection =  (keys, selectedRows) => {
    // console.log("selected rows",selectedRows)
    this.setState({selectedRows:selectedRows})
    this.props.changeSelectedRows(keys, selectedRows)
  }



  ok = () => {
    this.setState({ rawMaterialSearch: "" });
    this.props.selectRawMaterials(this.props.selectedRows);
    this.props.closeRawMaterialsModal();
  };

  setSelectedRow = record => {
    this.setState({
      selectedrow: record
    });
  };

  handleDelete = () => {
    this.props.handleDelete(this.state.selectedrow.id);
  };

  handleDeleteAll = () => {
    const ids = this.state.selectedRows.map(row => row.id && !row.is_biz)
    const defaultids = this.state.selectedRows.map(row => !row.is_biz)
   
    this.props.handleDeleteAll(ids,this.state.currentPage,defaultids)
    this.setState({selectedRows:[]})
  }

  allowDelete = () => {
    if (this.state.selectedRows.length == 0) return true
    const owner = this.state.selectedRows.map(row => row.is_biz)
    
    const filteredIDS = owner.filter(row=>row)
    
    return filteredIDS.length > 0 ? true:false
  }

  render() {
  
    const {
      loading,
      selectedRows,
      changeSelectedRows,
      rawMaterialsModalOpened,
      getRawMaterials,
      closeRawMaterialsModal,
      rawMaterials
    } = this.props;

    const columns = [
      {
        title: "Common Name",
        dataIndex: "raw_ingredient.name",
        key: "raw_ingredient__name",
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        width: 150,
        render:(e,f) => {
        if(!f.available) return <Tooltip title={"Price not available"}><div>{e}</div></Tooltip>
        return <div>{e}</div>
        }
      },
      {
        title: "Latin Name",
        dataIndex: "raw_ingredient.latin_name",
        key: "raw_ingredient__latin_name",
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.latinNameColumn,
        width: 120,
        render:(e,f) => {
          if(!f.available) return <Tooltip title={"Price not available"}><div>{e}</div></Tooltip>
          return <div>{e}</div>
          }
      },
      {
        title: 'Qty',
        dataIndex: 'quantity',
        key: 'quantity',
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.quantityColumn,
        width: 80,
        render: (quantity) => parseFloat(quantity).toFixed(2)
      },
      {
        title: 'Unit',
        dataIndex: 'quantity_unit',
        key: 'quantity_unit',
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.quantityUnitColumn,
        width: 70,
        render:(e,f) => {
          if(!f.available) return <Tooltip title={"Price not available"}><div>{e}</div></Tooltip>
          return <div>{e}</div>
          }
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.priceColumn,
        width: 75,
        render:(e,f) => {
          if(!f.available) return <Tooltip title={"Price not available"}><div>{e}</div></Tooltip>
          return <div>{e}</div>
          }
      },
      {
        title: 'Cur.',
        dataIndex: 'currency.name',
        key: 'currency__name',
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.currencyColumn,
        width: 75,
        render:(e,f) => {
          if(!f.available) return <Tooltip title={"Price not available"}><div>{e}</div></Tooltip>
          return <div>{e}</div>
          }
      },
      {
        title: "Category",
        dataIndex: "raw_ingredient.category",
        key: "raw_ingredient__category__name",
        sorter: true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.categoryColumn,
        width: 150,
        render: categories => categories ? categories.map(item => item.name).join(", "):""
      },
      {
        title: "Organic",
        dataIndex: "biological",
        key: "biological",
        className: s.biologicalColumn,
        width: 50,
        render: biological =>
          biological ? <Icon type="check-circle-o" /> : null
      },
      {
        title: "Supplier",
        dataIndex: "supplier.name",
        key: "supplier__name",
        sorter:true,
        sortDirections:["descend", "ascend", "descend"],
        className: s.supplierColumn,
        width: 100,
        render:(e,f) => {
          if(!f.available) return <Tooltip title={"Price not available"}><div>{e}</div></Tooltip>
          return <div>{e}</div>
          }
      },
      // {
      //   title: "Action",
      //   key: "action",
      //   className: s.action,
      //   width: 300,
      //   render: () => <DeleteEntry handleDelete={this.handleDelete} />
      // }
    ];

    const { rawMaterialSearch } = this.state;
    return (
      <Modal
        visible={rawMaterialsModalOpened}
        destroyOnClose={true}
        width={1100}
        bodyStyle={{ height: 450 }}
        title={"Select ingredients"}
        onCancel={closeRawMaterialsModal}
        footer={
          <React.Fragment>
            <Button key="cancel" onClick={closeRawMaterialsModal}>
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
      ><div className={s.displayFlex}>
        <Input.Search
          // value={rawMaterialSearch}
          // onChange={this.changeRawMaterialSearch}
          className={s.searchInput}
          placeholder="Search"
          allowClear
          onSearch={search => {
            this.changeRawMaterialSearch(search);
            // getRawMaterials({search,page:1,page_size:PAGE_SIZE})
          }}
        />
       
        
      <div className={s.alignCenter}>
      <span className={s.myrawMaterial}><Checkbox
        value={this.props.only_mine}
        onChange={(e) => {
          const value = e.target.checked ? 1:0
          this.props.getRawMaterials({only_mine:value})}
        }
      >
        Show only my Ingredients
      </Checkbox></span>
        {<Popconfirm
          title="Are you sure you want to delete selected ingredients? Once deleted it can't be recovered."
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
          dataSource={rawMaterials}
          pagination={{ pageSize: PAGE_SIZE, total: this.props.count }}
          rowKey={record => record.id}
          rowClassName={record => !record.available && "disabled-row"}
          onChange={(pagination, filters, sorter) => {
            this.setState({currentPage:pagination.current})
            getRawMaterials({
              search: this.state.rawMaterialSearch,
              filters,
              sorter,
              page: pagination.current,
              page_size: PAGE_SIZE
            });
          }}
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
        <p className={"alignRight"}>Total Ingredients:{this.props.count}</p>
      </Modal>
    );
  }
}

const mapState = state => ({
  ...state.rawMaterials,
  
});

const mapDispatch = {
  getRawMaterials,
  closeRawMaterialsModal,
  changeSelectedRows,
  selectRawMaterials,
  handleDelete,
  getRawMaterialsForSelectedCategory,
  handleDeleteAll
};

export default connect(mapState, mapDispatch)(withStyles(s)(RawMaterialsModal));
