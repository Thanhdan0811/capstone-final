const {
  getAllUsers,
  createUserByAdmin,
  updateUser,
  getUserById,
  deleteUserById,
  searchUserByName,
} = require("./user.service");

exports.getAllUsers = async (req, res) => {
  const lists = await getAllUsers(req.query);
  res.json({ message: "List users", data: lists });
};

exports.createUserByAdmin = async (req, res) => {
  const user = await createUserByAdmin(req.user_id, req.body);
  res.json({ message: "User created", data: user });
};

exports.updateUser = async (req, res) => {
  const user = await updateUser(req.user_id, req.params, req.body, files);
  res.json({ message: "User updated", data: user });
};

exports.getUserById = async (req, res) => {
  const user = await getUserById(req.params);
  res.json({ message: "User Infomation", data: user });
};

exports.deleteUserById = async (req, res) => {
  await deleteUserById(req.user_id, req.params);
  res.json({ message: "User deleted", data: true });
};

exports.searchUserByName = async (req, res) => {
  const user = await searchUserByName(req.query);
  res.json({ message: "List User Searched", data: user });
};
