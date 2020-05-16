import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import { Button, Icon, Input, Modal, Table, Popconfirm } from "antd";
import s from "./ProductModal.css";
import { PAGE_SIZE } from "../../constants";
import {
  changeSelectedProduct,
  closeProductsModal,
  getProducts,
  // changeSelectedProduct,
  deleteProduct,
  handleDeleteAll
} from "../../reducers/product";
import debounce from "lodash/debounce";
import DeleteEntry from "../common/delete/index";

class ProductModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productSearch: "",
      selectedrow: null,
      onrow: null,
      selectedRows:[],
      currentPage:0
    };

    // this.getProducts = debounce(this.props.getProducts, 800)
  }

  componentWillMount() {
    this.setState({
      selectedrow: this.props.selectedProduct
    });
    this.props.getProducts({ page: 1, page_size: PAGE_SIZE });
  }


  handleChangeSelection =  (keys, selectedRows) => {
    // console.log("selected rows",selectedRows)
    this.setState({selectedRows:selectedRows})
    // this.props.changeSelectedRows(keys, selectedRows)
  }

  handleDeleteAll = () => {
    const ids = this.state.selectedRows.map(row => row.id)
    this.props.handleDeleteAll(ids,this.state.currentPage)
    this.setState({selectedRows:[]})
  }



  setonrow = record => {
    this.setState({
      // onrow: record
      selectedrow:record
    });
    this.ok(record)
  };
  changeRecipeSearch = e => {
    const search = e;
    this.setState({ productSearch: search });
    this.props.getProducts({search, page: 1, page_size: PAGE_SIZE });
  };

  ok = (record) => {
    // this.props.changeSelectedProduct(this.state.selectedrow);
    this.props.changeSelectedProduct(record);
    this.props.closeProductsModal();
  };

  setSelectedRow = record => {
    this.setState({
      selectedrow: record
    });
  };

  deleteProduct = () => {
    this.props.deleteProduct(this.state.onrow.id);
  };

  render() {
    const {
      loading,
      productsLoad,
      selectedRows,
      changeSelectedProduct,
      productsModal,
      getProducts,
      closeProductsModal,
      products
    } = this.props;

    const columns = [
      {
        title: "Product Name",
        dataIndex: "name",
        sorter:true,
        width: "20%",
        sortDirections:["descend", "ascend", "descend"],
        render:(name) => <a className={"nameLink"}>{name}</a>

      },
      // {
      //   title: "Ingredients",
      //   dataIndex: "recipe",
      //   width: "30%",
      //   render: (recipe, superIndex) => (
      //     <div key={superIndex}>
      //       {recipe.ingredients.map((ingredient, index) => (
      //         <label key={index}>
      //           {index === 0
      //             ? (ingredient.raw_material.raw_ingredient ? ingredient.raw_material.raw_ingredient.name:"")
      //             : `, ` + (ingredient.raw_material.raw_ingredient ? ingredient.raw_material.raw_ingredient.name:"")}
      //         </label>
      //       ))}
      //     </div>
      //   )
      // },
      {
        title: "Components",
        dataIndex: "container",
        width: "30%",
        render: (container, superIndex) => (
          <div key={superIndex}>
            {container.components.map((component, index) => (
              <label key={index}>
                {index === 0
                  ? component.component.name
                  : `, ` + component.component.name}
              </label>
            ))}
          </div>
        )
      },
      // {
      //   title: "Action",
      //   key: "action",
      //   className: s.action,
      //   width: "20%",
      //   render: () => <DeleteEntry handleDelete={() => this.deleteProduct()} />
      // }
    ];

    // const columns = [
    //   {
    //     title: 'Common Name',
    //     dataIndex: 'name',
    //     key: 'name',
    //     sorter: true,
    //     width: 150,
    //   },
    //   {
    //     title: 'Latin Name',
    //     dataIndex: 'latin_name',
    //     key: 'latinName',
    //     sorter: true,
    //     className: s.latinNameColumn,
    //     width: 200,
    //   },
    //   // {
    //   //   title: 'Quantity',
    //   //   dataIndex: 'quantity',
    //   //   key: 'quantity',
    //   //   sorter: true,
    //   //   className: s.quantityColumn,
    //   //   width: 100,
    //   //   render: (quantity) => parseFloat(quantity).toFixed(2)
    //   // },
    //   // {
    //   //   title: 'Unit',
    //   //   dataIndex: 'quantity_unit',
    //   //   key: 'quantityUnit',
    //   //   sorter: true,
    //   //   className: s.quantityUnitColumn,
    //   //   width: 70,
    //   // },
    //   // {
    //   //   title: 'Price',
    //   //   dataIndex: 'price',
    //   //   key: 'price',
    //   //   sorter: true,
    //   //   className: s.priceColumn,
    //   //   width: 75,
    //   // },
    //   // {
    //   //   title: 'Currency',
    //   //   dataIndex: 'currency.name',
    //   //   key: 'currency.name',
    //   //   sorter: true,
    //   //   className: s.currencyColumn,
    //   //   width: 75,
    //   // },
    //   {
    //     title: 'Category',
    //     dataIndex: 'category',
    //     key: 'category',
    //     sorter: true,
    //     className: s.categoryColumn,
    //     width: 100,
    //     render: (categories) => categories.map(item => item.name).join(', ')
    //   },
    //   {
    //     title: 'Biological',
    //     dataIndex: 'biological',
    //     key: 'biological',
    //     className: s.biologicalColumn,
    //     width: 100,
    //     render: (biological) => biological ? <Icon type='check-circle-o'/> : null
    //   },
    //   {
    //     title: 'Supplier',
    //     dataIndex: 'supplier.name',
    //     key: 'supplier',
    //     className: s.supplierColumn,
    //   },{
    //     title: 'Action',
    //     key: 'action',
    //     className: s.action,
    //     width:300,
    //     render:  () => <DeleteEntry deleteProduct={this.deleteProduct} />
    //   },
    // ]

    const { productSearch } = this.state;
    const { Search } = Input;
    return (
      <Modal
        visible={productsModal}
        width={1100}
        title={"Your Recipes"}
        destroyOnClose={true}
        onCancel={closeProductsModal}
        footer={
          null
          // <React.Fragment>
            /* <Button key="cancel" onClick={closeProductsModal}> */
              /* Cancel */
            /* </Button> */
            /* <Button
              key="ok"
              type="primary"
              disabled={!this.state.selectedrow}
              onClick={this.ok}
            >
              OK
            </Button> */
          /* </React.Fragment> */
        }
      ><div className={s.displayFlex}>
        <Search
          // value={productSearch}
          // onChange={this.changeRecipeSearch}
          className={s.searchInput}
          placeholder="Search"
          allowClear
          onSearch={search => {
            this.changeRecipeSearch(search);
            // getProducts({search})}
          }}
        />
        <div className={s.alignCenter}>
        {this.state.selectedRows.length > 0 ? <Popconfirm
          title="Are you sure you want to delete selected recipes? Once deleted it can't be recovered."
          onConfirm={this.handleDeleteAll}
          // onCancel={cancel}
          okText="Yes"
          cancelText="No"
        ><Button><a>Delete</a></Button></Popconfirm> :null}
        </div>
        </div>
        <Table
          scroll={{ y: 500 }}
          size="small"
          className={"product"}
          columns={columns}
          dataSource={products}
          rowClassName={"product-row"}
          pagination={{ pageSize: PAGE_SIZE, total: this.props.count }}
          rowKey={record => record.id}
          rowSelection={{
            // selectedRowKeys: selectedRows.map(item => item.id),
            onChange: this.handleChangeSelection
          }}
          onChange={(pagination, filters, sorter) =>{ 
            this.setState({currentPage:pagination.current}) 
            getProducts({
              search: this.state.productSearch,
              filters,
              sorter,
              page: pagination.current,
              page_size: PAGE_SIZE
            })
          }
          }
          // expandable = {{
            // rowExpandable:  record => record.recipe.ingredients.length !== 0,
            expandedRowRender ={record => {
            if(record.recipe.ingredients.length > 0){
            return <div> <span>Ingredients : </span>
                  {record.recipe.ingredients.map((ingredient, index) => (
                    <label key={index}>
                      {index === 0
                        ? (ingredient.raw_material.raw_ingredient ? ingredient.raw_material.raw_ingredient.name:"")
                        : `, ` + (ingredient.raw_material.raw_ingredient ? ingredient.raw_material.raw_ingredient.name:"")}
                    </label>
                  ))}
                </div>}
              else{
                return <p>No Ingredients with this Recipe</p>
              }  
              
                }}
            
                // }}
          
          loading={loading.products}
          
          onRow={(record, index) => {
            // console.log("record",record)
          //   <React.Fragment>
          //   <Button key="cancel" onClick={closeProductsModal}>
          //     Cancel
          //   </Button>
          //   {/* <Button
          //     key="ok"
          //     type="primary"
          //     disabled={!this.state.selectedrow}
          //     onClick={this.ok}
          //   >
          //     OK
          //   </Button> */}
          // </React.Fragment>
            return {
              onClick: event => {
                this.setonrow(record);
              }
            };
          }}
        />
        <p className={"alignRight"}>Total Recipes:{this.props.count}</p>

      </Modal>
    );
  }
}

const mapState = state => ({
  ...state.product,
  productsLoad: state.product.productsLoad,
  product: state.product
});

const mapDispatch = {
  getProducts,
  closeProductsModal,
  changeSelectedProduct,
  // changeSelectedProduct,
  deleteProduct,
  handleDeleteAll
};

export default connect(mapState, mapDispatch)(withStyles(s)(ProductModal));
