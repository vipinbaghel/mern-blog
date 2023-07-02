const fs = require('fs');
const path = require('path');
const Post = require('../models/Post.js');
const jwt = require('jsonwebtoken');
const { post } = require('../routers/post.js');

const createPost = async(req, res) => {
   console.log('inside route create/new');
  
   const {originalname, path} = req.file;
   const parts = originalname.split('.'); //create array by splitting on .
   const ext = parts[parts.length-1];   //accessing the file extention
   const newPath = path+'.'+ext;
   fs.renameSync(path, newPath);

   const {token} = req.cookies;
   jwt.verify(token, 'vipin', {}, async(err, info)=>{
      if(err) throw err;

   
      const {title, summary, content} = req.body;
   
      const postDoc = await Post.create({
       title,
       summary,
       content,
       cover: newPath,
       author: info.userId,
      });
   
      res.json(postDoc);
   })
}

const editPost = async(req, res) => {

    let newPath = null;
    if(req.file) {

      const {originalname, path} = req.file;
      const parts = originalname.split('.');
      const ext = parts[parts.length-1];   
      newPath = path+'.'+ext;
      fs.renameSync(path, newPath);
    }

    const {token}  = req.cookies;
     jwt.verify(token, 'vipin', {}, async(err, info) => {
      if(err) throw err;
      const {id, title, summary, content} = req.body;
      const postDoc = await Post.findById(id);
      const isAuthor = JSON.stringify(postDoc.author)  === JSON.stringify(info.id);
      res.json({isAuthor});
      console.log(isAuthor);
      if(!isAuthor) {
         return res.status(400).json('you are not the author');
      }

      console.log('before updating the post');
      await postDoc.update({
         title,
         summary,
         content,
         cover: newPath ? newPath : postDoc.cover,
      });

      console.log('updated post');
      //res.json(postDoc);
    })
}

const viewPosts = async(req, res) => {
   //populate function is used to find the document in relation table takes id and column value to find
   //limit function gives the limited posts from the collection
   const posts = await Post.find().populate('author', ['username']).sort({createdAt: -1}).limit(20);
   res.json(posts);
}

const getSinglePost = async(req, res) => {
   // console.log(req.params);  it will log the id

   const {id} = req.params;
   const postDoc = await Post.findById(id).populate('author', ['username']);
   res.json(postDoc);
}


module.exports ={
   createPost,
   editPost,
   viewPosts,
   getSinglePost,
};