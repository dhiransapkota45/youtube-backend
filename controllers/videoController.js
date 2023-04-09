const videomodel = require("../models/videomodel");
const fs = require("fs");
const uploadThumbnail = require("../utils/multer-thumbnail");
const mongoose = require("mongoose");
const { log } = require("console");
const commentmodel = require("../models/commentmodel");
const usermodel = require("../models/usermodel");

const uploadVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const url = req.file.filename;
    const uploader = req.user._id;

    const createvideo = await videomodel.create({
      url,
      title,
      description,
      uploader,
      thumbnail: "https://getuikit.com/v2/docs/images/placeholder_600x400.svg",
    });

    return res
      .status(201)
      .json({ msg: "video uploaded successfully", createvideo });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const streamvideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "id is required" });

    const findvideo = await videomodel.findById(id);
    if (!findvideo) return res.status(404).json({ msg: "video not found" });

    //increment views of video
    const incrementviews = await videomodel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    const { url } = findvideo;
    const videoPath = `public/videos/${url}`;

    const videoSize = fs.statSync(videoPath).size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);

      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

      const chunksize = end - start + 1;

      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      // res.write(JSON.stringify({ title: "this is title" }));
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": videoSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//here i need to populate likes and comments
//i should use aggregations heere
const getvideodetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "id is required" });

    const findvideo = await videomodel
      .findById(id)

      .populate({
        path: "comments",
        select: "-video -__v -replies",
        match: { parentComment: null },
        populate: { path: "commenter", select: "username profile_pic" },
      })
      .populate({
        path: "uploader",
        select: " fullname username profile_pic subscribers",
      })
      .select("-url -thumbnail -__v");

    if (!findvideo) return res.status(404).json({ msg: "video not found" });

    const obj = findvideo.toObject();
    obj.likes = obj.likes.length;
    obj.dislikes = obj.dislikes.length;

    //it is really time wasting to map if there is thousands of comments
    //instead i should store the number of comments in the video model

    //or i could add another field reply count in the comment model
    //and update it when a reply is added
    // const newdata = obj.comments.map((comment) => {
    //   const { replies, likes, dislikes } = comment;
    //   return {
    //     ...comment,
    //     likes: likes.length,
    //     dislikes: dislikes.length,
    //     replies: replies.length,
    //   };
    // });
    if (req.unverifiedUser) {
      obj.isliked = false;
    } else {
      const checkliked = await videomodel.findOne({
        _id: id,
        likes: req.user._id,
      });
      if (checkliked) {
        obj.isliked = true;
      } else {
        obj.isliked = false;
      }

      const disliked = await videomodel.findOne({
        _id: id,
        dislikes: req.user._id,
      });
      if (disliked) {
        obj.isdisliked = true;
      } else {
        obj.isdisliked = false;
      }

      const checksuscribed = await usermodel.findOne({
        _id: obj.uploader._id,
        subscribers: req.user._id,
      });
      if (checksuscribed) {
        obj.isSubscribed = true;
      } else {
        obj.isSubscribed = false;
      }
    }
    return res.status(200).json({ findvideo: obj });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const likevideo = async (req, res) => {
  try {
    console.log("hello1");
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "video id is required" });
    console.log("hello2");

    const findvideo = await videomodel.findById(id);
    if (!findvideo) return res.status(404).json({ msg: "video not found" });
    console.log("hello3");

    const checkalreadyliked = await videomodel.findOne({
      _id: id,
      likes: req.user._id,
    });
    console.log("hell4", checkalreadyliked);

    if (checkalreadyliked) {
      const unlike = await videomodel.findByIdAndUpdate(
        id,
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
      console.log("hello5");

      return res.status(200).json({ msg: "unliked", like: unlike });
    } else {
      const like = await videomodel.findByIdAndUpdate(
        id,
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );

      //not sure it works or not, if error comes then try to fix it
      const removedislike = await videomodel.findByIdAndUpdate(id, {
        $pull: { dislikes: req.user._id },
      });

      console.log("hello6");
      return res.status(200).json({ msg: "liked", like });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const dislikevideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "video id is required" });

    const findvideo = await videomodel.findById(id);
    if (!findvideo) return res.status(404).json({ msg: "video not found" });

    const checkalreadydisliked = await videomodel.findOne({
      dislikes: req.user._id,
    });

    if (checkalreadydisliked) {
      const undislike = await videomodel.findByIdAndUpdate(id, {
        $pull: { dislikes: req.user._id },
      });
      return res.status(200).json({ msg: "undisliked" });
    } else {
      const dislike = await videomodel.findByIdAndUpdate(id, {
        $push: { dislikes: req.user._id },
      });

      //not sure it works or not, if error comes then try to fix it
      const removelike = await videomodel.findByIdAndUpdate(id, {
        $pull: { likes: req.user._id },
      });
      return res.status(200).json({ msg: "disliked" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getlikedvideos = async (req, res) => {
  try {
    const findlikedvideos = await videomodel.find({
      likes: req.user._id,
    });
    if (!findlikedvideos)
      return res.status(404).json({ msg: "no videos found" });

    return res.status(200).json({ findlikedvideos });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getdislikedvideos = async (req, res) => {
  try {
    const finddislikedvideos = await videomodel.find({
      dislikes: req.user._id,
    });
    if (!finddislikedvideos)
      return res.status(404).json({ msg: "no videos found" });

    return res.status(200).json({ finddislikedvideos });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getallvideos = async (req, res) => {
  try {
    const findallvideos = await videomodel
      .find({
        uploader: { $ne: req.user._id },
      })
      .sort({ createdAt: -1 });
    if (!findallvideos) return res.status(404).json({ msg: "no videos found" });

    return res.status(200).json({ findallvideos });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getallvideosRandom = async (req, res) => {
  try {
    const findallvideos = await videomodel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: "uploader",
        select: "fullname profile_pic username",
      })
      .select("thumbnail title uploader _id views createdAt");
    if (!findallvideos) return res.status(404).json({ msg: "no videos found" });

    return res.status(200).json({ findallvideos });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

//here need to check if user is the owner of video or not
const thumbnailupload = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "video id is required" });

    const thumbnail = req.file.filename;
    if (!thumbnail)
      return res.status(400).json({ msg: "thumbnail is required" });

    const updatevideo = await videomodel.findByIdAndUpdate(id, {
      thumbnail,
    });
    if (!updatevideo) return res.status(404).json({ msg: "video not found" });

    return res.status(200).json({ msg: "thumbnail uploaded" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "video id is required" });

    const finduser = await usermodel.findById(req.user._id);
    if (!finduser) return res.status(404).json({ msg: "user not found" });

    const findvideo = await videomodel.findById(id);
    if (!findvideo) return res.status(404).json({ msg: "video not found" });

    if (findvideo.uploader._id.toString() !== req.user._id.toString())
      return res.status(401).json({ msg: "unauthorized" });

    const deletevideo = await videomodel.findByIdAndDelete(id);
    if (!deletevideo) return res.status(404).json({ msg: "video not found" });

    return res.status(200).json({ msg: "video deleted" });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = {
  uploadVideo,
  streamvideo,
  getvideodetails,
  likevideo,
  dislikevideo,
  getlikedvideos,
  getdislikedvideos,
  getallvideos,
  thumbnailupload,
  getallvideosRandom,
  deleteVideo,
};
