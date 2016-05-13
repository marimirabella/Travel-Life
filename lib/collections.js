Posts = new Mongo.Collection("posts"); //conect MongoDB

//set up security on allow Posts collection
Posts.allow({
	// we need to be able to update posts for ratings.
	update:function(userId, doc){
		console.log("testing security on post update");
		if (Meteor.user()){// they are logged in
			return true;
		} else {// user not logged in - do not let them update  the post. 
			return false;
		}
	},
	insert: function(userId, doc){
		console.log("testing security on post insert");
		if(Meteor.user()){ //they are logged in
			if(userId != doc.createdBy){//the user is messing about
				return false;
			}
			else{ //the user is logged in, the image has the correct user id
				return true;
			}
		}
		else{ //user not logged in
			return false;
		}
		//return false; //don't allow user to insert data
	},
	remove: function(userId, doc){
		//return true; - every user can delete every post
		if(Meteor.user()){ //they are logged in
			if(userId != doc.createdBy){//the user is messing about
				return false;
			}
			else{ //the user is logged in, the image has the correct user id
				return true;
			}
		}
		else{ //user not logged in
			return false;
		}
	}
});
