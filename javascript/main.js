"use strict";

const CHRHEIGHT = 9;
const CHRWIDTH = 8;
const FONT = "12px monospace";
const FONTSTYLE = "#ffffff";
const HEIGHT = 120;//Virtual Screen Height
const WIDTH = 128;//Virtual Screen Width
const INTERVAL = 33;
const MAP_WIDTH = 32;
const MAP_HEIGHT = 32;
const SCR_HEIGHT = 8;
const SCR_WIDTH = 8;
const SCROLL = 1;
const SMOOTH = 0;
const START_HP = 20;
const STRAT_X = 15;
const STRAT_Y = 17;
const TILESIZE = 8;
const TILECOLUMN = 4;
const TILEROW = 4;
const WINDSTYLE = "rgba(0, 0, 0, 0.75)";

const gKey = new Uint8Array(0x100);

let gAngle = 0;
let gEx = 0;
let gHP = START_HP;
let gMHP = START_HP;
let gLv = 1;
let gCursor = 0;
let gEnemyHP;
let gEnemyType;
let gScreen;
let gFrame = 0;
let gWidth;
let gHeight;
let gMessage1 = null;
let gMessage2 = null;
let gMoveX = 0;
let gMoveY = 0;
let gOrder;
let gItem = 0;
let gPhase = 0; 
let gImgBoss;
let gImgMap;
let gImgMonster;
let gImgPlayer;
let gPlayerX = STRAT_X * TILESIZE + TILESIZE/2;
let gPlayerY = STRAT_Y * TILESIZE + TILESIZE/2;

const gFileBoss = "img/boss.png";
const gFileMap = "img/map.png";
const gFileMonster = "img/monster.png";
const gFilePlayer = "img/player.png";

const gEncounter = [0, 0, 0, 1, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0];

const gMonsterName = ["スライム", "うさぎ", "ナイト", "ドラゴン", "魔王"];

const gMap = [
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 7, 7, 7, 7, 7, 7, 7, 7, 7, 6, 6, 3, 6, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 3, 6, 6, 7, 7, 7, 2, 2, 2, 7, 7, 7, 7, 7, 7, 7, 6, 3, 0, 0, 0, 3, 3, 0, 6, 6, 6, 0, 0, 0,
  0, 0, 3, 3, 6, 6, 6, 7, 7, 2, 2, 2, 7, 7, 2, 2, 2, 7, 7, 6, 3, 3, 3, 6, 6, 3, 6,13, 6, 0, 0, 0,
  0, 3, 3,10,11, 3, 3, 6, 7, 7, 2, 2, 2, 2, 2, 2, 1, 1, 7, 6, 6, 6, 6, 6, 3, 0, 6, 6, 6, 0, 0, 0,
  0, 0, 3, 3, 3, 0, 3, 3, 3, 7, 7, 2, 2, 2, 2, 7, 7, 1, 1, 6, 6, 6, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 7, 7, 7, 2, 7, 6, 3, 1, 3, 6, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 7, 2, 7, 6, 3, 1, 3, 3, 6, 6, 3, 0, 0, 0, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 0, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 7, 7, 7, 6, 3, 1, 1, 3, 3, 6, 3, 3, 0, 3,12, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 7, 7, 6, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 6, 6, 6, 6, 3, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 6, 6, 3, 3, 3, 3, 1, 1, 3, 3, 3, 1, 1, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 4, 5, 3, 3, 3, 6, 6, 6, 3, 3, 3, 1, 1, 1, 1, 1, 3, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 8, 9, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 3, 3, 1, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 3, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 6, 3, 6, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 6, 3, 6, 6, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 6, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,14, 6, 0, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 7, 0, 0, 0, 0, 0, 0, 0, 0,
  7,15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 0, 0, 0, 0, 0,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7,
];

function Action() {
  gPhase++;
  
  if(((gPhase + gOrder) & 1) == 0){
    const  d = GetDamage(gEnemyType + 2);
    SetMessage(gMonsterName[gEnemyType] + "の攻撃!", d + " のダメージ!");
    gHP -= d;
    if(gHP <= 0) {
      gPhase = 7;
    }
    return;
  }

  if(gCursor == 0) {
    const d = GetDamage(gLv + 1);
    SetMessage("勇者の攻撃!", d + " のダメージ!");
    gEnemyHP -= d;
    if(gEnemyHP <= 0){
      gPhase = 5;
    }
    return;
  }
  if(Math.random() < 0.5){
    SetMessage("勇者は逃げ出した", null);
    gPhase = 6;
    return;
  }

  SetMessage("勇者は逃げ出した", "しかし回り込まれた！");
}

function AddExp(val) {
  gEx += val;
  while(gLv * (gLv + 1) * 2 <= gEx) {
    gLv++;
    gMHP += 4 + Math.floor(Math.random()*3);
  }
}

function AppearEnemy(t) {
  gPhase = 1;
  gEnemyHP = t * 3 + 5;
  gEnemyType = t;
  SetMessage("敵が現れた!", null);
}

function CommandFight() {
  gPhase = 2;
  gCursor = 0;
  SetMessage("　　　戦う", "　　　逃げる");
}

function DrawFight(ctx) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  if(gPhase <= 5) {
    if(IsBoss()){
      ctx.drawImage(gImgBoss, WIDTH/2 - gImgBoss.width/2, HEIGHT/2 - gImgBoss.height/2);
    } else {
      let w = gImgMonster.width / 4;
      let h = gImgMonster.height;
      ctx.drawImage(gImgMonster, gEnemyType * w, 0, w, h, Math.floor(WIDTH/2 - w / 2), Math.floor(HEIGHT/2 - h / 2), w, h);
    }
  }

  DrawStatus(ctx);
  DrawMessage(ctx);

  if(gPhase == 2){
    ctx.fillText("→", 6, 96 + 14 * gCursor);
  }
}

function DrawField(ctx) {
  let mx = Math.floor(gPlayerX / TILESIZE);
  let my = Math.floor(gPlayerY / TILESIZE);

  for (let dy = -SCR_HEIGHT; dy <= SCR_HEIGHT; dy++) {
    let ty = my + dy;
    let py = (ty + MAP_HEIGHT) % MAP_HEIGHT;
    for (let dx = -SCR_WIDTH; dx <= SCR_WIDTH; dx++) {
      let tx = mx + dx;
      let px = (tx + MAP_WIDTH) % MAP_WIDTH;
      DrawTile(ctx, 
        tx*TILESIZE + WIDTH/2 -gPlayerX, 
        ty*TILESIZE + HEIGHT/2 -gPlayerY, 
        gMap[py * MAP_WIDTH + px]);
    }
  }

  ctx.drawImage(gImgPlayer, 
      (gFrame >> 4 & 1) * CHRWIDTH, gAngle* CHRHEIGHT, CHRWIDTH, CHRHEIGHT, 
      WIDTH/2 - CHRWIDTH/2, HEIGHT/2 - CHRHEIGHT + TILESIZE/2, CHRWIDTH, CHRHEIGHT);

  ctx.fillStyle = WINDSTYLE;
  ctx.fillRect(2, 2, 44, 37);

  DrawStatus(ctx);
  DrawMessage(ctx);
}

function DrawMain() {
  const ctx = gScreen.getContext('2d');

  if(gPhase <= 1){
    DrawField(ctx);
  } else {
    DrawFight(ctx);
  }
  
  //Game Window
  // ctx.fillStyle = WINDSTYLE;
  // ctx.fillRect(20, 3, 105, 15);
  
  // ctx.font = FONT;
  // ctx.fillStyle = FONTSTYLE;
  // ctx.fillText("x= " + gPlayerX + " y= " + gPlayerY + " m= " + gMap[ my * MAP_WIDTH + mx], 25, 15);
}

function DrawMessage(ctx) {
  if(!gMessage1){
    return;
  }

  ctx.fillStyle = WINDSTYLE;
  ctx.fillRect(4, 84, 120, 30);

  ctx.font = FONT;
  ctx.fillStyle = FONTSTYLE;
  ctx.fillText(gMessage1, 6, 96);
  if(gMessage2){
    ctx.fillText(gMessage2, 6, 110);
  }
}

function DrawStatus(ctx) {
  ctx.font = FONT;
  ctx.fillStyle = FONTSTYLE;
  ctx.fillText("Lv ", 4, 13);
  DrawTextR(ctx, gLv, 42 , 13);
  ctx.fillText("HP ", 4, 25);
  DrawTextR(ctx, gHP, 42 , 25);
  ctx.fillText("Ex ", 4, 37);
  DrawTextR(ctx, gEx, 42 , 37);
}

function DrawTextR(ctx, str, x, y) {
  ctx.textAlign = "right";
  ctx.fillText(str, x, y);
  ctx.textAlign = "left";
}

function DrawTile(ctx, x, y, idx) {
  const ix = (idx % TILECOLUMN) * TILESIZE;
  const iy = Math.floor(idx / TILECOLUMN) * TILESIZE;
  ctx.drawImage(gImgMap, ix, iy, TILESIZE, TILESIZE, x, y, TILESIZE, TILESIZE);
}

function GetDamage(a) {
  return(Math.floor(a * (1 + Math.random())));
}

function IsBoss() {
  return(gEnemyType == gMonsterName.length - 1);
}

function LoadImage() {
  gImgBoss = new Image();
  gImgBoss.src = gFileBoss;

  gImgMap = new Image();
  gImgMap.src = gFileMap;

  gImgMonster = new Image();
  gImgMonster.src = gFileMonster;
  
  gImgPlayer = new Image();
  gImgPlayer.src = gFilePlayer;
}

function SetMessage(v1, v2) {
  gMessage1 = v1;
  gMessage2 = v2;
}

function Sign( val) {
  if(val == 0){
    return(0);
  }
  if(val < 0) {
    return(-1);
  }
  return(1);
}

function TickFiled() {
  if(gPhase != 0){
    return;
  }

  if(gMoveX != 0 || gMoveY != 0 || gMessage1){}
  else if(gKey[37]) { 
    gAngle=1; 
    gMoveX = -TILESIZE;
  }
  else if(gKey[38]) {
    gAngle=3; 
    gMoveY = -TILESIZE;
  }
  else if(gKey[39]) {
    gAngle=2; 
    gMoveX = TILESIZE;
  }
  else if(gKey[40]) {
    gAngle=0; 
    gMoveY = TILESIZE;
  }

  let mx = Math.floor((gPlayerX + gMoveX) / TILESIZE);
  let my = Math.floor((gPlayerY + gMoveY) / TILESIZE);
  mx += MAP_WIDTH;
  mx %= MAP_WIDTH;
  my += MAP_HEIGHT;
  my %= MAP_HEIGHT;
  let m = gMap[my * MAP_WIDTH + mx];
  if(m < 3) {
    gMoveX = 0;
    gMoveY = 0;
  }

  if(Math.abs(gMoveX) + Math.abs(gMoveY) == SCROLL){
    if(m == 8 || m == 9){
      gHP = gMHP;
      //TEXT(CASTLE)
      SetMessage("魔王を倒して！", null);
    }
  
    if(m == 10 || m == 11){
      gHP = gMHP;
      //TEXT(TOWN)
      SetMessage("東の果てにも", "村があります");
    }
  
    if(m == 12){
      gHP = gMHP;
      //TEXT(VILLAGE)
      SetMessage("カギは、", "洞窟にあります");
    }
  
    if(m == 13){
      gItem = 1;
      //TEXT(CAVE)
      SetMessage("カギを手に入れた", null);
    }
  
    if(m == 14){
      if(gItem == 0){
        //TEXT(DOOR)
        gPlayerY -= TILESIZE;
        SetMessage("カギが必要です", null);
      } else {
        SetMessage("扉が開いた", null);
      }
    }
  
    if(m == 15){
      //TEXT(DOOR)
      AppearEnemy(gMonsterName.length - 1);
    }

    if(Math.random() * 8 < gEncounter[m]) {
      let t = Math.abs(gPlayerX / TILESIZE - STRAT_X) +
              Math.abs(gPlayerY / TILESIZE - STRAT_Y);

      if(m == 6){
        t += 8;
      }
      if(m == 7){
        t += 16;
      }
      t += Math.random() * 8;
      t = Math.floor(t / 16);
      t = Math.min(t, gMonsterName.length-2);
      AppearEnemy(t);
    }
  }


  gPlayerX += Sign(gMoveX) * SCROLL;
  gPlayerY += Sign(gMoveY) * SCROLL;
  gMoveX -= Sign(gMoveX) * SCROLL;
  gMoveY -= Sign(gMoveY) * SCROLL;

  gPlayerX += (MAP_WIDTH * TILESIZE);
  gPlayerX %= (MAP_WIDTH * TILESIZE);
  gPlayerY += (MAP_HEIGHT * TILESIZE);
  gPlayerY %= (MAP_HEIGHT * TILESIZE);
}

function WmPaint() {
  DrawMain();

  const canvas = document.getElementById('main');
  const ctx = canvas.getContext('2d');

  ctx.drawImage(gScreen, 0, 0, gScreen.width, gScreen.height, 0, 0, gWidth, gHeight);
}

function WmSize() {
  const canvas = document.getElementById('main');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;  

  //Clear Screen 
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled = SMOOTH;

  gWidth = canvas.width;
  gHeight = canvas.height;

  if(gWidth / WIDTH < gHeight / HEIGHT) {
    gHeight = gWidth * HEIGHT / WIDTH;
  } else {
    gWidth = gHeight * WIDTH / HEIGHT;
  }
}

function WmTimer() {
  if( !gMessage1) {
    gFrame++;
    TickFiled();
  }
  WmPaint(); 
}

window.onkeydown = function(ev) {
  let c = ev.keyCode;

  if(gKey[c] != 0) {
    return;
  }
  gKey[c] = 1;

  if(gPhase == 1){
    CommandFight();
    return;
  }
  if(gPhase == 2) {
    if(c == 13 || c == 90) {//Press Enter or Z key
      gOrder = Math.floor(Math.random()*2);
      Action();
    } else {
      gCursor = 1 - gCursor;
    }
    return;
  }    
  if(gPhase == 3){
    Action();
    return;
  }
  if(gPhase == 4) {
    CommandFight();
    return;
  }
  if(gPhase == 5){
    gPhase = 6;
    AddExp(gEnemyType + 1);
    SetMessage("敵をやっつけた！", null);
    return;
  }
  if(gPhase == 6) {
    if(IsBoss() && gCursor == 0) {
      SetMessage("魔王を倒し", "世界に平和が訪れた");
      return;
    }
    gPhase = 0;
  }
  if(gPhase == 7){
    gPhase = 8;
    SetMessage("勇者は死亡した", null);
    return;
  }
  if(gPhase == 8){
    SetMessage("世界は滅びた...", null);
    return;
  }
  gMessage1 = null;
}

window.onkeyup = function (ev) {
  gKey[ev.keyCode] = 0;
}


window.onload = function() {
  LoadImage();

  //Create Virtual Screen
  gScreen = document.createElement("canvas");
  gScreen.width = WIDTH;
  gScreen.height = HEIGHT;

  WmSize();
  window.addEventListener('resize', function(){
    WmSize();
  });
  setInterval( function() {WmTimer()}, INTERVAL);
}
