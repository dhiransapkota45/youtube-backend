const yup = require("yup");

//fullname, username, password, profile_pic, subscribers, subscriptions,  description, total_views, liked_videos, disliked_videos, videos,

const schema = yup.object().shape({
  url: yup.string().required(),
  title: yup.string().required().min(8),
  description: yup.string(),
});

const videoValidation = async (req, res, next) => {
  try {
    const data = await schema.validate(req.body);
    req.body = data;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = videoValidation;
