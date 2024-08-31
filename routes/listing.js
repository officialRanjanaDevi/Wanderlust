const express =require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");

const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middlewares.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require('../cloudConfig.js');
const upload = multer({storage});


router.route("/")
      .get(wrapAsync(listingController.index))  // index route
      .post(isLoggedIn,upload.single('listing[image]') ,wrapAsync(listingController.createListing));  // create listing route
      

// new route to create new listing
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/category/:category")
       .get(listingController.showCategory)
       .post(listingController.showSearchResult);

router.route("/:id")
      .get(wrapAsync(listingController.showListing))   // show route for individual view
      .put(isLoggedIn,isOwner,upload.single('listing[image]'), wrapAsync(listingController.updateListing))  //update route
      .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));    //delete route



// edit route
router.get("/:id/edit",isLoggedIn,isOwner ,wrapAsync(listingController.renderEditForm));

module.exports=router;