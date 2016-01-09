Websites = new Mongo.Collection("websites");

if (Meteor.isClient) {
	
	/////
	// routing 
	/////
	
	Router.configure({
	  layoutTemplate: 'ApplicationLayout'
	});
	
	Router.route('/', function () {
	  this.render('navbar', {
	    to:"navbar"
	  });
	  this.render('main', {
	    to:"main"
	  });
	});
	
	Router.route('/websites/:_id', function () {
	  this.render('navbar', {
	    to:"navbar"
	  });
	  this.render('website', {
	    to:"main", 
	    data:function(){
	      return Websites.findOne({_id:this.params._id});
	    }
	  });
	});
	
	

	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		websites:function(){
			return Websites.find({}, {sort:{upVotes:-1}});
		}
	});


	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!
			var newUpVotes = 1;
			if(!isNaN(this.upVotes)) {
				newUpVotes = this.upVotes + 1;
			}
			Websites.update({_id:website_id}, {$set: {upVotes:newUpVotes} });

			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!
			var newDownVotes = 1;
			if(!isNaN(this.downVotes)) {
				newDownVotes = this.downVotes + 1;
			}
			Websites.update({_id:website_id}, {$set: {downVotes:newDownVotes} });

			return false;// prevent the button from reloading the page
		}
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
			var title = event.target.title.value;
			var description = event.target.description.value;
			console.log("The url they entered is: "+url);
			
			//  put your website saving code in here!	
			if(Meteor.user()) {
				if(url && description) {
					Websites.insert({
						url:url,
						title:title,
						description:description, 
    					createdOn:new Date()
					});
				}
			} else {
				console.log("User not logged in");
			}

			return false;// stop the form submit from reloading the page

		}
	});
	
	Template.website.events({
		"submit .js-save-comment-form":function(event){
			if(Meteor.user()) {
				console.log(this._id);
				var website_id = this._id;
				var comment = event.target.comment.value;
				Websites.update({_id:website_id}, {$push: {comments:comment} });
				event.target.comment.value = "";
			}
			return false;
		}
	});
}


if (Meteor.isServer) {
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
    // code to run on server at startup
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
    		createdOn:new Date()
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
    		createdOn:new Date()
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
    		createdOn:new Date()
    	});
    }
  });
}
