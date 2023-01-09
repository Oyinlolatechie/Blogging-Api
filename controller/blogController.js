//require Blogmodel
const { model } = require('mongoose');
const blog = require('../models/blogModel');
const BlogModel = require('../models/blogModel')


// Create Blog Controller 
exports.createBlog = async (req, res, next) => {
  const blogInfo = req.body; 

  //implementing reading_time
  const reading_time = () => {
     // Calculate the number of words in the post
    const blogLength =
      blogInfo.body.split(" ").length +
      blogInfo.title.split(" ").length +
      blogInfo.description.split(" ").length;

      // Set the average reading speed (in wpm)
    const readingSpeed = 200;

    const blogReadingTime = Math.ceil(blogLength / readingSpeed);
    return `${blogReadingTime} minute${blogReadingTime === 1 ? '' : 's'}`; //if blogReadingTime = 1, returns "minute" else returns "minutes"

  }

  //adding to the blogInfo inputted byt user
  blogInfo.reading_time = reading_time();
  blogInfo.author_id = req.user._id;
  blogInfo.author = `${req.user.firstName} ${req.user.lastName}`;

  //creating Blog 
  try {
    const blog = await BlogModel.create(blogInfo);

    return res.status(201).json({
      status: "success",
      data: blog
    })
  } catch (err) {
    return next(err)
  }
}


//Get all blogs controller
  exports.getAllBlogs = async (req, res, next) => {

  //paginating Blogs per page
  const page = req.query.p || 1
  const blogPerPage = 20
  const skip = (page - 1) * blogPerPage

  //filtering by title and tags
  const {
    title,
    tags,
    order,
    order_by = "timestamp"
  } = req.query


const sort= {}

sort[order_by] = order || 'asc'


  try {
    // fecthes paginated blogs based on queries 
    const blogs = await BlogModel.find({state : 'Published', ...(title && {title}), ...(tags && {tags})})
      .sort(sort)
      .skip(skip)
      .limit(blogPerPage)

    if (!blogs) return next(new Error("Blog requested not found!"));
    
    // if (blogs.state == "Published")
    return res.status(200).json({
      status: "success",
      data: blogs
    });
  } catch (err) {
    return next(err)
  }
};


//Get Blog By Id controller
exports.getBlogById = async (req, res, next) => {
  const { id } = req.params
  console.log(id)

  try {
    const requestedBlog = await BlogModel.findOne({ "_id": id, state: "Published" }).populate("author_id", "-password")

    if (!requestedBlog) return next(new Error("Blog requested not found!"));

    //inreament readcount
    requestedBlog.read_count += 1

    await requestedBlog.save()

    res.status(200).json({
      status: "success",
      data: {
        requestedBlog
      }
    })
  } catch (err) {
    next(err)
  }
}


//Get Blogs Created By author(owner)
exports.getBlogByOwner = async (req, res, next) => {
  const ownerId = req.user._id //owner's user_id

  //paginating Blogs per page
  const page = req.query.p || 1
  const blogPerPage = 3
  const skip = (page - 1) * blogPerPage

  //Filtering by state
  const { state } = req.query


  try {
    const ownerBlogs = await BlogModel.find({ author_id: ownerId,  ...(state && {state})})
      .skip(skip)
      .limit(blogPerPage)

    if (!ownerBlogs) return next(new Error("No blog by this author")) //check if all queries pass

    res.status(200).json({
      status: "success",
      data: {
        ownerBlogs
      }
    })
  } catch (err) {
    next(err)
  }
}

// Update Blog Controller
exports.updateBlog = async (req, res, next) => {
  const id = req.params.id
  const infoToUpdate = req.body

  try {
    const blogToUpdate = await BlogModel.findById(id)
    if (!blogToUpdate) 
    return next(new Error("Blog doest not exist!"))

    if (blogToUpdate.author_id.toString() !== req.user._id) 
    return next(new Error("This blog can only be edited by it's author"))

    const updatedBlog = await BlogModel.findByIdAndUpdate(id, infoToUpdate, {
      new: true,
      runValidators: true
    })

    res.status(201).json({
      status: "success",
      data: {
        updatedBlog
      }
    })
  } catch (err) {
    return next(err)
  }
}

// Delete Blog Controller
exports.deleteBlog = async (req, res, next) => {
  const { id } = req.params
  try {
    const blogToDelete = await BlogModel.findById(id)

    if (!blogToDelete) return next(new Error("Blog to delete not found!"));

    if (blogToDelete.author_id.toString() !== req.user._id) return next(new Error("This blog can only be deleted by it's author"));

    await BlogModel.deleteOne(blogToDelete)
    return res.status(204).json({
      status: "success",
      data: null
    })
  } catch (err) {
    return next(err)
  }
}