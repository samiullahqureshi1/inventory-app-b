import { Product } from "../models/product_model.js";
import cloudinary from "../utils/validations/cloudinary.js";
import { RawMaterial } from "../models/raw.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

import { fileURLToPath } from "url";
import { RawMaterial } from "../models/raw.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// Create

// const new_product = async (req, resp) => {
//   try {
//     const baseUrl = `${req.protocol}://${req.get("host")}`;

//     const images =
//       Array.isArray(req.files) && req.files.length > 0
//         ? req.files.map((file) => `${baseUrl}/products/${file.originalname}`)
//         : [];
//     req.body.images = images;
//     const data = new Product(req.body);
//     const save_data = await data.save();
//     resp
//       .status(200)
//       .send({ message: "Data saved successfully", data: save_data });
//   } catch (error) {
//     console.log(error.message)
//     resp.status(400).send(error.message);
//   }
// };

const new_product = async (req, res) => {
  try {
    // Multer stores the file locally, now we upload to Cloudinary
    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products', // Optional: Organize images in the 'products' folder
          resource_type: 'auto', // Auto-detect file type (e.g., image, video)
        });

        // Push the Cloudinary image URL to the images array
        images.push(result.secure_url);
      }
    }

    // Save the product to the database with the Cloudinary image URLs
    req.body.images = images; // Set the product's image field to the uploaded URLs
    const product = new Product(req.body);
    const savedProduct = await product.save();

    res.status(200).send({
      message: 'Product saved successfully',
      data: savedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: 'Error uploading images',
      error: error.message,
    });
  }
};

const new_product_raw = async (req, res) => {
  try {
    // Multer stores the file locally, now we upload to Cloudinary
    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products', // Optional: Organize images in the 'products' folder
          resource_type: 'auto', // Auto-detect file type (e.g., image, video)
        });

        // Push the Cloudinary image URL to the images array
        images.push(result.secure_url);
      }
    }

    // Save the product to the database with the Cloudinary image URLs
    req.body.images = images; // Set the product's image field to the uploaded URLs
    const product = new RawMaterial(req.body);
    const savedProduct = await product.save();

    res.status(200).send({
      message: 'Product saved successfully',
      data: savedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: 'Error uploading images',
      error: error.message,
    });
  }
};

// Get

const get_product = async (req, resp) => {
  try {
    const data_get = await Product.aggregate([
      {
        $match: { in_stock: true } // Only fetch products where in_stock is true
      },
      {
        $sort:{createdAt:-1}
      }
    ])
    resp
      .status(200)
      .json({ message: `Data Fetched successfully`, data: data_get });
  } catch (error) {
    resp.status(400).json(error.message)
  }
};

const get_product_raw = async (req, resp) => {
  try {
    const data_get = await RawMaterial.aggregate([
      {
        $match: { in_stock: true } // Only fetch products where in_stock is true
      },
      {
        $sort:{createdAt:-1}
      }
    ])
    resp
      .status(200)
      .json({ message: `Data Fetched successfully`, data: data_get });
  } catch (error) {
    resp.status(400).json(error.message)
  }
};

const get_product_Out = async (req, resp) => {
  try {
    const data_get = await Product.aggregate([
      {
        $match: { in_stock: false } // Only fetch products where in_stock is true
      },
      {
        $sort:{createdAt:-1}
      }
    ])
    resp
      .status(200)
      .json({ message: `Data Fetched successfully`, data: data_get });
  } catch (error) {
    resp.status(400).json(error.message)
  }
};
// Update

// const update_product = async (req, resp) => {
//   try {
//     const data = await Product.findByIdAndUpdate(
//       { _id: req.params.id },
//       req.body,
//       { new: true }
//     );
//     resp.status(200).send({ message: `Data updated successfully`, data: data });
//   } catch (error) {
//     resp.status(400).send(error.message);
//   }
// };

const update_product = async (req, res) => {
  try {
    const { id } = req.params;

    // Handle file uploads and Cloudinary storage
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
          resource_type: 'auto',
        });
        images.push(result.secure_url);
      }
    }

    // Check if quantity is changed, update in_stock accordingly
    if (req.body.quantity !== undefined) {
      req.body.in_stock = req.body.quantity > 0;
    }

    // Add images to the update query
    const query = { $set: { ...req.body } };
    if (images.length > 0) {
      query.$set.images = images; // Only add images if new ones are uploaded
    }

    // Update the product in the database
    const product = await Product.findByIdAndUpdate(id, query, { new: true }); // `new: true` returns the updated document

    // Response to client
    res.status(200).send({
      message: 'Product updated successfully',
      data: product,
    });

    // Optionally: Cleanup local files (if needed)
    // You can use fs.unlinkSync(file.path) or another library for cleanup.
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: 'Error updating product',
      error: error.message,
    });
  }
};

const update_product_raw = async (req, res) => {
  try {
    const { id } = req.params;

    // Handle file uploads and Cloudinary storage
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products',
          resource_type: 'auto',
        });
        images.push(result.secure_url);
      }
    }

    // Check if quantity is changed, update in_stock accordingly
    if (req.body.quantity !== undefined) {
      req.body.in_stock = req.body.quantity > 0;
    }

    // Add images to the update query
    const query = { $set: { ...req.body } };
    if (images.length > 0) {
      query.$set.images = images; // Only add images if new ones are uploaded
    }

    // Update the product in the database
    const product = await RawMaterial.findByIdAndUpdate(id, query, { new: true }); // `new: true` returns the updated document

    // Response to client
    res.status(200).send({
      message: 'Product updated successfully',
      data: product,
    });

    // Optionally: Cleanup local files (if needed)
    // You can use fs.unlinkSync(file.path) or another library for cleanup.
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: 'Error updating product',
      error: error.message,
    });
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


const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Product successfully deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

const deleteProductRaw = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await RawMaterial.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Product successfully deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};


export { deleteProductRaw,new_product_raw,get_product_raw,update_product_raw,get_product_Out,new_product, get_product, update_product, delete_product, image_update ,getOutProduct,deleteProduct};
