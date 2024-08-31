const Listing=require("../models/listing.js");

module.exports.index=async (req,res)=>{
    const allListings = await Listing.find({}).populate("owner");

    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!list){
        req.flash("error","Listing you requested for doesnot exist !");
         res.redirect("/listings");
    }else{
        res.render("listings/show.ejs",{list});
    }  
}

module.exports.showCategory=async(req,res)=>{
    let {category}=req.params;
    const allListings=await Listing.find({ categories: { $in: [category] } }).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(allListings.length==0){
        req.flash("error","No matching results found !");
         res.redirect("/listings");
    }else{
        res.render("listings/index.ejs",{allListings});
    }  
}

module.exports.showSearchResult=async(req,res)=>{
    let {category}=req.body;
   
    const allListings=await Listing.find({ categories: { $in: [category] } }).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(allListings.length==0){
        req.flash("error","No matching results found!");
        res.redirect("/listings");
    }else{
        res.render("listings/index.ejs",{allListings});
    }  
}


module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);
   
    newListing.owner=req.user._id;
    newListing.image={url,filename};  
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id); 
    if(!list){
        req.flash("error","Listing you requested for doesnot exist !");
         res.redirect("/listings");
    }

    let original_image_url=list.image.url;
    original_image_url=original_image_url.replace("/upload","/upload/h_300,w_450");
    console.log( original_image_url);
   res.render("listings/edit.ejs",{list,original_image_url});
}

module.exports.updateListing=async(req,res)=>{
  
    let {id}=req.params;
    let list= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        list.image={url,filename};
        await list.save();
    }
   
   req.flash("success","Listing Updated!");
   res.redirect(`/listings/${id}`);
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success"," Listing Deleted!");
    res.redirect("/listings");
 }