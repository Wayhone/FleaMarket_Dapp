// Import the page's CSS. Webpack will know what to do with it.
import '../styles/index.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import fleaMarketArtifact from '../../build/contracts/FleaMarket.json'

// FleaMarket is our usable abstraction, which we'll use through the code below.
let FleaMarket = contract(fleaMarketArtifact)

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.

window.BuyProduct = function(pid)
{
	if (isNaN(pid))
		return;

	var ethPrice;
	FleaMarket.deployed().then(function(contractInstance) {
		contractInstance.getProduct(pid).then(function(result) {
			console.log("# result: " + result)

			// 解析商品状态
			if (result[3] == 1) {
				$('.sold-alert').addClass('sold-alert-show');
				console.log("Oops")
				setTimeout(function() {
					$('.sold-alert').removeClass('sold-alert-show');					
				}, 2000);	
				return;			
			}

			// 弹窗 确认是否购买
			$(".mask-div").css('display', 'block'); 
			$('.confirmation').css('display', 'block'); 

			// 确认购买
			$('.confirmation-confirm-btn').on("click", function(){ 
				$(".mask-div").css('display', 'none'); 
				$('.confirmation').css('display', 'none'); 
				
				let price = result[4] / 1000000000000000000;
				ethPrice = web3.toWei(price, 'ether');

				console.log("Buying product " + pid.toString())
				console.log("Price is " + ethPrice)
			
				FleaMarket.deployed().then(function(contractInstance) {
					contractInstance.buyProduct(pid, {from: web3.eth.accounts[0], value: ethPrice}).then(function(v) {
						location.reload();	// 刷新商品信息
					})
					.catch(function(err) {
						err=>{console.warn(err)}
					});		
				});
			});

			// 取消购买
			$('.confirmation-cancel-btn').on("click", function(){ 
				$(".mask-div").css('display', 'none'); 
				$('.confirmation').css('display', 'none'); 
			});
			
		})
	});
}

window.AddProduct = function() {
	var name  = $("#product-name").val();
	var category = $("#product-category").val();
	var price = $("#product-price").val();
	var description = $("#product-description").val();

	if (name == "") {
		$("#address").html("Product Name can not be empty");
		return;
	} else if (price == "" ) {
		$("#address").html("Price can not be empty");
		return;
	} else if (description == "") {
		$("#address").html("Description can not be empty");
		return;
	}

	$("#address").html("");

	FleaMarket.deployed().then(function(contractInstance) {
		let ethPrice = web3.toWei(parseInt($("#product-price").val()), 'ether');
		contractInstance.addProduct(name, category, ethPrice, description, {from: web3.eth.accounts[0]}).then(function(v) {
			location.reload();
		})
		.catch(function(err) {
			err=>{console.warn(err)}
		});		
	});
}

$(document).ready(function() {
	if (typeof web3 !== 'undefined') {
		console.log("Using web3 detected from external source like Metamask")
		window.web3 = new Web3(web3.currentProvider);
	} else {
		console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
		window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
	}

	FleaMarket.setProvider(web3.currentProvider);
	// let candidateNames = Object.keys(candidates);

	let product_count = 0;
	FleaMarket.deployed().then(function(contractInstance) {
		contractInstance.getProductNum.call().then(function(v) {
				product_count = v;
				console.log("Number of Products : " + product_count.toString())
				for (var i = 1; i <= product_count; i++) {
					let realIndex = Number(i);
					console.log("Showing product " + i.toString())
					FleaMarket.deployed().then(function(contractInstance) {
						contractInstance.getProduct(realIndex).then(function(result) {
							console.log("    # result: " + result) // 1,IPhoneXS,cell phone,0,10000000000000000000,A New IPhone,1
							// let info = result.toString().split(",");

							// 解析商品状态
							var status = "";
							if (result[3] == 0) 
								status = '<span class="product_status_available">Available</span> <br>';
							else
								status = '<span class="product_status_sold">Sold</span> <br>';

							// 获取图片
							var imgUrl = require('../img/product.png'),
							imgTemp = '<img src="'+imgUrl+'" />';

							let pid = Number(result[0]);
							let price = result[4] / 1000000000000000000;
							let ethPrice = web3.toWei(price, 'ether');

							// 添加到商品列表
							let li = $('<li class = \'product_item\' onclick = "BuyProduct(' + pid +')"\
											<figure>\
												' + imgTemp + '\
												<figcaption>\
													<h3>' + result[1] + '</h3>\
													<span>' + result[2] +' </span> <br>\
													<span class="product_price">' + price +' ETH</span> <br>'
													+ status +
													'<hr>\
													<div class="product_description"> <strong>Description</strong><br>' + result[5] + '</div>\
												</figcaption>\
											</figure>\
										</li>'); 
							$('.product_list').append(li);

						})
					});
					console.log("End showing product " + i.toString())
				}
			}).catch(function(err) {
				err=>{console.warn(err)}
			});		
		});
});

