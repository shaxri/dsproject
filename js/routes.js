angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.login', {
    url: '/page5',
    views: {
      'tab1': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  .state('tabsController.signup', {
    url: '/page6',
    views: {
      'tab3': {
        templateUrl: 'templates/signup.html',
        controller: 'signupCtrl'
      }
    }
  })

  .state('menu2', {
      url: '/page7',
      templateUrl: 'templates/menu2.html',
      controller: 'menu2Ctrl'
    })


  

  .state('lastOrders', {
    url: '/page10/:chatId',
    templateUrl: 'templates/lastOrders.html',
    controller: 'lastOrdersCtrl'
  })
  .state('lastOrders2', {
    url: '/page100/:chatId',
    templateUrl: 'templates/lastOrders2.html',
    controller: 'lastOrdersCtrl2'
  })

  .state('favourite', {
    url: '/page11',
    templateUrl: 'templates/favourite.html',
    controller: 'favouriteCtrl'
  })

  .state('settings', {
    url: '/page12',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })

   

  .state('tabsController.forgotPassword', {
    url: '/page15',
    views: {
      'tab1': {
        templateUrl: 'templates/forgotPassword.html',
        controller: 'forgotPasswordCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/page5')



});
