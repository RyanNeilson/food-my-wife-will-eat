import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import RecipeFeed from "./RecipeFeed";
import Spinner from "../common/Spinner";
import { getRecipes } from "../../actions/recipeActions";

class Recipes extends Component {
  componentDidMount() {
    this.props.getRecipes();
  }

  render() {
    const { recipes, loading } = this.props.recipe;
    let recipeContent;

    if (recipes === null || loading) {
      recipeContent = <Spinner />;
    } else {
      recipeContent = <RecipeFeed recipes={recipes} />;
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h3>Latest Recipes</h3>
              {recipeContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Recipes.propTypes = {
  getRecipes: PropTypes.func.isRequired,
  recipe: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  recipe: state.recipe
});

export default connect(
  mapStateToProps,
  { getRecipes }
)(Recipes);
