import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import { addRecipe } from "../../actions/recipeActions";
import { getCurrentProfile } from "../../actions/profileActions";

class RecipeForm extends Component {
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
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const { user } = this.props.auth;
    const { profile } = this.props.profile;
    const newRecipe = {
      title: this.state.title,
      ingredients: this.state.ingredients,
      directions: this.state.directions,
      name: user.name,
      avatar: user.avatar,
      handle: profile.handle
    };
    this.props.addRecipe(newRecipe);
    this.setState({ title: "", ingredients: "", directions: "" });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <div className="post-form mb-3">
          <div className="card card-info">
            <div className="card-header bg-info text-white">
              Create a New Recipe
            </div>
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
                    placeholder="Ingredients - separate ingredients with a semicolon - ex. 2
                  Tbsp white sugar; 2 1/2 cups flour; 1/2 tsp salt"
                    name="ingredients"
                    label="Ingredients"
                    value={this.state.ingredients}
                    onChange={this.onChange}
                    error={errors.ingredients}
                  />
                  <TextAreaFieldGroup
                    placeholder="Directions - separate directions with a semicolon - ex.
                  Preheat oven to 450F; Combine dry ingredients in a large bowl;
                  Add wet ingredients and stir until smooth"
                    name="directions"
                    label="Directions"
                    value={this.state.directions}
                    onChange={this.onChange}
                    error={errors.directions}
                  />
                </div>
                <button type="submit" className="btn btn-dark">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

RecipeForm.propTypes = {
  addRecipe: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addRecipe, getCurrentProfile }
)(RecipeForm);
