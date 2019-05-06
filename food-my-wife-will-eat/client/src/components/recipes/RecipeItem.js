import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";
import SelectListGroup from "../common/SelectListGroup";
import {
  deleteRecipe,
  addLike,
  removeLike,
  addRating
} from "../../actions/recipeActions";

class RecipeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onDeleteClick(id) {
    this.props.deleteRecipe(id);
  }

  onLikeClick(id) {
    this.props.addLike(id);
  }

  onUnlikeClick(id) {
    this.props.removeLike(id);
  }

  findUserLike(likes) {
    const { auth } = this.props;
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  hasUserRating(ratings) {
    const { auth } = this.props;

    if (ratings.filter(rating => rating.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { auth, recipe } = this.props;

    const ratingData = {
      user: auth.user.id,
      rating: this.state.rating
    };

    this.props.addRating(recipe._id, ratingData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { recipe, auth, showActions } = this.props;
    let getRating;
    let userRating;
    let sumOfRatings = 0;
    let avgRating;
    if (this.hasUserRating(recipe.ratings)) {
      getRating = recipe.ratings.filter(rating => rating.user === auth.user.id);
      userRating = getRating[0].rating.toString();
    }

    if (recipe.ratings.length > 0) {
      let i;
      for (i in recipe.ratings) {
        sumOfRatings += recipe.ratings[i].rating;
      }
      avgRating = sumOfRatings / recipe.ratings.length;
    }

    const options = [
      { label: 0, value: 0 },
      { label: 0.5, value: 0.5 },
      { label: 1, value: 1 },
      { label: 1.5, value: 1.5 },
      { label: 2, value: 2 },
      { label: 2.5, value: 2.5 },
      { label: 3, value: 3 },
      { label: 3.5, value: 3.5 },
      { label: 4, value: 4 },
      { label: 4.5, value: 4.5 },
      { label: 5, value: 5 }
    ];
    const splitIngredients = recipe.ingredients.split(";");
    const splitDirections = recipe.directions.split(";");

    const ingredients = splitIngredients.map((ingredient, index) => (
      <li key={index} className="ingredients">
        {ingredient}
      </li>
    ));

    const directions = splitDirections.map((direction, index) => (
      <li key={index} className="directions">
        {direction}
      </li>
    ));

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-xs-12">
            <div className="lead">
              <Link to={`/recipe/${recipe._id}`}>
                <h4 className="recipe-header">{recipe.title}</h4>
              </Link>
              <p>
                by <Link to={`/profile/${recipe.handle}`}>{recipe.name}</Link>
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12">
            <div className="lead">
              {recipe.ratings.length > 0 ? (
                <div>
                  <span className="little">
                    Overall rating: <strong>{avgRating}</strong> (based on{" "}
                    {recipe.ratings.length} votes)
                  </span>
                </div>
              ) : null}
              {this.hasUserRating(recipe.ratings) ? (
                <span className="little">
                  You rated this recipe <strong>{userRating}/5</strong>.
                </span>
              ) : (
                <div className="little">
                  <span>Rate this recipe:</span>

                  <form onSubmit={this.onSubmit}>
                    <SelectListGroup
                      name="rating"
                      value={this.state.rating}
                      onChange={this.onChange}
                      options={options}
                    />
                    <input
                      type="submit"
                      value="Rate"
                      className="btn btn-info btn-block rating-button"
                    />
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-xs-12">
            <div className="lead">
              <div>
                <span>
                  {recipe.user === auth.user.id ? (
                    <div className="btn-group mb-4" role="group">
                      <Link
                        to={`/recipe/${recipe._id}/edit-recipe`}
                        className="btn btn-light"
                      >
                        <i className="text-info mr-1" /> Edit Recipe
                      </Link>
                    </div>
                  ) : null}
                </span>
                <br />
                <h5>Ingredients</h5>
                <ul>{ingredients}</ul>
                <br />
                <h5>Directions</h5>
                <ol>{directions}</ol>
                <br />
              </div>
            </div>
            {showActions ? (
              <div className="container">
                <div className="likesAndComments">
                  <button
                    onClick={this.onLikeClick.bind(this, recipe._id)}
                    type="button"
                    className="btn btn-light mr-1"
                  >
                    <i
                      className={classnames("fas fa-thumbs-up", {
                        "text-info": this.findUserLike(recipe.likes)
                      })}
                    />
                    <span className="badge badge-light">
                      {recipe.likes.length}
                    </span>
                  </button>
                  <button
                    onClick={this.onUnlikeClick.bind(this, recipe._id)}
                    type="button"
                    className="btn btn-light mr-1"
                  >
                    <i className="text-secondary fas fa-thumbs-down" />
                  </button>
                  <Link
                    to={`/recipe/${recipe._id}`}
                    className="btn btn-info mr-1"
                  >
                    Comments
                  </Link>
                  {recipe.user === auth.user.id ? (
                    <button
                      onClick={this.onDeleteClick.bind(this, recipe._id)}
                      type="button"
                      className="btn btn-danger mr-1"
                    >
                      <i className="fas fa-times" />
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

RecipeItem.defaultProps = {
  showActions: true
};

RecipeItem.propTypes = {
  deleteRecipe: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  addRating: PropTypes.func.isRequired,
  recipe: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteRecipe, addLike, removeLike, addRating }
)(RecipeItem);
