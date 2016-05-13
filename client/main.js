  //routing
  Router.configure({
    layoutTemplate: 'ApplicationLayout' //main template for others routes
  });

  Router.route('/', function () {  
     this.render('navbar',{ 
      to:"navbar"
     }); 
     this.render('posts',{ 
      to:"main"
     });
   });

  Router.route('/post/:_id', function (){  
     this.render('navbar',{ 
      to:"navbar"
     }); 
     this.render('post',{ //one post in a new page
      to:"main",
      data: function(){
        return Posts.findOne({_id:this.params._id});
      }
     }); 
   });

  //infinitscroll
  Session.set("postLimit", 8); //made a limit of posts
  lastScrollTop = 0;

  $(window).scroll(function(event){ //infinite scroll
    //test if we are near the bottom of the window
    if($(window).scrollTop() + $(window).height() > $(document).height() - 100){ //$(document).height() - 100 - -100 because then not doing scroll, it's mean on 100 less then height of 8 posts.
      //console.log(new Date()); //started with check of scrolling
      //where we are in the page?
      var scrollTop = $(this).scrollTop(); 
      //see if we are going up or down
      if(scrollTop > lastScrollTop){
        //console.log("going down at the bottom of the page");
        //yes we are heading down...
        Session.set("postLimit", Session.get("postLimit") + 4); //+4 images
      }
      //test if we are going down
      lastScrollTop = scrollTop;
    }
  });

  //accounts config
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });

  //////////
  //Helpers
  /////////

  Template.posts.helpers({
    posts:function(){
      if(Session.get("userFilter")){ //they set a filter! 
        return Posts.find({createdBy:Session.get("userFilter")}, {sort:{createdOn: -1}});
      }
      else{
        return Posts.find({}, {sort:{createdOn: -1}, limit:Session.get("postLimit")});
      }
   },
    filtering_posts:function(){ 
       if(Session.get("userFilter")){ //they set a filter!
        return true;
      }
      else{
        return false; //remove filter
      }
   },
    getFilterUser:function(){ //filtr for watching what user are creating post in h2
       if(Session.get("userFilter")){ //they set a filter! 
        var user = Meteor.users.findOne({_id:Session.get("userFilter")}); //the session variable is used as a filter
        return user.username;
      }
      else{
        return false; 
      }
   },
    getUser:function(user_id){ // created name with id
      var user = Meteor.users.findOne({_id:user_id}); //_id - id filter
      if(user){
        return user.username;
      }
      else{
        return "Anonymous";
      }
    }
  });

  Template.posts.helpers({
    username:function(){
      if(Meteor.user()){
        return Meteor.user().username;
      }
      else{
        return false;
      }
  }});

  /////////
  //Events
  ////////
  
  Template.posts.events({
    "click .js-del-post": function(event){
      var post_id = this._id;
      var post = this;
      console.log(post_id);
      console.log(post.createdBy);
      console.log(Meteor.userId());
      // use jquery to hide the image component
      // then remove it at the end of the animation
      if(Meteor.user()){
        if(Meteor.userId() != post.createdBy){//the user is messing about
          alert("You can delete only yours Blog posts!");
        }
        else{
          $("#"+post_id).hide("slow", function(){ //making deletion slowly through JQuery
            Posts.remove({"_id":post_id}); 
          });
        }
      }
      else{
        alert("You can delete only yours Blog posts!");
      }
    },
    "click .js-show-post-form": function(event){ //show modal
      $("#post_add_form").modal("show");
    },
    "click .js-set-user-filter": function(event){ //remember which user clicks, set a filter
      Session.set("userFilter", this.createdBy);
    },
    "click .js-unset-user-filter": function(event){ //remove filter
      Session.set("userFilter", undefined); //undefined - mean false
    }
  });

    Template.post_add_form.events({ //new template for form
      "submit .js-add-post": function(event){ //submit for button
        var img_src, img_alt, descr; 
        img_src = event.target.img_src.value;
        img_alt = event.target.img_alt.value;
        descr = event.target.descr.value;
        console.log("src: " + img_src + " alt: " + img_alt + " descr: " + descr);
        if(Meteor.user()){
          Posts.insert({
            img_src:img_src,
            img_alt:img_alt,
            descr:descr,
            createdOn: new Date(), //createdOn - create a new field with date
            createdBy: Meteor.user()._id //add id 1step
          });
        }
          $("#post_add_form").modal("hide"); //dismiss the modal, closs window after adding
          return false; //return false from event handlers to stop the default event
      }
    });