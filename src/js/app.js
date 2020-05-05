App = {
  web3Provider: null,
  contracts: {},

  initWeb3: async function() {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('news.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.news = TruffleContract(data);
    
      // Set the provider for our contract
      App.contracts.news.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      // return App.markAdopted();
      return App.init();

    });

    // return App.bindEvents();
      return App.AddNewsButton();

  },
  init: async function() {
    // Load Products.
    var postInstance;

    App.contracts.news.deployed().then(function(instance){
      postInstance = instance;
      return postInstance.newsCount();
    }).then(function(result){

      var counts = result.c[0];
      console.log("Total News : "+counts);

      for (var i = 1; i <= counts; i ++) {
        postInstance.newsfeeds(i).then(function(result)
        {
          console.log("Publisher Address:" +result[0]);
          console.log("News:" +result[1]);

          var newsRow = $('#newsRow');
          var postTemplate = $('#postTemplate');

          postTemplate.find('.panel-title').text(result[0]);
          postTemplate.find('.desc').text(result[1]);
          newsRow.append(postTemplate.html());
         });
      }
    }); 
},

  AddNewsButton: function() {
    $(document).on('click', '.addNews', App.AddNews);
  },

  
  AddNews:function(event){
    var post = document.getElementById('post').value
    var postInstance;
    App.contracts.news.deployed().then(function(instance){
      postInstance = instance;
      return postInstance.addnews(post);
    }); 
    console.log("News posted");
  },
};

$(function() {
  $(window).load(function() {
    App.initWeb3();
  });
});