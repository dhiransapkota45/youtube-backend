const commentmodel = require("../models/commentmodel");
const videomodel = require("../models/videomodel");

const createcomment = async (req, res) => {
  try {
    const { comment, videoid, parentComment = null } = req.body;
    if (!comment || !videoid)
      return res.status(400).json({ msg: "please enter all fields" });

    const newcomment = await commentmodel.create({
      comment,
      video: videoid,
      commenter: req.user._id,
      parentComment,
    });

    const newcommentwithpopulation = await commentmodel
      .findById(newcomment._id)
      .populate({ path: "commenter", select: "username profile_pic" });

    if (parentComment) {
      const addtoreply = await commentmodel.findByIdAndUpdate(
        parentComment,
        {
          $push: { replies: newcomment._id },
        },
        { new: true }
      );
    }

    await videomodel.findByIdAndUpdate(videoid, {
      $push: { comments: newcomment._id },
    });

    return res
      .status(200)
      .json({ msg: "comment created", newcomment: newcommentwithpopulation });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const likecomment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "comment id is required" });

    const checkalreadyliked = await commentmodel.findOne({
      likes: req.user._id,
    });

    if (checkalreadyliked) {
      const unlike = await commentmodel.findByIdAndUpdate(id, {
        $pull: { likes: req.user._id },
      });
      return res.status(200).json({ msg: "unliked" });
    } else {
      const undislike = await commentmodel.findByIdAndUpdate(id, {
        $pull: { dislikes: req.user._id },
      });
      const like = await commentmodel.findByIdAndUpdate(id, {
        $push: { likes: req.user._id },
      });
      return res.status(200).json({ msg: "liked" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const dislikecomment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "comment id is required" });

    const checkalreadydisliked = await commentmodel.findOne({
      dislikes: req.user._id,
    });

    if (checkalreadydisliked) {
      const undislike = await commentmodel.findByIdAndUpdate(id, {
        $pull: { dislikes: req.user._id },
      });
      return res.status(200).json({ msg: "undisliked" });
    } else {
      const unlike = await commentmodel.findByIdAndUpdate(id, {
        $pull: { likes: req.user._id },
      });

      const dislike = await commentmodel.findByIdAndUpdate(id, {
        $push: { dislikes: req.user._id },
      });
      return res.status(200).json({ msg: "disliked" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};

const getReplies = async (req, res) => {
  try {
    const { videoid, commentid } = req.body;
    if (!videoid || !commentid)
      return res.status(400).json({ msg: "videoid and commentid is required" });

    const findvideo = await videomodel.findById(videoid);
    if (!findvideo) return res.status(400).json({ msg: "video not found" });

    if (findvideo.comments.length === 0)
      return res.status(200).json({ msg: "no comments" });

    if (findvideo.comments.includes(commentid) === false)
      return res.status(400).json({ msg: "comment not found" });

    const replies = await commentmodel.findById(commentid).populate({
      path: "replies",
      select: " -parentComment -__v ",
      populate: { path: "commenter", select: "username profile_pic" },
    });

    return res.status(200).json({ replies });
  } catch (error) {
    return res.status(500).send({ error });
  }
};

module.exports = { createcomment, likecomment, dislikecomment, getReplies };
