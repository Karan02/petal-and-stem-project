import React from 'react'

const withCurrency = (currency, content, className) => {
  // let prefix = null
  let suffix = null
  if(currency.symbol){
  //  prefix = currency.symbol[0]
   suffix = currency.symbol[0] 
  }
  return (
    <div className={className}>
      {/* {prefix} */}
      {content}
      {' '}{suffix}
    </div>
  )
}

export default withCurrency