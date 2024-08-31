const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middlewares.js");
const reviewController=require("../controllers/reviews.js");

// Add reviews route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
