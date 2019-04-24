import React, { Component } from "react";
import PropTypes from "prop-types";
import CommentItem from "./CommentItem";

class CommentFeed extends Component {
  render() {
    const { comments, recipeId } = this.props;

    return comments.map(comment => (
      <CommentItem key={comment._id} comment={comment} recipeId={recipeId} />
    ));
  }
}

CommentFeed.propTypes = {
  comments: PropTypes.array.isRequired,
  recipeId: PropTypes.string.isRequired
};

export default CommentFeed;
