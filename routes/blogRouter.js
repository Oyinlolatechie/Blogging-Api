const express = require('express')
const passport = require('passport')
const { createBlog, updateBlog, getAllBlogs, deleteBlog, getBlogById, getBlogByOwner } = require('../controller/blogController')

const blogRouter = express.Router()

//create new blog route  
blogRouter.post('/', 
passport.authenticate("jwt", {session: false}),
createBlog)  

blogRouter.get('/', getAllBlogs)  

blogRouter.get('/owner', passport.authenticate("jwt", {session: false}), getBlogByOwner)

blogRouter.get('/:id', getBlogById)  

blogRouter.patch('/:id', passport.authenticate("jwt", {session: false}), updateBlog)  

blogRouter.delete('/:id', passport.authenticate("jwt", {session: false}), deleteBlog)  

module.exports = blogRouter