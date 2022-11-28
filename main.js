song = "";

function preload()
{
	song = loadSound("music1.mp3");
    song = loadSound("music2.mp3");
}

scoreRightWrist = 0; /*O poseNet não apenas retorna as coordenadas x e y de 17 partes do corpo, mas também retorna
uma pontuação para cada parte do corpo, respectivamente. 

Pontuação significa a precisão de que uma parte do corpo foi detectada OU uma parte do corpo está
na frente da webcam. Então, sempre que uma pontuação for maior que 0.2, significa que a parte do
corpo foi detectada OU uma parte do corpo está na frente da webcam.
*/
scoreLeftWrist = 0;

rightWristX = 0;
rightWristY = 0;

leftWristX = 0;
leftWristY = 0;

function setup() {   //código para executar o posenet
	canvas =  createCanvas(600, 500);
	canvas.center();

	video = createCapture(VIDEO); //createCapture() é a função que ajuda a acessar a webcam
	/* Agora queremos que a visualização da webcam seja exibida na tela. 
	Mas no caso do p5.js, quando acessamos a webcam por padrão, ele cria outro componente para ele
e exibe a visualização da webcam na tela. Portanto, não precisaremos desse componente extra. Por
isso vamos ocultá-lo para a primeira atribuição.

Portanto, o código para ocultar o componente extra criado pelo p5.js para
visualização da webcam será video.hide()
*/
	video.hide();

	poseNet = ml5.poseNet(video, modelLoaded); // código para executar o posenet e obter os resultados
	poseNet.on('pose', gotPoses); // função on(), que é uma função predefinida de ml5.js usada para iniciar a execução do posenet
	/"gotPoses" que obterá todas as poses (coordenadas x e y das 17 partes)/
}

function modelLoaded() {
  console.log('PoseNet Is Initialized');
}

function gotPoses(results) // Parãmetro "Results" contém as coordenadas x e y de todas as 17 partes do corpo
{
  if(results.length > 0) /*   função gotPoses(), que irá verificar se o tamanho dos resultados é maior que 0, só então vai entrar 
  na condição “if”, isso significa: Se os resultados estiverem vazios então nada acontecerá.
*/  
  {
	console.log(results);
	scoreRightWrist =  results[0].pose.keypoints[10].score;
	scoreLeftWrist =  results[0].pose.keypoints[9].score;
	console.log("scoreRightWrist = " + scoreRightWrist + " scoreLeftWrist = " + scoreLeftWrist);
	
	rightWristX = results[0].pose.rightWrist.x; //Para obter as coordenadas de leftWrist, então dentro de results -> em índice 0-> em pose -> existe leftWrist.
	rightWristY = results[0].pose.rightWrist.y;
	console.log("rightWristX = " + rightWristX +" rightWristY = "+ rightWristY);

	leftWristX = results[0].pose.leftWrist.x;
	leftWristY = results[0].pose.leftWrist.y;
	console.log("leftWristX = " + leftWristX +" leftWristY = "+ leftWristY);
		
  }
}

function draw() {
	image(video, 0, 0, 600, 500);

	fill("violet");   // fill() é uma função p5.js usada para definir a cor
	stroke("violet");  //stroke() é uma função p5.js usada para definir a cor da borda

	if(scoreRightWrist > 0.2)
	{ 
		circle(rightWristX,rightWristY,20);

		if(rightWristY >0 && rightWristY <= 100)
		{
			document.getElementById("speed").innerHTML = "Velocidade = 0.5x";		
			song.rate(0.5);
		}
		else if(rightWristY >100 && rightWristY <= 200)
		{
			document.getElementById("speed").innerHTML = "Velocidade = 1x";		
			song.rate(1);
		}
		else if(rightWristY >200 && rightWristY <= 300)
		{
			document.getElementById("speed").innerHTML = "Velocidade = 1.5x";		
			song.rate(1.5);
		}
		else if(rightWristY >300 && rightWristY <= 400)
		{
			document.getElementById("speed").innerHTML = "Velocidade = 2x";		
			song.rate(2);
		}
		else if(rightWristY >400)
		{
			document.getElementById("speed").innerHTML = "Velocidade = 2.5x";		
			song.rate(2.5);
		}
	}

	if(scoreLeftWrist > 0.2)
	{
		circle(leftWristX,leftWristY,20);
		InNumberleftWristY = Number(leftWristY);/* Para converter a variável leftWrist em um número, usaremos a função JS predefinida 
		number()
		
		obtemos um valor exemplo de 400.345678765 do tipo number e armazenamos esse valor na variável InNumberleftWristY
		- a coordenada y de leftWrist tem muitos decimais

		● Não queremos muitos decimais após o cálculo. Portanto, precisamos remover todos os
decimais da coordenada y de leftWrist.

- A função floor() é uma função p5.js que é usada para remover todos os decimais e reduzir o valor

		*/
		remove_decimals = floor(InNumberleftWristY); //remove_decimals armazena a variável sem os decimais
		volume = remove_decimals/500;  // dividir as coordenadas y de leftWrist por 500(tamanho maximo da tela) nos ajudará a obter um valor entre 0 e 1 e deve ser armazenado em variavel volume. 
		document.getElementById("volume").innerHTML = "Volume = " + volume;		
		song.setVolume(volume);	//defina o volume do som de acordo com a variável volume
	}

}

function play()
{
	song.play();  // reproduzindo o áudio na função play().
	song.setVolume(1); // função setVolume() (função pré-definida) de p5.js para definir o volume da música.
	song.rate(1); //função rate(), que é uma função predefinida do p5.js para controlar a velocidade.

}