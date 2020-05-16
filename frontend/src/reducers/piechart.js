import createReducer from "../createReducer"

export const GET_DETAILS = "piechart.GET_DETAILS"



export const calculateOption = (ingredients) => (dispatch,getState) => {
  // const arrayOptions = ingredients.filter((ingre,index) =>  index != 0)
  // const array = arrayOptions.map((ingre,index) => parseFloat(ingre[1]))
  // let total = 0
  // for(let i=0;i<array.length;i++){
  //   total += parseFloat(array[i])
  // }
  // const options = ingredients.map((ingre, index) =>
  //   index !== 0 ? (
  //     <div>
  //       <p>
  //         {ingre[0]} - {parseFloat(ingre[1]).toFixed(2) + " grams " + `( ${(((parseFloat(ingre[1]).toFixed(2))/total)*100).toFixed(2)}% )`}
  //       </p>
  //     </div>
  //   ) : null
  // );
  // dispatch({type:GET_DETAILS,options})
}



const initialState = {
  options:[]
}

export default createReducer(initialState,{
  [GET_DETAILS]: (state,action) => ({
    options:action.options
  })
})