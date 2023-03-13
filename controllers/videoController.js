const videomodel = require("../models/videomodel");
const fs = require("fs");

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
const getvideodetails = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "id is required" });

    const findvideo = await videomodel.findById(id);
    if (!findvideo) return res.status(404).json({ msg: "video not found" });

    return res.status(200).json({ findvideo });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = { uploadVideo, streamvideo };
