import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import { editRecipe, getRecipe } from "../../actions/recipeActions";
import { getCurrentProfile } from "../../actions/profileActions";

class RecipeEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      ingredients: "",
      directions: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile();
    this.props.getRecipe(this.props.match.params.id);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }

    const { recipe, loading } = this.props.recipe;

    if (recipe === null || loading || Object.keys(recipe).length === 0) {
      console.log("Recipe is loading or null");
    } else {
      this.setState({
        title: recipe.title,
        ingredients: recipe.ingredients,
        directions: recipe.directions
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { user } = this.props.auth;
    const { profile } = this.props.profile;
    const saveRecipe = {
      title: this.state.title,
      ingredients: this.state.ingredients,
      directions: this.state.directions,
      name: user.name,
      avatar: user.avatar,
      handle: profile.handle
    };
    this.props.editRecipe(this.props.match.params.id, saveRecipe);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">Recipe Editor</div>
          <div className="card-body">
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <TextFieldGroup
                  placeholder="Recipe Name"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />

                <TextAreaFieldGroup
                  name="ingredients"
                  label="Ingredients"
                  value={this.state.ingredients}
                  onChange={this.onChange}
                  error={errors.ingredients}
                />
                <TextAreaFieldGroup
                  name="directions"
                  label="Directions"
                  value={this.state.directions}
                  onChange={this.onChange}
                  error={errors.directions}
                />
              </div>
              <button type="submit" className="btn btn-dark">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

RecipeEditor.propTypes = {
  getRecipe: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  recipe: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors,
  recipe: state.recipe
});

export default connect(
  mapStateToProps,
  { getRecipe, editRecipe, getCurrentProfile }
)(RecipeEditor);
