import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import {
  Col,
  Form,
  Icon,
  Input,
  InputNumber,
  Row,
  Select,
  Tooltip
} from "antd";
import s from "./RawMaterialsForm.css";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import { VOLUME_UNITS, MASS_UNITS, RAWMATERIAL_UNITS } from "../../constants";
import { MdRemove } from "react-icons/md";
import { withCurrency } from "../../components";
import cn from "classnames";

const { TextArea } = Input;

class RawMaterialsForm extends React.Component {
  componentWillReceiveProps(nextProps) {
    // TODO find a better way https://github.com/ant-design/ant-design/issues/7228
    if (
      nextProps.selectedRawMaterials &&
      !isEqual(nextProps.selectedRawMaterials, this.props.selectedRawMaterials)
    ) {
      const {
        getFieldDecorator,
        setFieldsValue,
        resetFields
      } = this.props.form;
      const fields = {};
      const recipeChanged = !isEqual(
        nextProps.selectedRecipe,
        this.props.selectedRecipe
      );
      nextProps.selectedRawMaterials.forEach(item => {
        const { id } = item.raw_material;
        getFieldDecorator(`ingredients[${id}].raw_material`);
        fields[`ingredients[${id}].raw_material`] = id;
        let quantity = item.quantity;
        let unit = item.unit;
        if (
          nextProps.fields.ingredients &&
          nextProps.fields.ingredients[id] &&
          !recipeChanged
        ) {
          quantity = nextProps.fields.ingredients[id].quantity;
          unit = nextProps.fields.ingredients[id].unit;
        }
        getFieldDecorator(`ingredients[${id}].quantity`);
        fields[`ingredients[${id}].quantity`] = quantity;
        getFieldDecorator(`ingredients[${id}].unit`);
        fields[`ingredients[${id}].unit`] = unit;
      });

      if (recipeChanged) {
        if (nextProps.selectedRecipe) {
          fields.name = nextProps.selectedRecipe.name;
        } else {
          fields.name = undefined;
        }
      } else if (
        true
        // nextProps.fields.name
      ) {
        fields.name = nextProps.fields.name;
      }

      // remove all old fields
      // this line I have removed below
      resetFields();
      // replace form with new fields

      setFieldsValue({ ...fields });
    }
  }

  getDermalPercent = (item, index) => {
    if (index === 0) {
      return (
        <div className={s.dermal}>
          <p>
            Suggested Topical Max:{" "}
            {item.raw_material.raw_ingredient.drmaxpercent
              ? parseFloat(item.raw_material.raw_ingredient.drmaxpercent).toFixed(2)
              : "0"}{" "}
            %
          </p>
        </div>
      );
    }
  };

  render() {
    const {
      selectedRawMaterials,
      deselectRawMaterial,
      prices,
      loading,
      currency,
      error,
      currencies,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div
        // hideRequiredMark
        className={s.rawMaterialsForm}
      >
        {selectedRawMaterials.map(item => {
          // TODO
          let itemPrices = {};
          const price = prices.find(
            p => p.raw_material === item.raw_material.id
          );
          if (price) {
            itemPrices = price.currencies;
          }
          return (
            <Row
              key={item.raw_material.id}
              className={s.itemRow}
              type="flex"
              align="middle"
              gutter={24}
            >
              <Row type="flex" align="left" gutter={24} span={24}>
                <a
                  className={s.removeBtn}
                  onClick={() => deselectRawMaterial(item)}
                >
                  <Icon type="minus-square" className={s.removeIcon} />
                </a>
                <div className={s.rawMaterialsTextHandler}>
                 <Tooltip title={
                   <div>
                 <p>{"supplier: " + item.raw_material.supplier.name }</p>
                 <p>{"order number: "+ item.raw_material.ordernum}</p>
                </div>
                }>
                  <span className={s.title}>
                    {item.raw_material.raw_ingredient.name}
                  </span>
                  {item.raw_material.raw_ingredient.latin_name && (
                    <React.Fragment>
                      <br />
                      <span
                        className={s.latinTitle}
                        
                      >
                        ({item.raw_material.raw_ingredient.latin_name})
                      </span>
                    </React.Fragment>
                  )}
                  </Tooltip>
                </div>

                <div className={s.ingredientsInfo}>
                  <span>
                    <Tooltip
                      placement="topLeft"
                      title={
                        item.raw_material.raw_ingredient.warning.length > 0
                          ? item.raw_material.raw_ingredient.warning.map((warning, index) => {
                              return (
                                <div>
                                  {this.getDermalPercent(item, index)}
                                  <div key={index}>
                                    <div className={s.safetyWarnItem}>
                                      {warning.warning}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          : null
                      }
                    >
                      {item.raw_material.raw_ingredient.warning.length > 0 ? (
                        //  <Icon type="warning" twoToneColor="#f00" theme="twoTone" />
                        <img
                          className={s.logo}
                          src={require("../../static/warning-round.png")}
                          alt={"logo"}
                          height="22"
                          width="22"
                        />
                      ) : null}
                    </Tooltip>
                  </span>
                </div>

                <Form.Item className={s.idWrapper}>
                  {getFieldDecorator(
                    `ingredients[${item.raw_material.id}].raw_material`,
                    {}
                  )(<InputNumber />)}
                </Form.Item>
              </Row>
              <div className={s.ingredientsContainer}>
                <Col className={s.col}>
                  <Form.Item className={s.quantityWrapper} help="">
                    {getFieldDecorator(
                      `ingredients[${item.raw_material.id}].quantity`,
                      {
                        rules: [{ required: true }]
                      }
                    )(
                      <InputNumber
                        min={0}
                        placeholder="Qty"
                        className={s.quantity}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col className={s.col}>
                  <Form.Item className={s.unitWrapper} help="">
                    {getFieldDecorator(
                      `ingredients[${item.raw_material.id}].unit`,
                      {
                        rules: [{ required: true }]
                      }
                    )(
                      <Select showSearch filterOption={true} placeholder="Unit" className={s.unit}>
                        {RAWMATERIAL_UNITS.map((unit,index) => (
                          <Select.Option key={unit}>{unit}</Select.Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col className={s.priceWrapper}>
                  {loading ? (
                    <Icon type="loading" />
                  ) : !isNil(itemPrices[currency.key]) ? (
                    <Tooltip
                      placement="topRight"
                      // title={currencies.map(item =>
                      //   currency.key !== item.key ? (
                      //     <div key={item.key}>
                      //       {withCurrency(item, itemPrices[item.key])}
                      //     </div>
                      //   ) : null
                      // )}
                    >
                      <div className={s.marginCurrency}>
                        {withCurrency(
                          currency,
                          itemPrices[currency.key],
                          s.price
                        )}
                      </div>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        error && error.error_message
                          ? error.error_message
                          : "Not enough data."
                      }
                    >
                      <Icon type="warning" />
                    </Tooltip>
                  )}
                </Col>
              </div>
            </Row>
          );
        })}
        {/* <div className={s.row}> */}

        {/* </Form> */}
      </div>
    );
  }
}

export default Form.create({
  onValuesChange(props, fields, values) {
    props.saveFields(values, fields);
  }
})(withStyles(s)(RawMaterialsForm));
