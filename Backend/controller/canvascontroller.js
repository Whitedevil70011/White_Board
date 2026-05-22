const Canvas = require("../Models/canvasModel");

// get all canvas for a user (by email)
const getAllCanvases = async (req, res) => {
  try {
    const email = req.email;
    const canvases = await Canvas.getAllCanvases(email);
    res.status(200).json(canvases);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Create a canvas for a user with given email and canvas name
const createCanvas = async (req, res) => {
  try {
    const email = req.email;
    const { name } = req.body;
    const newCanvas = await Canvas.createCanvas(email, name);
    res.status(201).json(newCanvas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loadCanvas = async (req, res) => {
  try {
    const email = req.email;
    const { canvasId } = req.params;
    const canvas = await Canvas.loadCanvas(email, canvasId);
    res.status(200).json(canvas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateCanvas = async (req, res) => {
  try {

    const email = req.email;
    const { canvasId } = req.params.id;
    const { elements } = req.body;

    const updatedCanvas = await Canvas.updateCanvas(
      email,
      canvasId,
      elements
    );
    res.status(200).json(updatedCanvas);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

};
  


module.exports = { getAllCanvases, createCanvas, loadCanvas,updateCanvas };
