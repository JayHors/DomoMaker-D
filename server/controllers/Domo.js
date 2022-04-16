const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Name, age, and public are required!' });
  }
  const domoData = {
    name: req.body.name,
    age: req.body.age,
    pubPriv: req.body.pubPriv,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, pubPriv: newDomo.pubPriv });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }
    return res.status(400).json({ error: 'An error occured.' });
  }
};

const makerPage = (req, res) => res.render('app');

const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ domo: docs });
});

const publicDomos = (req, res) => DomoModel.findAllPublic((err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ domo: docs });
});

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  publicDomos,
};
