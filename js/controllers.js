angular.module('app.controllers',['ngCordova','ngMap'])

.controller('loginCtrl', function($scope,$rootScope,$ionicHistory,sharedUtils,$state,$ionicSideMenuDelegate) {
    $rootScope.extras = false;  // For hiding the side bar and nav icon

    // When the user logs out and reaches login page,
    // we clear all the history and cache to prevent back link
    $scope.$on('$ionicView.enter', function(ev) {
      if(ev.targetScope !== $scope){
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
      }
    });




    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
        $rootScope.extras = true;
        sharedUtils.hideLoading();
        $state.go('menu2', {}, {location: "replace"});

      }
    });


    $scope.loginEmail = function(formName,cred) {


      if(formName.$valid) {  // Check if the form data is valid or not

          sharedUtils.showLoading();

          //Email
          firebase.auth().signInWithEmailAndPassword(cred.email,cred.password).then(function(result) {

                // You dont need to save the users session as firebase handles it
                // You only need to :
                // 1. clear the login page history from the history stack so that you cant come back
                // 2. Set rootScope.extra;
                // 3. Turn off the loading
                // 4. Got to menu page

              $ionicHistory.nextViewOptions({
                historyRoot: true
              });
              $rootScope.extras = true;
              sharedUtils.hideLoading();
              $state.go('menu2', {}, {location: "replace"});

            },
            function(error) {
              sharedUtils.hideLoading();
              sharedUtils.showAlert("Note",error);
            }
        );

      }else{
        sharedUtils.showAlert("Note",error);
      }



    };


    $scope.loginFb = function(){
      //Facebook Login
    };

    $scope.loginGmail = function(){
      //Gmail Login
    };


})

.controller('signupCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,
                                   $state,fireBaseData,$ionicHistory) {
    $rootScope.extras = false; // For hiding the side bar and nav icon

    $scope.signupEmail = function (formName, cred) {

      if (formName.$valid) {  // Check if the form data is valid or not

        sharedUtils.showLoading();

        //Main Firebase Authentication part
        firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function (result) {

            //Add name and default dp to the Autherisation table
            result.updateProfile({
              displayName: cred.name,
              photoURL: "default_dp"
            }).then(function() {}, function(error) {});

            //Add phone number to the user table
			 var imgFile = document.getElementById("imag").src;
            fireBaseData.refUser().child(result.uid).set({
              telephone: cred.phone,
			  image:imgFile,
			  points:5000,
			  rating:3,
			  name:cred.name,
              Area:'A'
            });

            //Registered OK
            $ionicHistory.nextViewOptions({
              historyRoot: true
            });
            $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
            $rootScope.extras = true;
            sharedUtils.hideLoading();
            $state.go('menu2', {}, {location: "replace"});

        }, function (error) {
            sharedUtils.hideLoading();
            sharedUtils.showAlert("Note",error);
        });

      }else{
        sharedUtils.showAlert("Note",error);
      }

    }

  })

.controller('menu2Ctrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
                                  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils,NgMap,$timeout,$cordovaGeolocation,$firebaseObject) {
    $rootScope.extras = true;
    sharedUtils.showLoading();
 $scope.user_i=0;
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
    $scope.user_info = user;
    $scope.user_i=user.uid;
	$scope.user_extras= $firebaseObject(fireBaseData.refUser().child(user.uid));
	const rootref_A =fireBaseData.refUser().orderByChild("Area").equalTo('A');
    const rootref_B =fireBaseData.refUser().orderByChild("Area").equalTo('B');
    const rootref_C =fireBaseData.refUser().orderByChild("Area").equalTo('C');
    const rootref_D =fireBaseData.refUser().orderByChild("Area").equalTo('D');
    $scope.Allusers_A=$firebaseArray(rootref_A);
    $scope.Allusers_B=$firebaseArray(rootref_B);
    $scope.Allusers_C=$firebaseArray(rootref_C);
    $scope.Allusers_D=$firebaseArray(rootref_D);
    		
    console.log($scope.Allusers);
     sharedUtils.hideLoading();
     
                }
    });
$scope.Move = function (Areaname) {
	//alert("Areaname");
 fireBaseData.refUser().child($scope.user_i).update({
              Area:Areaname
            });
	
	swal("Done");
			
	}

})

//this code below are not used (just to cpoy and past) 

.controller('indexCtrl', function($scope,$rootScope,sharedUtils,$ionicHistory,$state,$ionicSideMenuDelegate,sharedCartService,fireBaseData,$firebaseObject,$firebaseArray) {

                                    
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.user_info=user; //Saves data to user_info
  $scope.user_extras= $firebaseObject(fireBaseData.refUser().child(user.uid));

        //Only when the user is logged in, the cart qty is shown
        //Else it will show unwanted console error till we get the user object
       

      }else {

        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {location: "replace"});

      }
    });

    $scope.logout=function(){

      sharedUtils.showLoading();

      // Main Firebase logout
      firebase.auth().signOut().then(function() {


        $ionicSideMenuDelegate.toggleLeft(); //To close the side bar
        $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

        $ionicHistory.nextViewOptions({
          historyRoot: true
        });


        $rootScope.extras = false;
        sharedUtils.hideLoading();
        $state.go('tabsController.login', {}, {location: "replace"});

      }, function(error) {
         sharedUtils.showAlert("Error","Logout Failed")
      });

    }

  })


.controller('lastOrdersCtrl', function($scope,$rootScope,fireBaseData,sharedUtils,$firebaseObject,$state,$stateParams,$timeout) {
 //alert("kl");
    $rootScope.extras = true;
    sharedUtils.showLoading();
$scope.youranswer="";
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        $scope.user_info = user;
        $scope.user_i=user.uid;
		 $scope.user_extras= $firebaseObject(fireBaseData.refUser().child(user.uid));
   

// console.log($scope.user_all_filed.user2)
 
// alert($scope.user_extras2.image)
		 
	 
        
          sharedUtils.hideLoading();
      }
    });
 
$scope.user_all_filed= $firebaseObject(fireBaseData.ref().child('batellbfileds').child($stateParams.chatId));
$scope.user_all_filed.$loaded().then(function() {
    $scope.user_extras2= $firebaseObject(fireBaseData.refUser().child($scope.user_all_filed.user1));

     });
      $scope.class = "button button-balanced";
$scope.class2 = "button button-balanced";
$scope.class3 = "button button-balanced";
 $scope.class4 = "button button-energized";

$scope.callAtTimeout = function() {
       
	          $scope.user_my=$scope.user_all_filed.user2re;
	   $scope.user_my_id=$scope.user_all_filed.user2;
	   
     $scope.user_other=$scope.user_all_filed.user1re;
	 $scope.user_other_id=$scope.user_all_filed.user1;
	 
if ($scope.user_my === undefined || $scope.user_other === undefined )    {
     //  sharedUtils.showLoading();
    }  else if($scope.user_my == 0 && $scope.user_other ==0) {
    
    
     // sharedUtils.showLoading();
    }else{
sharedUtils.hideLoading();
 
if ($scope.user_my == $scope.user_other){
alert("drow")

}else if ($scope.user_my==1 &&$scope.user_other==3){
alert("You Win");
 
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points+($scope.user_other_id_points.points/2);
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points/2;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });
}
else if ($scope.user_my==2 &&$scope.user_other==1){
alert("You Win");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points+($scope.user_other_id_points.points/2);
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points/2;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });

}
else if ($scope.user_my==3 &&$scope.user_other==2){
alert("You Win");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points+($scope.user_other_id_points.points/2);
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points/2;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });

}
 
else if ($scope.user_my==1 &&$scope.user_other==2){
alert("You Lost")
 $scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points/2;
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points+aa;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });
}
else if ($scope.user_my==2 &&$scope.user_other==3){
alert("You Lost");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points/2;
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points+aa;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });

 
}
else if ($scope.user_my==3 &&$scope.user_other==1){
alert("You Lost");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points/2;
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points+aa;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });

}
else if ($scope.user_my==2 &&$scope.user_other==1){
alert("You Lost");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points/2;
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points+aa;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });



}
 



    }

	   
    };

    $timeout( function(){ $scope.callAtTimeout(); }, 6000);

    


document.getElementById("mainmenu").disabled = true;


 $scope.AllcallAtTimeout = function() {
	   $scope.user_my=$scope.user_all_filed.user2re;
	   $scope.user_my_id=$scope.user_all_filed.user2;
	   
     $scope.user_other=$scope.user_all_filed.user1re;
	 $scope.user_other_id=$scope.user_all_filed.user1;
alert("You Win");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points+($scope.user_other_id_points.points/2);
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points/2;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });

   $state.go('menu2', {}, {location: "replace"});

};


 // $scope.AllcallAtTimeout = function() {

// document.getElementById("d4").disabled = true;

 // $scope.callAtTimeout();
// document.getElementById("mainmenu").disabled = false;
   // //$state.go('menu2', {}, {location: "replace"});

// };



document.getElementById("d4").disabled = true;


      $scope.do1=function(){
      firebase.database().ref('/batellbfileds/'+$stateParams.chatId).update({

	  user2re:1,
	  });
  $scope.class = "button button-energized";
document.getElementById("d1").disabled = true;
document.getElementById("d2").disabled = true;
document.getElementById("d3").disabled = true;
document.getElementById("d4").disabled = false;

$scope.youranswer="حجر";

    };
    $scope.do2=function(){
      firebase.database().ref('/batellbfileds/'+$stateParams.chatId).update({

	  user2re:2,
	  });

 $scope.class2 = "button button-energized";
 document.getElementById("d4").disabled = false;

document.getElementById("d1").disabled = true;
document.getElementById("d2").disabled = true;
document.getElementById("d3").disabled = true;
$scope.youranswer="ورقة";

    };
    $scope.do3=function(){
      firebase.database().ref('/batellbfileds/'+$stateParams.chatId).update({

	  user2re:3,
	  });
$scope.class3 = "button button-energized";
document.getElementById("d4").disabled = false;

document.getElementById("d1").disabled = true;
document.getElementById("d2").disabled = true;
document.getElementById("d3").disabled = true;
$scope.youranswer="مقص";
    };

 

})
.controller('lastOrdersCtrl2', function($scope,$rootScope,fireBaseData,sharedUtils,$firebaseObject,$state,$stateParams,$timeout) {
 //alert("kl");
    $rootScope.extras = true;
    sharedUtils.showLoading();
$scope.youranswer="";
    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        $scope.user_info = user;
        $scope.user_i=user.uid;
		 $scope.user_extras= $firebaseObject(fireBaseData.refUser().child(user.uid));
   $scope.user_all_filed= $firebaseObject(fireBaseData.ref().child('batellbfileds').child($stateParams.chatId));
$scope.user_all_filed.$loaded().then(function() {
    $scope.user_extras2= $firebaseObject(fireBaseData.refUser().child($scope.user_all_filed.user2));
   
     });

// console.log($scope.user_all_filed.user2)
 
// alert($scope.user_extras2.image)
		 
	 
        
          sharedUtils.hideLoading();
      }
    });
    
	   $scope.recognizedText = "booking";
    
$scope.record = function() {
	//alert("hi");
    //var recognition = new webkitSpeechRecognition(); //To Computer
    var recognition = new SpeechRecognition(); // To Device
    //recognition.lang = 'en-GB';
    recognition.lang = 'ru-RU';
    
    recognition.onresult = function(event) {
        if (event.results.length > 0) {
            $scope.recognizedText = event.results[0][0].transcript;
			$scope.spokentext=$scope.recognizedText;
            $scope.$apply();
        }
    };
    
    recognition.start();
};
	
 $scope.AllcallAtTimeout = function() {
	   $scope.user_my=$scope.user_all_filed.user2re;
	   $scope.user_my_id=$scope.user_all_filed.user2;
	   
     $scope.user_other=$scope.user_all_filed.user1re;
	 $scope.user_other_id=$scope.user_all_filed.user1;
alert("You Win");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points+($scope.user_other_id_points.points/2);
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points/2;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });

   $state.go('menu2', {}, {location: "replace"});

};
	

      $scope.class = "button button-balanced";
$scope.class2 = "button button-balanced";
$scope.class3 = "button button-balanced";

 
         $scope.class4 = "button button-energized";
 
$scope.callAtTimeout = function() {
       
	          $scope.user_my=$scope.user_all_filed.user1re;
	   $scope.user_my_id=$scope.user_all_filed.user1;
	   
     $scope.user_other=$scope.user_all_filed.user2re;
	 $scope.user_other_id=$scope.user_all_filed.user2;
	 
if ($scope.user_my === undefined || $scope.user_other === undefined )    {
     //  sharedUtils.showLoading();
    }  else if($scope.user_my == 0 && $scope.user_other ==0) {
    
    
     // sharedUtils.showLoading();
    }else{
sharedUtils.hideLoading();
 
if ($scope.user_my == $scope.user_other){
alert("drow")

}else if ($scope.user_my==1 &&$scope.user_other==3){
alert("You Win");
 
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points+($scope.user_other_id_points.points/2);
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points/2;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });
}
else if ($scope.user_my==2 &&$scope.user_other==1){
alert("You Win");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points+($scope.user_other_id_points.points/2);
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points/2;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });

}
else if ($scope.user_my==3 &&$scope.user_other==2){
alert("You Win");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points+($scope.user_other_id_points.points/2);
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points/2;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });

}
 
else if ($scope.user_my==1 &&$scope.user_other==2){
alert("You Lost")
 $scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points/2;
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points+aa;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });
}
else if ($scope.user_my==2 &&$scope.user_other==3){
alert("You Lost");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points/2;
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points+aa;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });

 
}
else if ($scope.user_my==3 &&$scope.user_other==1){
alert("You Lost");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points/2;
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points+aa;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });

}
else if ($scope.user_my==2 &&$scope.user_other==1){
alert("You Lost");
$scope.user_other_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_other_id));
$scope.user_other_id_points.$loaded().then(function() {
       $scope.user_my_id_points= $firebaseObject(fireBaseData.refUser().child($scope.user_my_id));
 $scope.user_my_id_points.$loaded().then(function() {
        alert($scope.user_my_id_points.points);
      var aa =$scope.user_my_id_points.points/2;
alert(aa);
fireBaseData.refUser().child($scope.user_my_id).update({
              
			  points:aa,
			 
            });
			var cc=$scope.user_other_id_points.points+aa;
			fireBaseData.refUser().child($scope.user_other_id).update({
              
			  points:cc,
			 
            });
			firebase.database().ref('/passengers/'+$scope.user_other_id+'/fights/'+$scope.user_my_id).update({
	  
	 
	 donefight:1,
	  
	  });
	  firebase.database().ref('/passengers/'+$scope.user_my_id+'/fights/'+$scope.user_other_id).update({
	  
	 
	 donefight:1,
	  
	  });
			




     });
   });



}
 



    }

	   
    };

    // $timeout( function(){ $scope.callAtTimeout(); }, 6000);








// document.getElementById("mainmenu").disabled = true;


 // $scope.AllcallAtTimeout = function() {

// document.getElementById("d4").disabled = true;

 // $scope.callAtTimeout();
// document.getElementById("mainmenu").disabled = false;
   // //$state.go('menu2', {}, {location: "replace"});

// };



// document.getElementById("d4").disabled = true;











      $scope.do1=function(){
        document.getElementById("d4").disabled = false;

      firebase.database().ref('/batellbfileds/'+$stateParams.chatId).update({

	  user1re:1,
	  });
  $scope.class = "button button-energized";
document.getElementById("d1").disabled = true;
document.getElementById("d2").disabled = true;
document.getElementById("d3").disabled = true;
$scope.youranswer="حجر";

    };
    $scope.do2=function(){
      document.getElementById("d4").disabled = false;

      firebase.database().ref('/batellbfileds/'+$stateParams.chatId).update({

	  user1re:2,
	  });

 $scope.class2 = "button button-energized";
document.getElementById("d1").disabled = true;
document.getElementById("d2").disabled = true;
document.getElementById("d3").disabled = true;
$scope.youranswer="ورقة";

    };
    $scope.do3=function(){
      document.getElementById("d4").disabled = false;

      firebase.database().ref('/batellbfileds/'+$stateParams.chatId).update({

	  user1re:3,
	  });
$scope.class3 = "button button-energized";
document.getElementById("d1").disabled = true;
document.getElementById("d2").disabled = true;
document.getElementById("d3").disabled = true;
$scope.youranswer="مقص";
    };

 

})



.controller('favouriteCtrl', function($scope,$rootScope, $ionicLoading, $state,  $stateParams) {

    $rootScope.extras=true;
	 
	
	
	
})

.controller('settingsCtrl', function($scope,$rootScope,fireBaseData,$firebaseObject,
                                     $ionicPopup,$state,$window,$firebaseArray,
                                     sharedUtils) {
    //Bugs are most prevailing here
    $rootScope.extras=true;

    //Shows loading bar
    sharedUtils.showLoading();

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {

        //Accessing an array of objects using firebaseObject, does not give you the $id , so use firebase array to get $id
        $scope.addresses= $firebaseArray(fireBaseData.refUser().child(user.uid).child("address"));

        // firebaseObject is good for accessing single objects for eg:- telephone. Don't use it for array of objects
        $scope.user_extras= $firebaseObject(fireBaseData.refUser().child(user.uid));

        $scope.user_info=user; //Saves data to user_info
        //NOTE: $scope.user_info is not writable ie you can't use it inside ng-model of <input>

        //You have to create a local variable for storing emails
        $scope.data_editable={};
        $scope.data_editable.email=$scope.user_info.email;  // For editing store it in local variable
        $scope.data_editable.password="";

        $scope.$apply();

        sharedUtils.hideLoading();

      }

    });

    $scope.addManipulation = function(edit_val) {  // Takes care of address add and edit ie Address Manipulator


      if(edit_val!=null) {
        $scope.data = edit_val; // For editing address
        var title="تعديل العنوان";
        var sub_title="تعديل الهوان المدخل";
      }
      else {
        $scope.data = {};    // For adding new address
        var title="اضافة عنوان";
        var sub_title="اضافة عنوان جديد";
      }
      // An elaborate, custom popup
      var addressPopup = $ionicPopup.show({
        template: '<input type="text"   placeholder="الاسم"  ng-model="data.nickname"> <br/> ' +
                  '<input type="text"   placeholder="العنوان" ng-model="data.address"> <br/> ' +
                  '<input type="number" placeholder="الرمز" ng-model="data.pin"> <br/> ' +
                  '<input type="number" placeholder="الهاتف" ng-model="data.phone">',
        title: title,
        subTitle: sub_title,
        scope: $scope,
        buttons: [
          { text: 'اغلاق' },
          {
            text: '<b>حفظ</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.nickname || !$scope.data.address || !$scope.data.pin || !$scope.data.phone ) {
                e.preventDefault(); //don't allow the user to close unless he enters full details
              } else {
                return $scope.data;
              }
            }
          }
        ]
      });

      addressPopup.then(function(res) {

        if(edit_val!=null) {
          //Update  address
          if(res!=null){ // res ==null  => close 
            fireBaseData.refUser().child($scope.user_info.uid).child("address").child(edit_val.$id).update({    // set
              nickname: res.nickname,
              address: res.address,
              pin: res.pin,
              phone: res.phone
            });
          }
        }else{
          //Add new address
          fireBaseData.refUser().child($scope.user_info.uid).child("address").push({    // set
            nickname: res.nickname,
            address: res.address,
            pin: res.pin,
            phone: res.phone
          });
        }

      });

    };

    // A confirm dialog for deleting address
    $scope.deleteAddress = function(del_id) {
      var confirmPopup = $ionicPopup.confirm({
        title: 'حذف عنوان',
        template: 'هل انت متأكد من الحذف',
        buttons: [
          { text: 'لا' , type: 'button-stable' },
          { text: 'نعم', type: 'button-assertive' , onTap: function(){return del_id;} }
        ]
      });

      confirmPopup.then(function(res) {
        if(res) {
          fireBaseData.refUser().child($scope.user_info.uid).child("address").child(res).remove();
        }
      });
    };

    $scope.save= function (extras,editable) {
      //1. Edit Telephone doesnt show popup 2. Using extras and editable  // Bugs
      if(extras.telephone!="" && extras.telephone!=null ){
        //Update  Telephone
        fireBaseData.refUser().child($scope.user_info.uid).update({    // set
          telephone: extras.telephone
        });
      }

      //Edit Password
      if(editable.password!="" && editable.password!=null  ){
        //Update Password in UserAuthentication Table
        firebase.auth().currentUser.updatePassword(editable.password).then(function(ok) {}, function(error) {});
        sharedUtils.showAlert("الحساب","تعديل كلمة المرور");
      }

      //Edit Email
      if(editable.email!="" && editable.email!=null  && editable.email!=$scope.user_info.email){

        //Update Email/Username in UserAuthentication Table
        firebase.auth().currentUser.updateEmail(editable.email).then(function(ok) {
          $window.location.reload(true);
          //sharedUtils.showAlert("Account","Email Updated");
        }, function(error) {
          sharedUtils.showAlert("خطأ",error);
        });
      }

    };

    $scope.cancel=function(){
      // Simple Reload
      $window.location.reload(true);
      console.log("اغلاق");
    }

})

.controller('supportCtrl', function($scope,$rootScope) {

    $rootScope.extras=true;
	
	
	
	
	
	

})

.controller('forgotPasswordCtrl', function($scope,$rootScope) {
    $rootScope.extras=false;
  })

.controller('checkoutCtrl', function($scope,$rootScope,sharedUtils,$state,$firebaseArray,
                                     $ionicHistory,fireBaseData, $ionicPopup,sharedCartService) {

    $rootScope.extras=true;

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        $scope.addresses= $firebaseArray( fireBaseData.refUser().child(user.uid).child("address") );
        $scope.user_info=user;
      }
    });

    $scope.payments = [
     // {id: 'CREDIT', name: 'Credit Card'},
      {id: 'doc', name: ' سأدفع عند الوصول اليكم'},
      {id: 'COD', name: 'ٍسأدفع عند توصيلكم لطلبي'}
    ];

    $scope.pay=function(address,payment){

      if(address==null || payment==null){
        //Check if the checkboxes are selected ?
        sharedUtils.showAlert("خطأ","اختار طريقة الدفع وعنوانك")
      }
      else {
        // Loop throw all the cart item
        for (var i = 0; i < sharedCartService.cart_items.length; i++) {
          //Add cart item to order table
          fireBaseData.refOrder().push({

            //Product data is hardcoded for simplicity
            product_name: sharedCartService.cart_items[i].item_name,
            product_price: sharedCartService.cart_items[i].item_price,
            product_image: sharedCartService.cart_items[i].item_image,
            product_id: sharedCartService.cart_items[i].$id,

            //item data
            item_qty: sharedCartService.cart_items[i].item_qty,

            //Order data
            user_id: $scope.user_info.uid,
            user_name:$scope.user_info.displayName,
            address_id: address,
            payment_id: payment,
            status: "تم الطلب"
          });

        }

        //Remove users cart
        fireBaseData.refCart().child($scope.user_info.uid).remove();

        sharedUtils.showAlert("المعلومات", "تم ارسال طلبك");

        // Go to past order page
        $ionicHistory.nextViewOptions({
          historyRoot: true
        });
        $state.go('lastOrders', {}, {location: "replace", reload: true});
      }
    }



    $scope.addManipulation = function(edit_val) {  // Takes care of address add and edit ie Address Manipulator


      if(edit_val!=null) {
        $scope.data = edit_val; // For editing address
        var title="تعديل العنوان";
        var sub_title="تعديل العنوان";
      }
      else {
        $scope.data = {};    // For adding new address
        var title="اضافة عنوان";
        var sub_title="اضافة عنوان جديد";
      }
      // An elaborate, custom popup
      var addressPopup = $ionicPopup.show({
        template: '<input type="text"   placeholder="الاسم "  ng-model="data.nickname"> <br/> ' +
        '<input type="text"   placeholder="العنوان" ng-model="data.address"> <br/> ' +
        '<input type="number" placeholder="رقم الهاتف" ng-model="data.pin"> <br/> ' +
        '<input type="number" placeholder="رقم هاتف اخر " ng-model="data.phone">',
        title: title,
        subTitle: sub_title,
        scope: $scope,
        buttons: [
          { text: 'Close' },
          {
            text: '<b>Save</b>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.nickname || !$scope.data.address || !$scope.data.pin || !$scope.data.phone ) {
                e.preventDefault(); //don't allow the user to close unless he enters full details
              } else {
                return $scope.data;
              }
            }
          }
        ]
      });

      addressPopup.then(function(res) {

        if(edit_val!=null) {
          //Update  address
          fireBaseData.refUser().child($scope.user_info.uid).child("address").child(edit_val.$id).update({    // set
            nickname: res.nickname,
            address: res.address,
            pin: res.pin,
            phone: res.phone
          });
        }else{
          //Add new address
          fireBaseData.refUser().child($scope.user_info.uid).child("address").push({    // set
            nickname: res.nickname,
            address: res.address,
            pin: res.pin,
            phone: res.phone
          });
        }

      });

    };


  })

