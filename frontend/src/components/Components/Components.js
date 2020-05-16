import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Components.css";
import { Select, Spin, Radio,Checkbox,Tooltip } from "antd";
import {
  changeComponentSearch,
  getComponents,
  selectComponents,
  openComponentsModal,
  loadingComponents,
  getCategoriesComponent,
  getSpecificComponents
} from "../../reducers/components";
import {bodyFixed} from "../../reducers/global"
import ComponentsModal from "./ComponentsModal";
import debounce from "lodash/debounce";
import { MdList } from "react-icons/md";
import AddContainerModal from "../Container/AddContainerModal";

const { Option, OptGroup } = Select;
let timeout = null;
class Components extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      initialComponentsLoad: true,
      selectedCategory: "Container",
      selectedCategoryID: "",
      isSearch: false,
      categoryMemory:"Container",
      afterSearch:false,
      myComponents:false,
      numOfScroll: 1,
      scrollvalue: 0,
    };
    // this.getComponents = debounce(props.getComponents, 800);
  }

  componentWillMount() {
    // TODO get initial list of popular ingredients
    // this.props.getComponents();
    // this.props.getComponents();
    this.props.getCategoriesComponent();
  }

  getComponentsList = () => {
    if (this.state.initialComponentsLoad) {
      this.props.loadingComponents();
      // this.props.getComponents();
      // this.props.getContainerFromAPI();
      this.setState({ initialComponentsLoad: false });
    }
  };
  handleRadioChange = e => {
    
    this.setState({
      selectedCategory: e.target.value,
      selectedCategoryID: e.target.id,
      isSearch: false,
      categoryMemory:e.target.value,
      numOfScroll: 1,
      scrollvalue: 0
    });
    // this.props.getSpecificComponents(e.target.id);
    this.props.getComponents({cat:e.target.id,page:1})
  };

  handleScroll = e => {

    const isEndOfList = e.target.scrollTop + e.target.clientHeight+250;
    if (isEndOfList >= e.target.scrollHeight) {
      if (e.target.scrollTop !== this.state.scrollvalue) {
        let value = e.target.scrollTop;
        this.setState({
          numOfScroll: this.state.numOfScroll + 1,
          scrollvalue: value
        });
        // this.props.getIngredients({
        //   search: this.state.ingredientSearch,
        //   page: this.state.numOfScroll + 1
        // });
        this.props.getComponents({
          page: this.state.numOfScroll + 1,ispush:true
        });
      }
    }
  };

  handleSearch = search => {
    if(search != "") this.setState({afterSearch:true})
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ selectedCategory: "" });
      let id = this.getcategoryID(this.state.categoryMemory)
      this.setState({
        numOfScroll: 1,
        scrollvalue: 0
      });
      search === ""
        ? this.setState({ isSearch: false })
        : this.setState({ isSearch: true });
        if(search == ""){ 
          this.setState({selectedCategory:this.state.categoryMemory})
          // this.props.getSpecificComponents(id)
          this.props.getComponents({search:"",cat:id,page:1})

          return
        }
      this.props.getComponents({ search,cat:1000,page:1  });
    }, 900);
  };

  handleOptions = (components, categories) => {
    let value = categories.map((category, index) => {
      if (
        category.name === this.state.selectedCategory ||
         this.state.selectedCategory === "all" ||
        this.state.isSearch
      ) {
        
        let isNotEmpty = this.handleSubOption(components,category)
        return (isNotEmpty && isNotEmpty.length) ? (
          <OptGroup key={category.id} label={category.name}>
            {isNotEmpty}
          </OptGroup>
        ):null
      }
    });
    return value.filter(i => i)
  };


  start_and_end = (str) => {
    if (str.length > 35) {
    return str.substr(0, 20) + '...' + str.substr(str.length-10, str.length);
  }
  return str;
  }

  handleSubOption = (components,category) => {

    let filtered = components.map(item => {
      if(item.category.length){
      if (item.category[0].name === category.name) {
        if (!this.state.myComponents){
        return (

          <Select.Option key={item.id}>
            <Tooltip title= {<div>{item.name}({item.size})</div>}>
            {this.getItem(item)}
                {!this.getItem(item) && (
                  <span className={s.blankSpace}></span>
                )}
            {item.size ? this.start_and_end(`${item.name}${
              item.size
                ? ` (${item.size}${
                    item.size_unit ? item.size_unit : ""
                  })`
                : ""
            }`):(`${item.name}${
              item.size
                ? `(${item.size}${
                    item.size_unit ? item.size_unit : ""
                  })`:''}`)
                }
                </Tooltip>
          </Select.Option>
        );
      }else{
        if (!this.getItem(item)) {

          return (
            <Select.Option key={item.id}>
              {this.getItem(item)}
                  {!this.getItem(item) && (
                    <span className={s.blankSpace}></span>
                  )}
              {`${item.name}${
                item.size
                  ? ` (${item.size}${
                      item.size_unit ? item.size_unit : ""
                    })`
                  : ""
              }`}
            </Select.Option>
          );
        }
      } 
    }else {
        return null;
      }
    }
    })
    return filtered.filter(i => i)
  }

  getItem = item => {
      if (item.is_biz) {
        return (
          <span className={s.logoOuter}>
            <img
              className={s.logoInner}
              src={require("../../static/favicon.png")}
            />
          </span>
        );
      }

    return false;
  };

  handleClose = () => {
    let value = this.props
    if(this.state.selectedCategoryID !== ""){
      let id = this.state.selectedCategoryID
      // setTimeout(function(){value.getSpecificComponents(id)},1000,value,id);
      setTimeout(function(){value.getComponents({cat:id,page:1})},1000,value,id);

    }
    else{
      let categoryID = this.getcategoryID(this.state.selectedCategory)
      // setTimeout(function(){value.getSpecificComponents(categoryID)},1000,value,categoryID);
      setTimeout(function(){value.getComponents({cat:categoryID,page:1})},1000,value,categoryID);


      
    }

  }
  getcategoryID = (name) => {
    if(name == "all"){
      return 1000
    }
    let category = this.props.categories.filter(i=>i.name == name)
    return category[0].id
  }

  render() {
    const {
      componentSearch,
      changeComponentSearch,
      components,
      loading,
      selectComponents,
      openComponentsModal,
      componentsModalOpened,
      componentsLoad,
      categories,
      addContainerModal
    } = this.props;
    return (
      <div>
        {addContainerModal && <AddContainerModal handleClose={this.handleClose}/>}
        <div className={s.radioButtons}>
          {/* <p className={s.categorySelection}>Please Select Category:</p> */}
          {categories.length === 0 || this.props.categoriesLoad ? (
            <Spin
              className={s.spinPadding}
              size="small"
              tip="Loading Categories..."
            >
              <p className={s.spinHeight} />
            </Spin>
          ) : (<Spin
            // className={s.spinPadding}
            size="small"
            // tip="Loading Components..."
            // spinning={this.props.loading}
            spinning={false}

          >
            <Radio.Group
              onChange={this.handleRadioChange}
              value={this.state.selectedCategory}
              className={s.radioGroup}
            >
              {<Radio
                  className={s.eachRadio}
                  key={1000}
                  id={1000}
                  value={"all"}
                >
                 All
                </Radio>}

              {categories.map((category, index) => (
                <Radio
                  className={s.eachRadio}
                  key={index}
                  id={category.id}
                  value={category.name}
                >
                  {category.name}
                </Radio>
              ))}
            </Radio.Group>
            </Spin>
          )}
        </div>
        <div className={s.checkbox}>
          <Checkbox
            onChange={() =>{
              this.setState({ myComponents: !this.state.myComponents })
              let value = this.state.myComponents ? 0:1
              this.props.getComponents({only_mine: value,page:1})
            }
            }
          >
            Show only my Components
          </Checkbox>
        </div>
        <div className={s.componentSearchWrapper}>
          <a onClick={openComponentsModal} className={s.listBtn}>
            <MdList className={s.listIcon} />
          </a>
          {componentsModalOpened && <ComponentsModal myComponents={this.state.myComponents} selectedCategory={this.state.selectedCategory}/>}
                
          <Select
            showSearch
            value={componentSearch}
            className={s.componentSearch}
            placeholder="Select component"
            onPopupScroll={this.handleScroll}
            onMouseEnter={()=>{this.props.bodyFixed(true)}}
            onMouseLeave={()=>{this.props.bodyFixed(false)}}
            notFoundContent={
              componentsLoad ? (
                <label className={s.loadingInfo}>
                  <Spin size="small" />{" "}
                  <span className={s.loadingText}>Loading Components...</span>
                </label>
              ) : (
                <p>No Component Found</p>
              )
            }
            filterOption={false}
            onSearch={search => {
              this.handleSearch(search);
            }}
            onChange={ () =>{
              if(this.state.afterSearch){ 
                this.setState({afterSearch:false})
                this.handleSearch("")}
              changeComponentSearch()
            }
            }
            onSelect={id => {
              
              const newComponent = components.find(item => item.id == id);
              selectComponents([newComponent]);
            }}
            onDropdownVisibleChange={() => {
              this.getComponentsList();
            }}
          >
            {this.handleOptions(components, categories)}
          </Select>
        </div>
      </div>
    );
  }
}

const mapState = state => ({
  ...state.components,
  addContainerModal:state.container.addContainerModal
});

const mapDispatch = {
  getComponents,
  changeComponentSearch,
  selectComponents,
  openComponentsModal,
  loadingComponents,
  getCategoriesComponent,
  getSpecificComponents,
  bodyFixed
};

export default connect(
  mapState,
  mapDispatch
)(withStyles(s)(Components));
