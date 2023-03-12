const videomodel = require("../models/videomodel");

const uploadVideo = async (req, res) => {
  try {
    // const newvideo = await videomodel.create({
    //   ...req.body,
    //   video: req.file.filename,
    // });
    // return res.status(201).json(newvideo);
    console.log("i was here");
    console.log(req.body);
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { uploadVideo };
