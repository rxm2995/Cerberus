!function()
{
	function init()
	{
		//Setting up initial spans
		let arrayOfParagraphs = document.querySelectorAll("p");
		for(let i = 0; i < arrayOfParagraphs.length; i++)
		{
			arrayOfParagraphs[i].innerHTML = "<span>"+arrayOfParagraphs[i].innerHTML+"</span>";
		}

		//Background corruption
		let msUntilFullBackgroundChange = 30000;	//30sec
		let bgChangeFunctionInterval = 75;	//Function will be called once every 75 ms
		let elapsedTime = 0;	//Counter (measured in ms)
		let backgroundElement = document.querySelector("body");
		let bgChangeIntervalID = setInterval(function()
		{
			//Gradually turning background from #FFFFFF (255, 255, 255) to #E8D0A9 (232, 208, 169)
			elapsedTime += bgChangeFunctionInterval;
			//IMPORTANT: rgb values MUST be integers, otherwise style defaults to #FFFFFF.
			backgroundElement.style.backgroundColor = "rgb("+Math.round(255-23*elapsedTime/msUntilFullBackgroundChange)+", "+Math.round(255-47*elapsedTime/msUntilFullBackgroundChange)+", "+Math.round(255-86*elapsedTime/msUntilFullBackgroundChange)+")";
			if(elapsedTime >= msUntilFullBackgroundChange)
			{
				console.log("Full change completed");
				window.clearInterval(bgChangeIntervalID);
			}
		}, bgChangeFunctionInterval);

		//text corruption
		let textCorruptionInterval = 1000;
		let textCorruptionID = setInterval(function()
		{
			let elementList = document.querySelectorAll("span");
			let elementToModify = Math.floor(Math.random()*elementList.length);

			let randomDecider = Math.random()*100;
			if(randomDecider < 90)
			{
				//This is completely broken, but I left it because the bugs allow the code to leak into the webpage and turn the art into a sort of codework.
				//Don't fix this; it's better broken.
				let textToModify = elementList[elementToModify].innerHTML;
				randomDecider = Math.floor(Math.random()*textToModify.length);
				elementList[elementToModify].innerHTML = textToModify.substring(0, randomDecider)+'</span><span>'+textToModify.substring(randomDecider);
			}

			alterElement(elementList[elementToModify]);
		}, textCorruptionInterval);

		//load images
		var can = new Array(11);
		var ctx = new Array(11);
		var img = new Array(11);

		for (let i = 0; i < can.length; i++)
		{
			can[i] = document.getElementById("canvas"+i);
			ctx[i] = can[i].getContext('2d');
			img[i] = new Image();

			img[i].onload = function () {
				can[i].width = img[i].width;
				can[i].height = img[i].height;
				ctx[i].drawImage(img[i], 0, 0, img[i].width, img[i].height);
			};

			img[i].src = "img/"+i+".png";

		}

		//image corruption
		let imageCorruptionInterval = 1000;
		let imageCorruptionID = setInterval(function()
		{
			var index = Math.floor(Math.random()*ctx.length);
			corruptImage(can[index], ctx[index]);
		}, imageCorruptionInterval);

	}

	function alterElement(toAlter)
	{
		let randomDecider = Math.random()*100;
		if(randomDecider < 20)
		{
			//change color
			toAlter.style.color = "rgb("+(Math.floor(Math.random()*256))+", "+(Math.floor(Math.random()*256))+", "+(Math.floor(Math.random()*256))+")";
		}
		else if(randomDecider < 40)
		{
			//change font
			randomDecider = Math.floor(Math.random()*6);
			switch(randomDecider)
			{
				case 0:
					toAlter.style.fontFamily = "'Satisfy', cursive";
					break;
				case 1:
					toAlter.style.fontFamily = "'Allura', cursive";
					break;
				case 2:
					toAlter.style.fontFamily = "'Shadows Into Light', cursive";
					break;
				case 3:
					toAlter.style.fontFamily = "'Wingdings'";
					break;
				case 4:
					toAlter.style.fontFamily = "'Courier New'";
					break;
				case 5:
					toAlter.style.fontFamily = "'Akronim', cursive;";
					break;
			}
		}
		else if(randomDecider < 60)
		{
			//add newline or tab
			let lineText = toAlter.innerHTML;
			randomDecider = Math.floor(Math.random()*lineText.length);
			toAlter.innerHTML = lineText.substring(0, randomDecider)+(Math.floor(Math.random()*2) == 1 ? "<br />" : "&#09;")+lineText.substring(randomDecider);
		}
		else if(randomDecider < 80)
		{
			//Change alignment
			randomDecider = Math.floor(Math.random()*3);
			switch(randomDecider)
			{
				case 0:
					toAlter.style.textAlign = "center";
					break;
				case 1:
					toAlter.style.textAlign = "left";
					break;
				case 2:
					toAlter.style.textAlign = "right";
					break;
			}
		}
		else
		{
			//Change size - random value between 1% and 200%
			toAlter.style.fontSize = Math.floor(Math.random()*200+1)+"%";
		}
	}


		function corruptImage(can, ctx){

			//load data
			var imgData = ctx.getImageData(0, 0, can.width, can.height);
			var data = imgData.data;

			switch(Math.floor(Math.random() * 5)){
				default:
				case 0:
					//switch some pixels around
					var length = Math.floor(Math.random() * data.length * 0.1 + data.length * 0.01);
					length = length - (length % 4);
					var loc1 = Math.floor(Math.random() * (data.length - length));
					var loc2 = Math.floor(Math.random() * (data.length - length));
					loc1 = loc1 - (loc1 % 4);
					loc2 = loc2 - (loc2 % 4);
					var temp = new Array(length);
					for (var i = 0; i < length; i++){
						temp[i] = data[loc1+i];
						data[loc1+i] = data[loc2+i];
					}
					for (var i = 0; i < length; i++){
						data[loc2+i] = temp[i];
					}
				break;
				case 1:
					//warp some colors
					var length = Math.floor(Math.random() * data.length * 0.1 + data.length * 0.01);
					length = length - (length % 4);
					var loc1 = Math.floor(Math.random() * (data.length - length));
					for (var i = 0; i < length; i++){
						if (i % 4 != 3){
							data[i]+= Math.floor(Math.random() * 50);
							data[i] %= 255;
						}
					}
					break;
				case 2:
					// swap blocks of pixels
					var width = Math.floor(Math.random() * can.width);
					var height = Math.floor(Math.random() * can.height);
					var loc1X = Math.floor(Math.random() * (can.width - width));
					var loc2X = Math.floor(Math.random() * (can.width - width));
					var loc1Y = Math.floor(Math.random() * (can.height - height));
					var loc2Y = Math.floor(Math.random() * (can.height - height));

					var temp = new Array(height);
					for (var i = 0; i < height; i++){
						temp[i] = new Array(width * 4);
						for (var j = 0; j < temp[i].length; j++){
							temp[i][j] = data[((loc1Y + i) * can.width + loc1X) * 4 + j];
							data[((loc1Y + i) * can.width + loc1X) * 4 + j] = data[((loc2Y + i)* can.width + loc2X) * 4 + j];
						}
					}
					for (var i = 0; i < height; i++){
						for (var j = 0; j < temp[i].length; j++){
							data[((loc2Y + i) * can.width + loc2X) * 4 + j] = temp[i][j];
						}
					}

					break;
				case 3:

					// invert blocks
					var width = Math.floor(Math.random() * can.width * 0.5);
					var height = Math.floor(Math.random() * can.height * 0.5);
					var locX = Math.floor(Math.random() * (can.width - width));
					var locY = Math.floor(Math.random() * (can.height - height));

					for (var i = 0; i < height; i++){
						for (var j = 0; j < width; j++){
							var index = ((locY + i) * can.width + locX + j) * 4;
							data[index] = 255 - data[index];
							data[index + 1] = 255 - data[index + 1];
							data[index + 2] = 255 - data[index + 2];
						}
					}

					break;

				case 4:

					//random noise
					var width = Math.floor(Math.random() * can.width * 0.5);
					var height = Math.floor(Math.random() * can.height * 0.5);
					var locX = Math.floor(Math.random() * (can.width - width));
					var locY = Math.floor(Math.random() * (can.height - height));

					var n = Math.random() * data.length * 0.1;
					for (var i = 0; i < n; i++){
						var x = locX + Math.floor(Math.random() * width);
						var y = locY + Math.floor(Math.random() * height);
						var index = (y * can.width + x) * 4 + Math.floor(Math.random() * 5);
						data[index] = Math.floor(Math.random() * 255);
					}

					break;

			}

			//put data back
			ctx.putImageData(imgData, 0, 0);

		}

	window.onload = init;
}();
