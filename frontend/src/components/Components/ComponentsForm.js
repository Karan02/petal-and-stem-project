import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import { Col, Form, Icon, Input, InputNumber, Row, Tooltip } from "antd";
import s from "./ComponentsForm.css";
import isEqual from "lodash/isEqual";
import isNil from "lodash/isNil";
import { MdRemove } from "react-icons/md";
import { withCurrency } from "../../components";

class ComponentsForm extends React.Component {
  componentWillReceiveProps(nextProps) {
    // TODO find a better way https://github.com/ant-design/ant-design/issues/7228
    if (
      nextProps.selectedComponents &&
      !isEqual(nextProps.selectedComponents, this.props.selectedComponents)
    ) {
      const {
        getFieldDecorator,
        setFieldsValue,
        resetFields
      } = this.props.form;
      const fields = {};
      const containerChanged = !isEqual(
        nextProps.selectedContainer,
        this.props.selectedContainer
      );
      nextProps.selectedComponents.forEach(item => {
        const { id } = item.component;
        getFieldDecorator(`components[${id}].component`);
        fields[`components[${id}].component`] = id;
        let quantity = item.quantity;
        if (
          nextProps.fields.components &&
          nextProps.fields.components[id] &&
          !containerChanged
        ) {
          quantity = nextProps.fields.components[id].quantity;
        }
        getFieldDecorator(`components[${id}].quantity`);
        fields[`components[${id}].quantity`] = quantity;
      });

      if (containerChanged) {
        if (nextProps.selectedContainer) {
          fields.name = nextProps.selectedContainer.name;
        } else {
          fields.name = undefined;
        }
      } else if (nextProps.fields.name) {
        fields.name = nextProps.fields.name;
      }

      // remove all old fields
      resetFields();
      // replace form with new fields
      setFieldsValue({ ...fields });
    }
  }

  render() {
    const {
      selectedComponents,
      deselectComponent,
      prices,
      loading,
      currency,
      error,
      currencies
    } = this.props;
    const { getFieldDecorator } = this.props.form;

    return (
      <Form hideRequiredMark className={s.componentsForm}>
        {/* <div className={s.row}>
          <Form.Item className={s.nameWrapper} help=''>
            {getFieldDecorator('name', {
              rules: [
                {required: true},
              ],
            })(
              <Input className={s.name} placeholder='New Name'/>
            )}
          </Form.Item>
        </div> */}
        {selectedComponents &&
          selectedComponents.map(item => {
            // TODO
            let itemPrices = {};
            const price = prices.find(p => p.component === item.component.id);
            if (price) {
              itemPrices = price.currencies;
            }
            return (
              <Row
                key={item.component.id}
                className={s.itemRow}
                type="flex"
                align="middle"
                gutter={8}
              >
                <a
                  className={s.removeBtn}
                  onClick={() => deselectComponent(item)}
                >
                  {/* <MdRemove className={s.removeIcon}/> */}
                  <Icon type="minus-square" className={s.removeIcon} />
                </a>
                <Col span="12" className={s.col}>
                <Tooltip title={
                   <div>
                 <p>{"supplier: " + item.component.supplier.name }</p>
                 <p>{"ordernum: " + item.component.ordernum }</p>                 
                 <p>{"size: "+ item.component.size}</p>
                </div>
                }>
                  <span>
                    {item.component.name +
                      ` (${item.component.size}` +
                      ` ${
                        item.component.size_unit ? item.component.size_unit : ""
                      })`}
                  </span>
                  </Tooltip>
                  {/*TODO*/}
                  <Form.Item className={s.idWrapper}>
                    {getFieldDecorator(
                      `components[${item.component.id}].component`,
                      {}
                    )(<InputNumber />)}
                  </Form.Item>
                </Col>
                <Col span="6" className={s.col}>
                  <Form.Item className={s.quantityWrapper} help="">
                    {getFieldDecorator(
                      `components[${item.component.id}].quantity`,
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
                <Col span="6" className={s.priceWrapper}>
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
                      {withCurrency(
                        currency,
                        itemPrices[currency.key],
                        s.price
                      )}
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
              </Row>
            );
          })}{" "}
      </Form>
    );
  }
}

export default Form.create({
  onValuesChange(props, fields, values) {
    props.saveFields(values, fields);
  }
})(withStyles(s)(ComponentsForm));
