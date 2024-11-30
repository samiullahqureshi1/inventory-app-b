import { Product } from "../models/product_model.js";
import cloudinary from "../utils/validations/cloudinary.js";
import { RawMaterial } from "../models/raw.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { order } from "../models/order.js";
import { fileURLToPath } from "url";

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

const createOrder = async (req, res) => {
  try {
    const { product, quantity, price, discount = 0, status } = req.body;

    // Validate input
    if (!product || !quantity || !price || !status) {
      return res.status(400).json({ error: "Missing required fields: product, quantity, price, or status" });
    }

    if (quantity <= 0 || price <= 0 || discount < 0) {
      return res.status(400).json({ error: "Invalid values: quantity, price, and discount must be positive numbers" });
    }

    // Find the product by its name
    const existingProduct = await Product.findOne({ product_name: product });
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check stock availability (only if status is "complete")
    if (status === "Completed" && existingProduct.quantity < quantity) {
      return res.status(400).json({ error: `Insufficient stock. Only ${existingProduct.quantity} items available.` });
    }

    // Calculate the total price
    const totalPrice = Math.max(quantity * price - discount, 0); // Ensure total is non-negative

    // Deduct the ordered quantity from stock if status is "complete"
    if (status === "Completed") {
      existingProduct.quantity -= quantity;
    }

    // Create a new order
    const newOrder = new order({
      product,
      quantity,
      price,
      discount,
      totalPrice,
      status,
    });

    // Save the product and order changes atomically
    if (status === "Completed") {
      await Promise.all([existingProduct.save(), newOrder.save()]);
    } else {
      await newOrder.save(); // Save the order without modifying product stock
    }

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};



const getOrder = async (req, resp) => {
  try {
    const data_get = await order.aggregate([
      {
        $match:{
          status:'Completed'
        }
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

const getOrderProccessing = async (req, resp) => {
  try {
    const data_get = await order.aggregate([
      {
        $match:{
          status:'Processing'
        }
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

const getPendingOrder = async (req, resp) => {
  try {
    const data_get = await order.aggregate([
      {
        $match:{
          status:'Pending'
        }
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

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await order.findByIdAndDelete(id);
    if (result) {
      res.status(200).json({ message: 'Order successfully deleted' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};


const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the order by ID
    const Order = await order.findById(id);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    // Fetch the product based on product_name in the order
    const product = await Product.findOne({ product_name: Order.product });
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Check if product quantity is sufficient
    if (product.quantity < Order.quantity) {
      return res
        .status(400)
        .send(
          `Insufficient stock. Available quantity: ${product.quantity}`
        );
    }

    // Update the product quantity
    product.quantity -= Order.quantity;
    await product.save();

    // Update the order status to completed
    const query = {
      $set: {
        ...req.body,
        status: req.body.status || 'Completed', // Default to 'Completed' if not provided
      },
    };
    const updatedOrder = await order.findByIdAndUpdate(id, query, {
      new: true,
    });

    if (updatedOrder) {
      return res
        .status(200)
        .send({
          message: 'Order updated to completed and stock updated',
        });
    }

    res.status(404).send('Order not updated');
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).send('Something went wrong');
  }
};

const orderDelivered = async (req, res) => {
  try {
    const { id } = req.params;

    // Default query object, status set to 'completed'
    const query = {
      $set: {
        ...req.body,
       status: req.body.status || 'Delivered', // If status not provided, default to 'completed'
      },
    };

    // Find and update the order
    const result = await order.findByIdAndUpdate(id, query, { new: true });
console.log(result)
    if (result) {
      return res.status(200).send('Order updated to delivered');
    }

    res.status(404).send('Order not found');
  } catch (error) {
    res.status(500).send('Something went wrong');
  }
};


const getWeeklySales = async (req, resp) => {
  try {
    // Get the start of the current week (Monday)
    const currentDate = new Date();
    const startOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1) // Monday
    );
    startOfWeek.setHours(0, 0, 0, 0); // Set time to 00:00:00

    // Fetch weekly delivered orders and calculate the total price
    const data_get = await order.aggregate([
      {
        $match: {
          status: 'Delivered',
          createdAt: { $gte: startOfWeek }, // Filter orders from the start of the week
        },
      },
      {
        $group: {
          _id: null, // Group all documents into one
          totalSales: { $sum: "$totalPrice" }, // Sum the totalPrice field
          orders: { $push: "$$ROOT" }, // Optional: Include detailed orders if needed
        },
      },
    ]);

    if (data_get.length === 0) {
      return resp.status(200).json({ 
        message: "No delivered orders found for the current week", 
        totalSales: 0, 
        orders: [] 
      });
    }

    resp.status(200).json({
      message: "Weekly delivered orders fetched successfully",
      totalSales: data_get[0].totalSales,
      orders: data_get[0].orders, // Optional: Return detailed orders
    });
  } catch (error) {
    console.error('Error fetching weekly delivered orders:', error);
    resp.status(500).json({ error: error.message });
  }
};


const getAllOrders = async (req, resp) => {
  try {
    const data_get = await order.aggregate([
      {
        $sort:{createdAt:-1}
      },
      {
        $group: {
          _id: null, // Group all documents into one
          totalSales: { $sum: "$totalPrice" }, // Sum the totalPrice field
          orders: { $push: "$$ROOT" }, // Optional: Include detailed orders if needed
        },
      },
    ])
    if (data_get.length === 0) {
      return resp.status(200).json({ 
        message: "No orders found", 
        totalSales: 0, 
        orders: [] 
      });
    }

    resp.status(200).json({
      message: "All orders fetched successfully",
      totalSales: data_get[0].totalSales,
      orders: data_get[0].orders, // Optional: Return detailed orders
    });
  } catch (error) {
    resp.status(400).json(error.message)
  }
};


export {getAllOrders,getWeeklySales,orderDelivered,updateOrder, deleteOrder,getPendingOrder,getOrderProccessing,getOrder,createOrder,deleteProductRaw,new_product_raw,get_product_raw,update_product_raw,get_product_Out,new_product, get_product, update_product, delete_product, image_update ,getOutProduct,deleteProduct};
