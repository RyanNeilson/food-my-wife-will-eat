import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import RecipeItem from "../recipes/RecipeItem";
import CommentForm from "./CommentForm";
import CommentFeed from "./CommentFeed";
import Spinner from "../common/Spinner";
import { getRecipe } from "../../actions/recipeActions";

class Recipe extends Component {
  componentDidMount() {
    this.props.getRecipe(this.props.match.params.id);
  }

  render() {
    const { recipe, loading } = this.props.recipe;
    let recipeContent;

    if (recipe === null || loading || Object.keys(recipe).length === 0) {
      recipeContent = <Spinner />;
    } else {
      recipeContent = (
        <div>
          <RecipeItem recipe={recipe} showActions={false} />
          <CommentForm recipeId={recipe._id} />
          <CommentFeed recipeId={recipe._id} comments={recipe.comments} />
        </div>
      );
    }

    return (
      <div className="recipe">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Link to="/feed" className="btn btn-light mb-3">
                Back To Feed
              </Link>
              {recipeContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Recipe.propTypes = {
  getRecipe: PropTypes.func.isRequired,
  recipe: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  recipe: state.recipe
});

export default connect(
  mapStateToProps,
  { getRecipe }
)(Recipe);
