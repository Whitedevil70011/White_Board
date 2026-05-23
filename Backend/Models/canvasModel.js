const mongoose = require("mongoose");
const User = require("./userModel");

const canvasSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shared: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    elements: [{ type: mongoose.Schema.Types.Mixed }],
    createdAt: { type: Date, default: Date.now }
});

// Get all canvases for a user
canvasSchema.statics.getAllCanvases = async function (email) {
  const user = await User.findOne({ email });

  if (!user) {
    throw Error("User not found");
  }

  const canvases = await this.find({
    $or: [{ owner: user._id }, { shared_with: user._id }],
  });

  return canvases;
};

/// create a canvas for a user with given email and canvas name

canvasSchema.statics.createCanvas = async function (email, name) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const canvas = await this.create({
      owner: user._id,
      name,

      elements: [],

      shared_with: [],
    });

    const newCanvas = await canvas.save();

    return newCanvas;
  } catch (error) {
    throw new Error(error.message);
  }
};

//// update a canvas

canvasSchema.statics.updateCanvas = async function (email, id, elements) {
  try {


    const user = await User.findOne({ email });

    if (!user) {
      return Error("User not found");
    }

    // =========================
    // FIND CANVAS
    // =========================

    const canvas = await this.findOne({
      _id: id,
      $or: [
        {
          owner: user._id,
        },
        {
          shared_with: user._id,
        },
      ],
    });

    if (!canvas) {
      return Error("Canvas not found");
    }



    canvas.elements = elements;


    const updatedCanvas = await canvas.save();

    return updatedCanvas;
  } catch (error) {
    console.log(error);

    return Error("Error updating canvas");
  }
};

// Load a canvas by ID for a user

canvasSchema.statics.loadCanvas = async function (email, canvasId) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }
    
    const canvas = await this.findOne({
      $and: [
        { _id: canvasId },
        { $or: [{ owner: user._id }, { shared_with: user._id }] }
      ],
    });

    if (!canvas) {
      throw new Error("Canvas not found or access denied");
    }

    console.log("Loaded canvas:", canvas);
    return canvas;
  } catch (error) {
    throw new Error(error.message);
  }
};



// Add email to shared_with array of canvas
canvasSchema.statics.shareCanvas = async function (email, canvasId, sharedWithEmail) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw Error("User not found");
    }

    const canvas = await this.findOne({ _id: canvasId, owner: user._id });

    if (!canvas) {
      throw Error("Canvas not found");
    }

    const sharedWithUser = await User.findOne({ email: sharedWithEmail });

    if (!sharedWithUser) {
      throw Error("User to share with not found");
    }

    canvas.shared_with.push(sharedWithUser._id);
    const updatedCanvas = await canvas.save();

    return updatedCanvas;
  } catch (error) {
    throw Error(error.message || "Error sharing canvas");
  }
};
















const Canvas = mongoose.model("Canvas", canvasSchema, "Canvases");

module.exports = Canvas;
