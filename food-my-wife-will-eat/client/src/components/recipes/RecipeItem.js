import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { deleteRecipe, addLike, removeLike } from "../../actions/recipeActions";
import $ from "jquery";

class RecipeItem extends Component {
  componentDidMount() {
    let starClicked = false;

    $(function() {
      $(".star").click(function() {
        $(this)
          .children(".selected")
          .addClass("is-animated");
        $(this)
          .children(".selected")
          .addClass("pulse");

        let target = this;

        setTimeout(function() {
          $(target)
            .children(".selected")
            .removeClass("is-animated");
          $(target)
            .children(".selected")
            .removeClass("pulse");
        }, 1000);

        starClicked = true;
      });

      $(".half").click(function() {
        if (starClicked == true) {
          setHalfStarState(this);
        }
        $(this)
          .closest(".rating")
          .find(".js-score")
          .text($(this).data("value"));

        $(this)
          .closest(".rating")
          .data("vote", $(this).data("value"));
        calculateAverage();
        console.log(parseInt($(this).data("value")));
      });

      $(".full").click(function() {
        if (starClicked == true) {
          setFullStarState(this);
        }
        $(this)
          .closest(".rating")
          .find(".js-score")
          .text($(this).data("value"));

        $(this)
          .find("js-average")
          .text(parseInt($(this).data("value")));

        $(this)
          .closest(".rating")
          .data("vote", $(this).data("value"));
        calculateAverage();

        console.log(parseInt($(this).data("value")));
      });

      $(".half").hover(function() {
        if (starClicked == false) {
          setHalfStarState(this);
        }
      });

      $(".full").hover(function() {
        if (starClicked == false) {
          setFullStarState(this);
        }
      });
    });

    function updateStarState(target) {
      $(target)
        .parent()
        .prevAll()
        .addClass("animate");
      $(target)
        .parent()
        .prevAll()
        .children()
        .addClass("star-colour");

      $(target)
        .parent()
        .nextAll()
        .removeClass("animate");
      $(target)
        .parent()
        .nextAll()
        .children()
        .removeClass("star-colour");
    }

    function setHalfStarState(target) {
      $(target).addClass("star-colour");
      $(target)
        .siblings(".full")
        .removeClass("star-colour");
      updateStarState(target);
    }

    function setFullStarState(target) {
      $(target).addClass("star-colour");
      $(target)
        .parent()
        .addClass("animate");
      $(target)
        .siblings(".half")
        .addClass("star-colour");

      updateStarState(target);
    }

    function calculateAverage() {
      var average = 0;

      $(".rating").each(function() {
        average += $(this).data("vote");
      });

      $(".js-average").text((average / $(".rating").length).toFixed(1));
    }
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

  render() {
    const { recipe, auth, showActions } = this.props;

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
              <div class="rating" data-vote="0">
                <div class="star hidden">
                  <span class="full" data-value="0" />
                  <span class="half" data-value="0" />
                </div>

                <div class="star">
                  <span class="full" data-value="1" />
                  <span class="half" data-value="0.5" />
                  <span class="selected" />
                </div>

                <div class="star">
                  <span class="full" data-value="2" />
                  <span class="half" data-value="1.5" />
                  <span class="selected" />
                </div>

                <div class="star">
                  <span class="full" data-value="3" />
                  <span class="half" data-value="2.5" />
                  <span class="selected" />
                </div>

                <div class="star">
                  <span class="full" data-value="4" />
                  <span class="half" data-value="3.5" />
                  <span class="selected" />
                </div>

                <div class="star">
                  <span class="full" data-value="5" />
                  <span class="half" data-value="4.5" />
                  <span class="selected" />
                </div>

                <div class="score">
                  <span>Your rating: </span>
                  <span class="score-rating js-score">0</span>
                  <span>/</span>
                  <span class="total">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
              <span className="likesAndComments">
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
              </span>
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
  recipe: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { deleteRecipe, addLike, removeLike }
)(RecipeItem);
