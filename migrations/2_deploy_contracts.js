var news = artifacts.require("./news.sol");
module.exports = function(deployer) {
deployer.deploy(news);
};