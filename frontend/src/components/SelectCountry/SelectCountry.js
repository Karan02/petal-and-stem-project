import React from 'react'
import {connect} from 'react-redux'
import {Select} from 'antd'

class SelectCountry extends React.Component {
  constructor(props) {
    super(props)
    const enCountries = require(`localized-countries/data/en_US`)
    this.state = {
      // TODO
      countries: require('localized-countries')(process.env.BROWSER ? enCountries : 'en_US').array()
    }
  }

  render() {
    const {locale, ...props} = this.props
    return (
      <Select
        showSearch
        optionFilterProp='children'
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        {...props}
      >
        {this.state.countries.map(country =>
          <Select.Option key={country.code} value={country.code}>{country.label}</Select.Option>
        )}
      </Select>
    )
  }
}

const mapState = state => ({
  locale: state.intl.locale,
})

const mapDispatch = {}

export default connect(mapState, mapDispatch)(SelectCountry)
