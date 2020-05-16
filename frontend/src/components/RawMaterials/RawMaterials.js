import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./RawMaterials.css";
import { Select, Spin, Alert, Icon, Radio, Checkbox, Tooltip } from "antd";
import AddIngredientsModal from "./AddIngredientsModal"
const { OptGroup } = Select;
import {
  changeRawMaterialSearch,
  getRawMaterials,
  selectRawMaterials,
  openRawMaterialsModal,
  loadingRecipes,
  getSpecificRawMaterials
} from "../../reducers/rawMaterials";
import RawMaterialsModal from "./RawMaterialsModal";
import debounce from "lodash/debounce";
import { MdList } from "react-icons/md";
import {bodyFixed} from "../../reducers/global"


const {Option} = Select
let timeout = null;
class RawMaterials extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialRawMaterialsLoad: true,
      selectedCategory: "Carrier Oil",
      myIngredients: false,
      selectedCategoryID:"",
      isSearch:false,
      categoryMemory:"Carrier Oil",
      afterSearch:false,
      numOfScroll: 1,
      scrollvalue: 0,
    
    };
    // this.getRawMaterials = debounce(this.props.getRawMaterials, 800);
    this.timeout =  0;
  }

  componentWillMount() {
    // TODO get initial list of popular ingredients
    // this.props.getRawMaterials();
    this.getRecipe();
  }

 
  // componentDidMount() {
  //   // TODO get initial list of popular ingredients
  //   this.props.getRawMaterials();
  //   this.getRecipe();
  // }

 

  getRecipe = () => {
    if (this.state.initialRawMaterialsLoad) {
      this.props.loadingRecipes();
      // this.props.getRawMaterials();
      // this.props.getRecipesFromAPI();
      this.setState({ initialRawMaterialsLoad: false });
    }
  };

  
  handleScroll = e => {

    const isEndOfList = e.target.scrollTop + e.target.clientHeight+250;
    // console.log("end",isEndOfList)
    if (isEndOfList >= e.target.scrollHeight ) {
      if (e.target.scrollTop !== this.state.scrollvalue) {
        let value = e.target.scrollTop;
        this.setState({
          numOfScroll: this.state.numOfScroll + 1,
          scrollvalue: value
        });
    e.preventDefault()
        
        this.props.getRawMaterials({
          page: this.state.numOfScroll + 1,ispush:true
        });
        
      }
    e.preventDefault()

  }
  e.preventDefault()
  
};


  handleSearch = (search) => {
    if(search != "") this.setState({afterSearch:true})
    if(this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      let id = this.getcategoryID(this.state.categoryMemory)
      this.setState({
        numOfScroll: 1,
        scrollvalue: 0
      });
    if(search != "") this.setState({selectedCategory: ""})
    search === "" ? this.setState({isSearch:false}):this.setState({isSearch:true})
    if(search == ""){ 
      this.setState({selectedCategory:this.state.categoryMemory})
      
      // this.props.getSpecificRawMaterials(id)
      this.props.getRawMaterials({search:"",cat:id,page:1})
      return
    }
    this.props.getRawMaterials({ search,cat:1000,page:1 });
    
    }, 900);
  }

  handleOptions = (rawMaterials, categories) => {
    let filteredCategory = categories.map(category => category.name)
    let array = null
    if(filteredCategory.length > 0){ 
      array = filteredCategory.map((category, index) => {
      
      if (category === this.state.selectedCategory || this.state.selectedCategory === "all" || this.state.isSearch){
       let isNotEmpty = this.handleSubOption(rawMaterials,category)  
       let value = (isNotEmpty && isNotEmpty.length) ? (
          <OptGroup 
          key={index} 
          label={category}
          
          >
           {isNotEmpty}
          </OptGroup>
        ):null
        return value
      }
    })
  }
  return array
  };

  handleSubOption = (rawMaterials,category) => {
    let unfilteredMaterials = []
    if(rawMaterials.length > 0 ){
    // {rawMaterials.length && (rawMaterials.length > 0 ? 
       unfilteredMaterials = rawMaterials.map((material,index) => {
           
              
      let raw_material = material;
    
      let item = raw_material.raw_ingredient;
      if (item && item.category && item.category.length > 0) {
    

        const itemCategoriesNames = item.category.length > 0 && item.category.map(categoryItem => categoryItem.name);
   

        if (itemCategoriesNames.indexOf(category) > -1) {
          if (!this.state.myIngredients) {
    
            
            return (
              <Option 
              key={raw_material.id}
              // label={index+`${category}`} 

              disabled={!raw_material.available}
              >
              <Tooltip title={<div>{raw_material.available ? <div>{item.name} ({item.latin_name})</div>:<div>Price Not Available</div> }</div>}>
                {this.getItem(raw_material)}
                {!this.getItem(raw_material) && (
                  <span className={s.blankSpace}></span>
                )}
                {`${item.name}${
                  item.latin_name ? ` (${item.latin_name})` : ""
                }`}
              </Tooltip>

              </Option>
            );
          } else {
            if (!this.getItem(raw_material)) {
              return (
                <Option 
                key={raw_material.id}
                // label={index+`${category}`} 

                >
    

                  {this.getItem(raw_material)}
                  {!this.getItem(raw_material) && (
                    <span className={s.blankSpace}></span>
                  )}
                  {`${item.name}${
                    item.latin_name ? ` (${item.latin_name})` : ""
                  }`}


                </Option>
              );
            }
          }
        }
      }
    })

    const filteredMaterial = unfilteredMaterials.filter(i => i)
    return filteredMaterial
    
    // )
    // :null)
  // }
  }
}


  getItem = item => {
      if (item.is_biz ) {
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
  handleRadioChange = e => {
    this.setState({ selectedCategory: e.target.value,categoryMemory:e.target.value,selectedCategoryID:e.target.id ,isSearch:false});
    // this.props.getSpecificRawMaterials(e.target.id)
    this.setState({
      numOfScroll: 1,
      scrollvalue: 0
    });
    this.props.getRawMaterials({cat:e.target.id,page:1})
  };

  getRadioClass = () => {
    return this.props.categories.length > 0 ? s.radioButtons : s.hide;
  };

  handleClose = () => {
    let values = this.props
    if(this.state.selectedCategoryID !== ""){
      let id = this.state.selectedCategoryID
      setTimeout(function(){
        // values.getSpecificRawMaterials(id)
        values.getRawMaterials({cat:id,page:1})
      },1000,values,id);
      
      
    }
    else{
      let categoryID = this.getcategoryID(this.state.selectedCategory)
      // setTimeout(function(){values.getSpecificRawMaterials(categoryID)},1000,values);
      setTimeout(function(){values.getRawMaterials({cat:categoryID,page:1})},1000,values);
    }

  }
  getcategoryID = (name) => {
    if(name == "all"){
      return 1000
    }
    let category = this.props.categories.filter(i=>i.name == name)
    return category[0].id
  }
  registerDiv4(el) {
    
    if(!el) return
    el.addEventListener('mouseleave', () =>  {
      
      this.props.bodyFixed(false)});
    el.addEventListener('mouseenter', () => {
     
      this.props.bodyFixed(true)});
  }

 
  render() {
    const {
      rawMaterialSearch,
      changeRawMaterialSearch,
      rawMaterials,
      loading,
      selectRawMaterials,
      openRawMaterialsModal,
      AddIngredientsModalOpened,
      rawMaterialsModalOpened,
      recipesLoad,
      loadingRecipes,
      categories,
      bodyFixed
    } = this.props;
    
    return (
      <div>
        <div className={s.radioButtons}>
          {/* <p className={s.categorySelection}>Please Select Category:</p> */}
          {this.props.categoriesLoad ? (
            <Spin
              className={s.spinPadding}
              size="small"
              tip="Loading Categories..."
            >
              <p className={s.spinHeight}></p>
            </Spin>
          ) : (<Spin
            // className={s.spinPadding}
            size="small"
            // tip="Loading Ingredients..."
            // spinning={loading} 
            spinning={false}

          >
            <Radio.Group
              onChange={this.handleRadioChange}
              value={this.state.selectedCategory}
            >
              {<Radio className={s.eachRadio} key={1000} id={1000} value={"all"}>
                All
              </Radio>}
              {categories.map((category, index) => (
                
                <Radio className={s.eachRadio} key={index} id={category.id} value={category.name}>
                  {category.name}
                </Radio>
              ))}
              
            </Radio.Group></Spin>
          )}
        </div>
        <div className={s.checkbox}>
          <Checkbox
            onChange={() =>{
              this.setState({ myIngredients: !this.state.myIngredients })
              let value = this.state.myIngredients ? 0:1
              this.props.getRawMaterials({only_mine:value,page:1})
            }
            }
          >
            Show only my Ingredients
          </Checkbox>
        </div>
        {/* {onMouseEnter={()=>{
              console.log("here")
              this.props.bodyFixed(true)}} 
              onMouseLeave={()=>{this.props.bodyFixed(false)}}} */}
        <div  ref={(e)=>this.registerDiv4(e,bodyFixed)}
              className={s.rawMaterialSearchWrapper}>
          <a onClick={openRawMaterialsModal} className={s.listBtn}>
            <MdList className={s.listIcon} />
          </a>
          {rawMaterialsModalOpened && <RawMaterialsModal myIngredients={this.state.myIngredients} selectedCategory={this.state.selectedCategory} />}
          {AddIngredientsModalOpened && <AddIngredientsModal selectedCategoryID={this.state.selectedCategoryID} handleClose={this.handleClose} />}
          <Select
            allowClear
            showSearch
            onPopupScroll={(e)=>{
              this.handleScroll(e)}}
            value={rawMaterialSearch}
            className={s.rawMaterialSearch}
            placeholder="Select ingredient"
            defaultActiveFirstOption={false}
            showArrow={false}
            
          
            
            filterOption={false}
            notFoundContent={
              // recipesLoad
              loading ? (
                <label className={s.loadingInfo}>
                  <Spin size="small" />{" "}
                  <span className={s.loadingText}>Loading Ingredients...</span>
                </label>
              ) : (
                <div>
                  {(this.state.selectedCategory !== "" || this.state.isSearch) ? (
                    <p>No Ingredient Found</p>
                  ) : (
                    <p>Please Select Category</p>
                  )}
                </div>
              )
            }
            onSearch={search => {
            
              this.handleSearch(search)
            }}
            onChange={e => {
              
              
              changeRawMaterialSearch();
            }}
            onSelect={id => {
              
              if(this.state.afterSearch){ 
                this.setState({afterSearch:false})
                this.handleSearch("")}
              const newRawMaterial = rawMaterials.find(item => item.id === +id);
              selectRawMaterials([newRawMaterial]);
            }}
            onDropdownVisibleChange={() => {
           

              this.getRecipe();
            }}
          >
            {this.handleOptions(rawMaterials, categories)}
          </Select>
        </div>
        
      </div>
    );
  }
}

const mapState = state => ({
  ...state.rawMaterials,
  categories: state.rawMaterials.categories,
  bodyfixed:state.rawMaterials.bodyfixed
});

const mapDispatch = {
  getRawMaterials,
  changeRawMaterialSearch,
  selectRawMaterials,
  openRawMaterialsModal,
  loadingRecipes,
  bodyFixed,
  getSpecificRawMaterials
};

export default connect(mapState, mapDispatch)(withStyles(s)(RawMaterials));
