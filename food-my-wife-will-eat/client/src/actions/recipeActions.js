import axios from "axios";

import {
  ADD_RECIPE,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_RECIPES,
  GET_RECIPE,
  RECIPE_LOADING,
  DELETE_RECIPE,
  EDIT_RECIPE
} from "./types";

// Add Recipe
export const addRecipe = recipeData => dispatch => {
  dispatch(clearErrors());
  axios
    .post("/api/recipes", recipeData)
    .then(res =>
      dispatch({
        type: ADD_RECIPE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Edit Recipe
export const editRecipe = (id, recipeData) => dispatch => {
  axios
    .put(`/api/recipes/${id}`, recipeData)
    .then(res =>
      dispatch({
        type: EDIT_RECIPE,
        payload: res.data
      })
    )
    .then((window.location = `/recipe/${id}`))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Recipes
export const getRecipes = () => dispatch => {
  dispatch(setRecipeLoading());
  axios
    .get("/api/recipes")
    .then(res =>
      dispatch({
        type: GET_RECIPES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Get Recipe
export const getRecipe = id => dispatch => {
  dispatch(setRecipeLoading());
  axios
    .get(`/api/recipes/${id}`)
    .then(res =>
      dispatch({
        type: GET_RECIPE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Recipe
export const deleteRecipe = id => dispatch => {
  if (window.confirm("Are you sure? The recipe will be permanently deleted.")) {
    axios
      .delete(`/api/recipes/${id}`)
      .then(res =>
        dispatch({
          type: DELETE_RECIPE,
          payload: id
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

// Add Like
export const addLike = id => dispatch => {
  axios
    .post(`/api/recipes/like/${id}`)
    .then(res => dispatch(getRecipes()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Remove Like
export const removeLike = id => dispatch => {
  axios
    .post(`/api/recipes/unlike/${id}`)
    .then(res => dispatch(getRecipes()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add Comment
export const addComment = (recipeId, commentData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/recipes/comment/${recipeId}`, commentData)
    .then(res =>
      dispatch({
        type: GET_RECIPE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Delete Comment
export const deleteComment = (recipeId, commentId) => dispatch => {
  if (window.confirm("Are you sure? Your comment will be deleted.")) {
    axios
      .delete(`/api/recipes/comment/${recipeId}/${commentId}`)
      .then(res =>
        dispatch({
          type: GET_RECIPE,
          payload: res.data
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

// Add Rating
export const addRating = (recipeId, ratingData) => dispatch => {
  dispatch(clearErrors());
  axios
    .post(`/api/recipes/ratings/${recipeId}`, ratingData)
    .then(res => dispatch(getRecipes()))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set loading state
export const setRecipeLoading = () => {
  return {
    type: RECIPE_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
