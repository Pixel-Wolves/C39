class Game{
    constructor(){
        
    }

    async start(){
        if(gameState === 0){
            player = new Player();
            var playerCountRef = await database.ref("PlayerCount").once("value");
            if(playerCountRef.exists()){
                playerCount = playerCountRef.val();
                player.getCount();
            }
            form = new Form();
            form.display();
        }

        car1 = createSprite(100,200);
        car1.addImage("Car1", car1_Img);

        car2 = createSprite(300,200);
        car2.addImage("Car2", car2_Img);

        car3 = createSprite(500,200);
        car3.addImage("Car3", car3_Img);
        
        car4 = createSprite(700,200);
        car4.addImage("Car4", car4_Img);

        cars = [car1,car2,car3,car4];
    }

    getState(){
        var gameStateRef = database.ref("gameState");
        gameStateRef.on("value", function(data){
            gameState = data.val();
        });
    }
    
    update(state){
        database.ref("/").update({
            gameState : state
        });
    }

    play(){
        form.hide();

        /*textSize(30);
        text("Game Start", 120, 100);*/
        Player.getPlayerInfo();

        if(allPlayers !== undefined){
            //var display_position = 130;
            
            background(rgb(198,135,103));
            image(track,0,-displayHeight*4,displayWidth,displayHeight*5);

            var index = 0;
            var x = 175;
            var y;

            for(var plr in allPlayers){
                // Adicionar 1 al index para cada loop
                index += 1;

                // Posición de los coches
                x += 200;

                // Usamos la base de datos para obtener la posición "y" de cada coche
                y = displayHeight-allPlayers[plr].distance;
                cars[index-1].x = x;
                cars[index-1].y = y;
                
                if(index === player.index){
                    cars[index-1].shapeColor = "red";
                    camera.position.x = displayWidth/2;
                    camera.position.y = cars[index-1].y;
                }

                /*textSize(15);
                text(allPlayers[plr].name + ":" + allPlayers[plr].distance, 120, display_position);*/
            }
        }

        if(keyIsDown(UP_ARROW) && player.index !== null){
            player.speed += 1;
            player.distance += player.speed;
            //player.distance += 10;
            player.update();
        }
        else{
            if(player.speed < 0.1){
                player.speed = 0;
            }

            player.distance += player.speed;
            player.update();
        }

        player.speed = player.speed * player.friction;

        if(player.distance > 3860){
            gameState = 2;
        }

        drawSprites();
    }

    end(){
        console.log("END!");
    }
}