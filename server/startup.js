Meteor.startup(function(){
  	if (Posts.find().count() == 0){
  		for (var i=1;i<7;i++){
  			Posts.insert(
  			{
  				img_src:"images_"+i+".jpg",
  				img_alt:"Journey "+i 
  			}
  			);	
		}// end of for insert posts
		// count the posts!
		console.log("startup.js says: "+Posts.find().count());
	}// end of if have no posts
});
