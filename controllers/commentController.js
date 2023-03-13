const commentmodel = require("../models/commentmodel");

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

    if (parentComment) {
      const addtoreply = await commentmodel.findByIdAndUpdate(
        parentComment,
        {
          $push: { replies: newcomment._id },
        },
        { new: true }
      );
    }

    return res.status(200).json({ msg: "comment created", newcomment });
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

module.exports = { createcomment, likecomment, dislikecomment };
