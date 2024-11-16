import { Raw_Material } from "../models/raw_material_model.js";

// Create
const new_data = async (req, resp) => {
  try {
    const data = new Raw_Material(req.body);
    const save_data = await data.save();
    resp
      .status(200)
      .send({ message: `Data saved successfully`, data: save_data });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Get
const get_data = async (req, resp) => {
  try {
    const data = await Raw_Material.aggregate([
      {
        $match: {},
      },
    ]);
    resp.status(200).send({ message: `Data fetched successfully`, data: data });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Update
const update_data = async (req, resp) => {
  try {
    const data = await Raw_Material.findByIdAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    resp.status(200).send({ message: `Data updated successfully`, data: data });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

// Delete
const delete_data = async (req, resp) => {
  try {
    const data = await Raw_Material.findByIdAndDelete({ _id: req.params.id });
    resp.status(200).send({ message: `Data deleted successfully`, data: data });
  } catch (error) {
    resp.status(400).send(error.message);
  }
};

export { new_data, get_data, update_data, delete_data };
