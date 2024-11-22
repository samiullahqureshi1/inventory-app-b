import { Product } from "../models/product_model.js";

import fs from "fs";
import path from "path";
import mongoose from "mongoose";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// Create

const new_product = async (req, resp) => {
  try {
    const images =
      Array.isArray(req.files) && req.files.length > 0
        ? req.files.map((file) => `products/${file.originalname}`)
        : [];
    req.body.images = images;
    const data = new Product(req.body);
    const save_data = await data.save();
    resp
      .status(200)
      .send({ message: "Data saved successfully", data: save_data });
  } catch (error) {
    console.log(error.message)
    resp.status(400).send(error.message);
  }
};

// Get

const get_product = async (req, resp) => {
  try {
    const data_get = await Product.find()
    resp
      .status(200)
      .json({ message: `Data Fetched successfully`, data: data_get });
  } catch (error) {
    resp.status(400).json(error.message)
  }
};

// Update

const update_product = async (req, resp) => {
  try {
    const data = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    resp.status(200).send({ message: `Data updated successfully`, data: data });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Image update

const image_update = async (req, resp) => {
  try {
    const product_id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(product_id)) {
      return resp.status(400).send({ message: "Invalid Product ID" });
    }
    const existing_product = await Product.findById(product_id);
    if (!existing_product) {
      return resp.status(404).send({ message: "Product not found" });
    }
    if (existing_product.images && existing_product.images.length > 0) {
      for (const imagePath of existing_product.images) {
        const fullPath = path.join(__dirname, "..", "public/products", imagePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    }
    const new_images =
      Array.isArray(req.files) && req.files.length > 0
        ? req.files.map((file) => `products/${file.originalname}`)
        : [];
        console.log(req.files);
        
    if (new_images.length === 0) {
      return resp.status(400).send({ message: "No new images uploaded" });
    }
    const updated_product = await Product.findByIdAndUpdate(
      product_id,
      { images: new_images },
      { new: true }
    );
    resp.status(200).send({
      message: `Images updated successfully`,
      data: updated_product,
    });
  } catch (error) {
    console.error("Error updating images:", error);
    resp.status(500).send({ error: error.message });
  }
};


// Delete

const delete_product = async (req, resp) => {
  try {
    const data = await Product.findByIdAndDelete({ _id: req.params.id });
    resp.status(200).send({ message: `Data deleted successfully`, data: data });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

const getOutProduct = async (req, res) => {
  try {
    const data = await Product.aggregate([
      {
        $match: {
          in_stock: false, // Filter for products where in_stock is false
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Out-of-stock products fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching out-of-stock products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch out-of-stock products",
      error: error.message,
    });
  }
};


export { new_product, get_product, update_product, delete_product, image_update ,getOutProduct};
