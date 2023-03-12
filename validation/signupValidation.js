const yup = require("yup");

//fullname, username, password, profile_pic, subscribers, subscriptions,  description, total_views, liked_videos, disliked_videos, videos,

const schema = yup.object().shape({
  fullname: yup.string().required(),
  username: yup
    .string()
    .required()
    .transform((value) => value.replace(/\s/g, "")),
  password: yup.string().required().min(8),
  profile_pic: yup.string(),
});

const signupValidation = async (req, res, next) => {
  try {
    const data = await schema.validate(req.body);
    req.body = data;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = signupValidation;
