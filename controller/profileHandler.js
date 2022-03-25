const {validator, profileModel} = require('../model/profileSchema');

// this creates a user profile 
const createProfile = async (req, res) => {

  try {
    //validating the request body using joi library
    const {error, value} = validator.validate(req.body);
    if(error){
      res.status(400).send(error);
      return;
    }
    const profile = new profileModel(value);
    const resp = await profile.save();
    res.send(resp);
  } catch(err) {
    res.status(404).send(err);
  }

}

//this gets a user based on supplied id
const getProfile = async (req, res) => {

  try {
    const id = req.params.id;
    const resp = await profileModel.find({"_id": id});
    if(resp.length < 1) {
      res.send('no user found');
      return;
    }
    res.send(resp);
  } catch(err) {
    res.status(404).send(err);
  }
}

//this gets all the users 
const getAllProfiles = async (req, res) => {

  try{
    // getting the page from the request query
    const { page } = req.query;
    if(!page) page = 0;

    const resp = await profileModel.find()
    .sort( {firstName: 'asc'} )
    .skip(page*2)
    .limit(2);

    if(resp.length < 1) {
      res.send('no users');
      return ;
    }
    res.send(resp);
  }catch(err) {
    res.status(404).send(err);
  }

}

//this deletes a user using an id
const deleteProfile = async (req, res) => {

  try {
    const id = req.params.id;
    const resp = await profileModel.deleteOne({"_id": id});
    if(resp.deletedCount === 1) {
      res.send('deleted');
      return;
    }
    res.send('user does not exist');
  }catch(err) {
    res.status(404).send(err);
  }

}

//this updates user data
const updateProfile = async (req, res) => {

  try{
    const id = req.params.id;

    //validating the request body using joi library
    const {error, value} = validator.validate(req.body);
    if(error) {
      res.status(400).send(error);
      return;
    }
    const resp = await profileModel.findByIdAndUpdate(id, value);
    res.send(resp);
  } catch(err) {
    res.status(404).send(err);
  }
}

//this searches a profile based on a key and value
const searchProfile = async (req, res) => {

  try {
    const {key, value} = req.query;
    let resp;
    if(key === 'firstName') {
      resp = await profileModel.find({firstName: value});
    }else if(key === 'lastName') {
      resp = await profileModel.find({lastName: value});
    }else {
      res.send('supply a valid key');
    }
    res.send(resp);
    return;
  } catch(err) {
    res.status(404).send(err);
  }
}

module.exports = { createProfile, getProfile, getAllProfiles, deleteProfile, updateProfile, searchProfile };