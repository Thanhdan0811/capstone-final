const {
  addListService,
  getAllListings,
  getListByAddress,
  getListingById,
  updateListingById,
  deleteListing,
  uploadImgsListing,
} = require("./listing.service.js");

exports.getListing = async (req, res) => {
  const lists = await getAllListings(req.query);
  res.json({ message: "get listings", data: lists });
};

exports.addList = async (req, res) => {
  const listNew = await addListService(req.user_id, req.body, req.files);
  delete req.user_id;
  res.json({ message: "Listing create successed", data: listNew });
};

exports.getListByAddress = async (req, res) => {
  const lists = await getListByAddress(req.query);
  res.json({ message: "Listing by address", data: lists });
};

exports.getListingById = async (req, res) => {
  const lists = await getListingById(req.params);
  res.json({ message: "Listing by id", data: lists });
};

exports.updateListingById = async (req, res) => {
    const listing = await updateListingById(req.params, req.user_id, req.body, req.files);
    delete req.user_id;
    res.json({ message: "Update listing successed", data: listing });
};

exports.deleteListing = async (req, res) => {
    await deleteListing(req.params, req.user_id);
    delete req.user_id;
    res.json({ message: "Delete listing successed", data: true });
}

exports.uploadImgsListing = async (req, res) => {
    const newListing = await uploadImgsListing(req.user_id, req.files, req.body);
    delete req.user_id;
    res.json({message: "Upload images listing success", data: newListing})
}