const User = require("../models/User");

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
};

exports.updateMemory = async (req, res) => {
  const { fact } = req.body;

  const user = await User.findById(req.params.id);

  user.memory.facts.push(fact);

  await user.save();

  res.json(user);
};