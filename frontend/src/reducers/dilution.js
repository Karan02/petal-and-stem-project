import createReducer, { RESET_STORE } from "../createReducer";

export const UPDATE_PERCENT = "Dilution.UPDATE_PERCENT"
export const UPDATE_PIECHART =  "Dilution.UPDATE_PIECHART"
export const CLEAR = "Dilution.CLEAR";

export const updateDilutionPercent= (dilutionArray) => (dispatch,getState) => {
    let percent = 2;
    let sumEssentialOil = 0;
    let sumNonEssentialOil = 0;
    let piechart = [["Ingredient","weight"]];
    let { selectedRawMaterials } = getState().rawMaterials;
    dilutionArray.forEach((dilutionSingle) => {
        selectedRawMaterials.forEach((selectedRawMaterial)=>{
            if(dilutionSingle.id === selectedRawMaterial.raw_material.id){
                
                const pie = [
                    `${selectedRawMaterial.raw_material.raw_ingredient.name}`,
                   dilutionSingle.weight
                ];
                piechart.push(pie);

                const item = selectedRawMaterial.raw_material.raw_ingredient;
                const itemCategoriesNames = item.category && item.category.length > 0 && item.category.map(categoryItem => categoryItem.name);
                if (itemCategoriesNames.indexOf("Essential Oil") > -1) {
                    sumEssentialOil += dilutionSingle.weight
                    console.log("----------------------> EO   ", item.name, ", dilutionSingle.weight", dilutionSingle.weight)                    
                }
                else{
                    sumNonEssentialOil+= dilutionSingle.weight
                    console.log("----------------------> NON EO   ", item.name, ", dilutionSingle.weight", dilutionSingle.weight)                                        
                }
            }
        });
    });
    if (sumEssentialOil === 0) {
        percent = 0
    }
    else if (sumNonEssentialOil === 0) {
        percent = 100
    }
    else if(sumNonEssentialOil > 0) {
        percent = (sumEssentialOil/sumNonEssentialOil * 100)
        console.log("----------------------> percent = ", percent)
    }
    dispatch({type:UPDATE_PERCENT, percent})
    dispatch({type:UPDATE_PIECHART,piechart})
}

export const cleardilution = () => ({type: CLEAR})

const initialState = {
 percent: 0,
 piechart:[]
}

export default createReducer(initialState, {
   [UPDATE_PERCENT]: (state, { percent }) =>({
       percent
   }),
   [UPDATE_PIECHART]:(state,{piechart}) => ({
    piechart
   }),
   [CLEAR]: (state, action) => RESET_STORE
})
