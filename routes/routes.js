
const profileRouter = require('express').Router();
const { 
  createProfile,
  getProfile, 
  getAllProfiles, 
  deleteProfile, 
  updateProfile, 
  searchProfile 
} = require('../controller/profileHandler');

//create a profile
profileRouter.route('/profile').post(createProfile)

//get a profile based on the id
profileRouter.route('/profile/:id').get(getProfile);

//gets all profiles
profileRouter.route('/profiles').get(getAllProfiles);

//deletes a profile
profileRouter.route('/profile/:id').delete(deleteProfile);

//updates a profile
profileRouter.route('/profile/:id').put(updateProfile);

//search for a user profile
profileRouter.route('/search').get(searchProfile);

module.exports = { profileRouter };