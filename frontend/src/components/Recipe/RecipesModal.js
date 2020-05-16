import React from "react";
import { connect } from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import { Input, Modal, Table } from "antd";
import s from "./RecipesModal.css";
import {
  changeSelectedRecipe,
  closeRecipesModal,
  getRecipes
} from "../../reducers/recipe";
import debounce from "lodash/debounce";

class RecipesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeSearch: undefined
    };

    this.getRecipes = debounce(this.props.getRecipes, 800);
  }

  changeRecipeSearch = e => {
    const search = e.target.value;
    this.setState({ recipeSearch: search });
    this.getRecipes({ search });
  };

  selectRecipe = recipe => {
    this.props.changeSelectedRecipe(recipe);
    this.props.closeRecipesModal();
  };

  render() {
    const {
      loading,
      recipesModalOpened,
      getRecipes,
      closeRecipesModal,
      recipes
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

    const { recipeSearch } = this.state;

    return (
      <Modal
        visible={recipesModalOpened}
        width={900}
        title={"Select Recipe"}
        onCancel={closeRecipesModal}
        footer={null}
      >
        <Input.Search
          value={recipeSearch}
          onChange={this.changeRecipeSearch}
          className={s.searchInput}
          placeholder="Search"
          onSearch={search => getRecipes({ search })}
        />
        <Table
          scroll={{ y: 500 }}
          size="small"
          columns={columns}
          dataSource={recipes}
          pagination={false}
          rowKey={record => record.id}
          rowClassName={s.row}
          onChange={(pagination, filters, sorter) =>
            getRecipes({ filters, sorter })
          }
          loading={loading.recipes}
          onRow={record => ({
            onClick: () => this.selectRecipe(record)
          })}
        />
      </Modal>
    );
  }
}

const mapState = state => ({
  ...state.recipe
});

const mapDispatch = {
  getRecipes,
  closeRecipesModal,
  changeSelectedRecipe
};

export default connect(mapState, mapDispatch)(withStyles(s)(RecipesModal));
