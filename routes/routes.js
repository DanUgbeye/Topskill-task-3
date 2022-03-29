

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

//the user profile route
profileRouter.route('/login').get((req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
})

//the user profile route
profileRouter.route('/').get((req, res) => {
  // console.log(req.oidc.user);
  res.send(req.oidc.isAuthenticated() ? `Hello ${req.oidc.user.name}` : 'Log in to use this api');
}).name

module.exports = { profileRouter };