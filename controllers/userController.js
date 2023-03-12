// subscribers, subscriptions, password, profile_pic, description, total_views, liked_videos, disliked_videos, videos, fullname, username

const signup = async (req, res) => {
  console.log(req.file.filename);
  return res.json(req.body)
};

const signin = async (req, res) => {
  console.log("inside signin");
};

module.exports = { signin, signup };
