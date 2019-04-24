import {
  ADD_RECIPE,
  GET_RECIPES,
  GET_RECIPE,
  DELETE_RECIPE,
  RECIPE_LOADING,
  EDIT_RECIPE
} from "../actions/types";

const initialState = {
  recipes: [],
  recipe: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case RECIPE_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_RECIPES:
      return {
        ...state,
        recipes: action.payload,
        loading: false
      };
    case GET_RECIPE:
      return {
        ...state,
        recipe: action.payload,
        loading: false
      };
    case ADD_RECIPE:
      return {
        ...state,
        recipes: [action.payload, ...state.recipes]
      };
    case EDIT_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe._id === action.payload)
      };
    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe._id !== action.payload)
      };
    default:
      return state;
  }
}
