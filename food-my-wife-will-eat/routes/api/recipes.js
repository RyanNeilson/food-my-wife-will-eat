const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Recipe model
const Recipe = require("../../models/Recipe");
// Profile model
const Profile = require("../../models/Profile");

// Validation
const validateRecipeInput = require("../../validation/recipe");
const validateCommentInput = require("../../validation/comment");

// @route   GET api/recipes
// @desc    Get recipes
// @access  Public
router.get("/", (req, res) => {
  Recipe.find()
    .sort({ date: -1 })
    .then(recipes => res.json(recipes))
    .catch(err => res.status(404).json({ norecipesfound: "No recipes found" }));
});

// @route   GET api/recipe/:id
// @desc    Get recipe by id
// @access  Public
router.get("/:id", (req, res) => {
  Recipe.findById(req.params.id)
    .then(recipe => res.json(recipe))
    .catch(err =>
      res.status(404).json({ norecipefound: "No recipe found with that ID" })
    );
});

// @route   PUT api/recipes/:id
// @desc    Edit recipe
// @access  Private

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Recipe.findById(req.params.id).then(recipe => {
        // Check for post owner
        if (recipe.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }
        const { errors, isValid } = validateRecipeInput(req.body);

        // Check Validation
        if (!isValid) {
          // If any errors, send 400 with errors object
          return res.status(400).json(errors);
        }

        recipe.title = req.body.title;
        recipe.ingredients = req.body.ingredients;
        recipe.directions = req.body.directions;

        recipe.save().then(recipe => res.json(recipe));
      });
    });
  }
);

// @route   POST api/recipes/
// @desc    Create recipe
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateRecipeInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newRecipe = new Recipe({
      title: req.body.title,
      ingredients: req.body.ingredients,
      directions: req.body.directions,
      name: req.body.name,
      avatar: req.body.avatar,
      handle: req.body.handle,
      user: req.user.id
    });

    newRecipe.save().then(() => res.json({ success: true }));
  }
);

// @route   DELETE api/recipes/:id
// @desc    Delete recipe
// @access  Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Recipe.findById(req.params.id)
        .then(recipe => {
          // Check for post owner
          if (recipe.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }

          // Delete
          recipe.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ recipenotfound: "No recipe found" })
        );
    });
  }
);

// @route   POST api/recipe/like/:id
// @desc    Like recipe
// @access  Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Recipe.findById(req.params.id)
        .then(recipe => {
          if (
            recipe.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "You have already liked this recipe!" });
          }

          // Add user id to likes array
          recipe.likes.unshift({ user: req.user.id });

          recipe.save().then(recipe => res.json(recipe));
        })
        .catch(err =>
          res.status(404).json({ recipenotfound: "No recipe found" })
        );
    });
  }
);

// @route   POST api/recipes/unlike/:id
// @desc    Unlike recipe
// @access  Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Recipe.findById(req.params.id)
        .then(recipe => {
          if (
            recipe.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this recipe" });
          }

          // Get remove index
          const removeIndex = recipe.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          recipe.likes.splice(removeIndex, 1);

          // Save
          recipe.save().then(recipe => res.json(recipe));
        })
        .catch(err =>
          res.status(404).json({ recipenotfound: "No recipe found" })
        );
    });
  }
);

// @route   POST api/recipes/comment/:id
// @desc    Add comment to recipe
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Recipe.findById(req.params.id)
      .then(recipe => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        recipe.comments.unshift(newComment);

        // Save
        recipe.save().then(recipe => res.json(recipe));
      })
      .catch(err =>
        res.status(404).json({ recipenotfound: "No recipe found" })
      );
  }
);

// @route   DELETE api/recipes/comment/:id/:comment_id
// @desc    Remove comment from recipe
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Recipe.findById(req.params.id)
      .then(recipe => {
        // Check to see if comment exists
        if (
          recipe.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }

        // Get remove index
        const removeIndex = recipe.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        recipe.comments.splice(removeIndex, 1);

        recipe.save().then(recipe => res.json(recipe));
      })
      .catch(err =>
        res.status(404).json({ recipenotfound: "No recipe found" })
      );
  }
);

module.exports = router;
