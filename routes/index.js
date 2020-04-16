const express = require('express');
const bodyparser=require('body-parser')
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index',{ layout:false }));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard'  , {
    user: req.user
  })
);

router.get('/contact',function(req,res){
  res.send("Thanks for giving your valueable feedback");
})


// const Area = require('../models/Area');

router.get('/maps',function(req,res){
	res.render('map' , {
    user: req.user
})
});
router.get('/profile',function(req,res){
	res.render('profile', {
    user: req.user
})
});


router.get('/admin',function(req,res){
  res.render('admindashboard')
})
router.get('/add-hostel',function(req,res){
  res.render('addhostel')
})
router.get('/edit-info',function(req,res){
  res.render('edit-hostel')
})
router.post('/add-hostel',function(req,res){
	res.redirect('/admin')
})
router.get('/hostels',function(req,res){
  res.render('hostels')
})
router.post('/edit-info',function(req,res){
		res.redirect('/admin')
})

router.get('/livedata',function(req,res){
  res.render('live_stats',{ layout:false });
});

module.exports = router;
