import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import RecipeFeed from "./RecipeFeed";
import { getRecipes } from "../../actions/recipeActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Recipes extends Component {
  constructor() {
    super();
    this.state = {
      search: "",
      results: [],
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getRecipes();
  }

  onSubmit(e) {
    e.preventDefault();
    let search = this.state.search;
    let allRecipes = this.props.recipe.recipes;
    let filtered = [];
    for (let item of allRecipes) {
      if (item.title.toLowerCase().includes(search.toLowerCase())) {
        filtered.push(item);
      }
    }
    this.setState({ results: filtered });
    this.setState({ search: "" });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    let recipeContent;
    recipeContent = <RecipeFeed recipes={this.state.results} />;

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <form onSubmit={this.onSubmit} id="search-form">
              <TextFieldGroup
                placeholder="Search"
                name="search"
                type="text"
                value={this.state.search}
                onChange={this.onChange}
                error={errors.search}
              />
              <input
                type="submit"
                className="btn btn-info btn-block mt-4"
                value="Search"
              />
            </form>
          </div>
        </div>

        <div className="feed">
          <div className="container">
            <div className="row">
              <div className="col-md-12">{recipeContent}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Recipes.propTypes = {
  getRecipes: PropTypes.func.isRequired,
  recipe: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  recipe: state.recipe,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { getRecipes }
)(Recipes);
