const mongoose = require("mongoose");
const User = require("./userModel");

const CanvasSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    elements: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    shared_with: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    is_public: {
      type: Boolean,
      default: false,
    },

    last_modified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Get all canvases for a user
CanvasSchema.statics.getAllCanvases = async function (email) {
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

CanvasSchema.statics.createCanvas = async function (email, name) {
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

CanvasSchema.statics.updateCanvas = async function (email, id, elements) {
  try {


    const user = await mongoose.model("Users").findOne({ email });

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

CanvasSchema.statics.loadCanvas = async function (email, canvasId) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }
    const canvas = await this.findOne({
      _id: canvasId,

      $or: [{ owner: user._id }, { shared_with: user._id }],
    });

    if (!canvas) {
      throw new Error("Canvas not found or access denied");
    }

    return canvas;
  } catch (error) {
    throw new Error(error.message);
  }
};

const Canvas = mongoose.model("Canvas", CanvasSchema, "Canvases");

module.exports = Canvas;
