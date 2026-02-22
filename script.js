// ===== CONSTANTS =====
const COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#C3A6FF','#FBBF24'];
const FACES  = ['⚀','⚁','⚂','⚃','⚄','⚅'];

// 30マス構成: index 0=START, 1-28=イベント(28マス), 29=GOAL
const TOTAL = 30;
const GOAL  = 29;

// ===== SPIRAL LAYOUT (5列×6行グリッド) =====
//
//  グリッド可視化 (sq番号):
//    [00] [01] [02] [03] [04]
//    [17] [18] [19] [20] [05]
//    [16] [27] [28] [21] [06]
//    [15] [26] [29] [22] [07]
//    [14] [25] [24] [23] [08]
//    [13] [12] [11] [10] [09]
//
//  螺旋ルート: 外周 → 内周 → 中央(GOAL)
//    Ring1: sq0(START,左上)→右→下→左→上
//    Ring2: sq18→右→下→左→上
//    Center: sq28→sq29(GOAL,中央)
//
const SQUARE_POS = [
  // Ring 1 outer
  {r:1,c:1},{r:1,c:2},{r:1,c:3},{r:1,c:4},{r:1,c:5}, // sq0-4  上辺 →
  {r:2,c:5},{r:3,c:5},{r:4,c:5},{r:5,c:5},{r:6,c:5}, // sq5-9  右辺 ↓
  {r:6,c:4},{r:6,c:3},{r:6,c:2},{r:6,c:1},           // sq10-13 下辺 ←
  {r:5,c:1},{r:4,c:1},{r:3,c:1},{r:2,c:1},           // sq14-17 左辺 ↑
  // Ring 2 inner
  {r:2,c:2},{r:2,c:3},{r:2,c:4},                     // sq18-20 内上辺 →
  {r:3,c:4},{r:4,c:4},{r:5,c:4},                     // sq21-23 内右辺 ↓
  {r:5,c:3},{r:5,c:2},                               // sq24-25 内下辺 ←
  {r:4,c:2},{r:3,c:2},                               // sq26-27 内左辺 ↑
  // Center
  {r:3,c:3},                                         // sq28
  {r:4,c:3},                                         // sq29 GOAL（中央）
];

// 方向矢印: 次のマスへ向かう方向を示す
const SQUARE_DIR = [
  '→','→','→','→','↓',  // sq0-4   上辺(右端で折れる)
  '↓','↓','↓','↓','←',  // sq5-9   右辺(下端で折れる)
  '←','←','←','↑',      // sq10-13 下辺(左端で折れる)
  '↑','↑','↑','→',       // sq14-17 左辺(上端で内周へ)
  '→','→','↓',           // sq18-20 内上辺
  '↓','↓','←',           // sq21-23 内右辺
  '←','↑',               // sq24-25 内下辺
  '↑','→',               // sq26-27 内左辺
  '↓','',                // sq28-29 中央(GOALは矢印なし)
];

// ===== EVENT DATA =====
const DRINK = [
  {body:'今日一番テンション低かった瞬間を思い出しながら1杯！'},
  {body:'理由は特にないけど飲む。'},
  {body:'なんとなく雰囲気で1杯！'},
  {body:'人生に乾杯🥂'},
  {body:'今週頑張った自分へのご褒美1杯！'},
  {body:'飲まないと始まらないので1杯！'},
  {body:'空気を読んで1杯！'},
  {body:'運命なので飲む。'},
  {body:'今の気持ちを飲み込む1杯！'},
  {body:'沈黙を埋めるために1杯！'},
  {body:'なぜかわからないけど飲む。'},
  {body:'深く考えず飲む。'},
  {body:'宇宙の意志に従い1杯！'},
  {body:'まあ飲むしかないよね。'},
  {body:'気づいたら飲んでた。'},
  {body:'今日の自分の行動を反省しながら1杯！'},
  {body:'特に理由はないが飲む。以上。'},
  {body:'飲まなかった未来を想像して、やっぱり飲む。'},
  {body:'このマスに止まった時点で運命だった。'},
  {body:'人類の歴史に敬意を払い1杯！'},
  {body:'明日の自分に謝りながら1杯！'},
  {body:'ノリで1杯！'},
  {body:'なんか知らんけど1杯！'},
  {body:'酒の神様に選ばれました。1杯！'},
  {body:'飲まない理由が見当たらない。'},
  {body:'今夜一番飲みたそうな顔してたので1杯！'},
  {body:'このゲームを作った人への感謝を込めて1杯！'},
  {body:'言い訳せずに飲む。'},
  {body:'粛々と1杯。'},
  {body:'心を無にして飲む。'},
  {body:'推しが尊すぎた罰として1杯！'},
  {body:'スマホ見すぎた本日の反省として1杯！'},
  {body:'既読スルーしてた誰かへの詫びで1杯！'},
  {body:'今月クレカ使いすぎた罰として1杯！'},
  {body:'親に連絡返してなかった罪悪感で1杯！'},
];

const ALL_DRINK = [
  {body:'理由なし！全員飲め！これが飲みすごろく！'},
  {body:'今ここにいる全員に感謝して飲もう！乾杯🥂'},
  {body:'全員でシンクロして飲め！タイミングがズレた人はもう1杯！'},
];

// クイズデータ（問題 q、正解 a）
const QUIZ = [
  {q:'日本で一番高い山は？',                          a:'富士山（3,776m）'},
  {q:'ビールの主な原料は何？（4つ答えよ）',            a:'麦芽・ホップ・水・酵母'},
  {q:'サッカーワールドカップは何年に1度開催される？',   a:'4年に1度'},
  {q:'カルピスの原液を水で薄める推奨比率は？',          a:'1:4（原液1：水4）'},
  {q:'東京タワーの高さは何メートル？',                 a:'333m'},
  {q:'ウォッカの主な原産国はどこ？',                   a:'ロシア'},
  {q:'「乾杯」を英語で言うと？',                       a:'Cheers！（チアーズ）'},
  {q:'日本酒の主な原料は？（3つ）',                   a:'米・水・麹（こうじ）'},
  {q:'世界で最もビール消費量が多い国は？（2024年）',    a:'中国'},
  {q:'テキーラの原料となる植物の名前は？',              a:'アガベ（竜舌蘭）'},
  {q:'シャンパンはどこの国のどの地方のお酒？',          a:'フランス・シャンパーニュ地方'},
  {q:'ビールの度数は一般的に何%くらい？',              a:'約4〜6%'},
  {q:'「いただきます」を英語で言うと？',                a:'Enjoy your meal / Let\'s eat!'},
  {q:'マルガリータカクテルの主な材料を3つ答えよ',       a:'テキーラ・ライムジュース・トリプルセック'},
  {q:'日本でお酒が飲めるのは何歳から？',                a:'20歳以上（未成年飲酒は禁止！）'},
  {q:'世界で最も消費されている蒸留酒は？',              a:'バイジュー（白酒）— 中国のお酒'},
];

const GAME = [
  {body:'隣の人とじゃんけん！負けた方が飲む！あいこは両者飲む！'},
  {body:'全員で同時に好きな食べ物を言え！被った人全員が飲む！'},
  {body:'時計回りで1から数を数えよ。3の倍数で「飲む！」と叫べ。間違えた人が1杯！'},
  {body:'全員でグーチョキパーを同時に出せ。一人だけ違う手の人が飲む！'},
  {body:'全員で「乾杯！」と言え！声が一番小さかった人が飲む！'},
  {body:'今日一番テンション高かった人を全員で同時に指させ。最多得票の人が飲む！'},
  {body:'右隣の人に「ありがとう」か「ごめん」を選んで理由付きで言え。言えなかったら1杯！'},
  {body:'全員で好きな芸能人/推しを同時に言え！被ったペアは一緒に飲む！'},
  {body:'利き手と逆の手でコップを持って飲む！こぼしたらもう1杯！'},
  {body:'30秒間、全員でできるだけ真顔でいろ！笑ったり微笑んだりした人が1杯！'},
  {body:'スマホの写真フォルダを右から5枚目を全員に見せる。嫌なら飲む！'},
  {body:'隣の人と10秒以内に握手して相手の名前を呼び合え。失敗したら1杯！'},
  {body:'一番最近ドラマ・映画を見た人が飲む！'},
  {body:'左隣の人に本気の褒め言葉を言う。言えなかったら飲む！'},
  {body:'全員でスマホを裏向きに置く。最初に触った人が飲む！（次の人のターン終了まで）'},
];

const ADVANCE = [
  {body:'ラッキー！3マス進む！勢いよく行け！', steps:3},
  {body:'なぜか追い風！2マス進む！',           steps:2},
  {body:'飲みすごろくの神様が微笑んだ！3マス進む！', steps:3},
];

const RETREAT = [
  {body:'残念！2マス戻る！人生こんなもの。',               steps:2},
  {body:'なぜか向かい風…3マス戻る！戻り先でも1杯！',       steps:3},
  {body:'ドンマイ！2マス戻る。でもまだ勝負はわからない。', steps:2},
];

// 王様ゲームのお題
const KING = [
  '誰か1人を指名して「好きな人を告白する演技」をさせよ！断ったら2杯！',
  '全員に「王様（あなた）の好きなところ」を1つずつ言わせよ！',
  '誰か1人を指名して「1分間テンション高く喋り続けろ」と命じよ！途切れたら1杯！',
  '誰か2人に「罰ゲームじゃんけん」をさせよ！負けた方が1杯！',
  '全員に「今一番恥ずかしい最近の失敗」を一言ずつ言わせよ！言えなかった人は1杯！',
];

// ===== STATE =====
let G = {
  players:[], positions:[], cur:0,
  squares:[], rolling:false, over:false,
};
let modalCb    = null;
let modalMode  = 'normal'; // 'normal' | 'quiz-q' | 'quiz-a'
let quizAnswer = '';
let numPlayers = 3;

// ===== INIT =====
(function init(){
  document.querySelectorAll('.cnt-btn').forEach(b => {
    b.addEventListener('click', () => {
      numPlayers = +b.dataset.n;
      document.querySelectorAll('.cnt-btn').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      buildInputs();
    });
  });
  buildInputs();
})();

function buildInputs(){
  const container = document.getElementById('p-inputs');
  const saved = [...container.querySelectorAll('.p-input')].map(el => el.value);
  container.innerHTML = '';
  for(let i = 0; i < numPlayers; i++){
    container.innerHTML += `
      <div class="p-row">
        <div class="p-dot" style="background:${COLORS[i]}"></div>
        <input class="p-input" type="text" maxlength="8"
               placeholder="プレイヤー${i+1}" value="${saved[i] || ''}">
      </div>`;
  }
}

// ===== START GAME =====
function startGame(){
  const names = [...document.querySelectorAll('.p-input')]
    .map((el, i) => el.value.trim() || `プレイヤー${i+1}`);
  G.players   = names.map((name, i) => ({ name, color: COLORS[i] }));
  G.positions = new Array(names.length).fill(0);
  G.cur     = 0;
  G.rolling = false;
  G.over    = false;
  G.squares = makeSquares();

  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display  = 'flex';
  document.getElementById('dice').textContent = '🎲';
  document.getElementById('dice-num').textContent = '-';
  document.getElementById('dice-num').classList.remove('pop');

  renderBoard();
  renderBar();
  updateTurn();
}

// ===== MAKE SQUARES =====
// 配分:
//   endZone (sq24-28, 5マス): drink×2 + all_drink×1 + game×1 + death×1
//   pool (sq1-23, 23マス): drink×4 + all_drink×1 + quiz×5 + game×5
//                          + advance×2 + retreat×2
//                          + electric×1 + reversal×1 + king×1 + warp×1
//   合計 pool: 4+1+5+5+2+2+1+1+1+1 = 23 ✓
//   合計 drink: pool:4 + endZone:2 = 6 ✓
function makeSquares(){
  // ゴール前5マスを先に確保（endZone: sq24-28）
  const endZone = ['drink','drink','all_drink','game','death'];
  shuffle(endZone);

  // 残り23マス分のプール（sq1-23）
  const pool = [];
  for(let i = 0; i < 4; i++) pool.push('drink');     // 4 (endZone:2 と合計6)
  for(let i = 0; i < 1; i++) pool.push('all_drink'); // 1 (endZone:1 と合計2)
  for(let i = 0; i < 5; i++) pool.push('quiz');      // 5
  for(let i = 0; i < 5; i++) pool.push('game');      // 5 (endZone:1 と合計6)
  for(let i = 0; i < 2; i++) pool.push('advance');
  for(let i = 0; i < 2; i++) pool.push('retreat');
  pool.push('electric');
  pool.push('reversal');
  pool.push('king');
  pool.push('warp');
  shuffle(pool);

  // advance/retreat が隣接しないよう調整
  noAdjacentOf(pool, ['advance','retreat']);

  const sq = [{ type:'start', icon:'🏁' }];          // index 0  = START
  pool.forEach(t    => sq.push({ type:t, icon:typeIcon(t) })); // index 1-23
  endZone.forEach(t => sq.push({ type:t, icon:typeIcon(t) })); // index 24-28 ゴール前
  sq.push({ type:'goal', icon:'🏆' });               // index 29 = GOAL
  return sq;
}

// advance/retreat が連続しないよう並び替え
function noAdjacentOf(arr, types){
  const typeSet = new Set(types);
  for(let i = 0; i < arr.length - 1; i++){
    if(typeSet.has(arr[i]) && typeSet.has(arr[i+1])){
      for(let j = i + 2; j < arr.length; j++){
        if(!typeSet.has(arr[j])){
          [arr[i+1], arr[j]] = [arr[j], arr[i+1]];
          break;
        }
      }
    }
  }
}

function typeIcon(t){
  return {
    drink:'🍺', all_drink:'🥂', quiz:'❓',
    game:'🎲', advance:'⏩', retreat:'⏪',
    electric:'⚡', reversal:'🔄', king:'👑', warp:'🌀', death:'💀',
  }[t] || '？';
}

// ===== RENDER BOARD =====
function renderBoard(){
  const board = document.getElementById('board');
  board.innerHTML = '';

  SQUARE_POS.forEach((pos, idx) => {
    const sq  = G.squares[idx];
    const el  = document.createElement('div');
    const ezClass = (idx >= 24 && idx < GOAL) ? ' sq-endzone' : '';
    el.className = `sq sq-${sq.type}${ezClass}`;
    el.id = `sq${idx}`;
    el.style.gridColumn = pos.c;
    el.style.gridRow    = pos.r;

    const lbl = idx === 0 ? 'START' : idx === GOAL ? 'GOAL' : idx;
    const dir = SQUARE_DIR[idx];

    el.innerHTML = `
      <div class="sq-lbl">${lbl}</div>
      ${dir ? `<div class="sq-dir">${dir}</div>` : ''}
      <div class="sq-ico">${sq.icon}</div>
      <div class="sq-tokens" id="tk${idx}"></div>`;
    board.appendChild(el);
  });

  renderTokens();
}

// ===== RENDER TOKENS =====
function renderTokens(){
  document.querySelectorAll('.sq-tokens').forEach(el => el.innerHTML = '');
  document.querySelectorAll('.sq-cur-hl').forEach(el => el.classList.remove('sq-cur-hl'));

  G.players.forEach((p, i) => {
    const tk = document.getElementById(`tk${G.positions[i]}`);
    if(!tk) return;
    const d = document.createElement('div');
    d.className = `token${i === G.cur ? ' active-token' : ''}`;
    d.style.background = p.color;
    // グロー色をCSS変数として渡す
    d.style.setProperty('--tok-color', p.color);
    d.textContent = p.name[0];
    tk.appendChild(d);
  });

  // 現在プレイヤーのマスをゴールドパルスでハイライト
  const curSq = document.getElementById(`sq${G.positions[G.cur]}`);
  if(curSq) curSq.classList.add('sq-cur-hl');
}

// ===== RENDER PLAYER BAR =====
function renderBar(){
  const bar = document.getElementById('pbar');
  bar.innerHTML = '';
  G.players.forEach((p, i) => {
    const pos  = G.positions[i];
    const chip = document.createElement('div');
    chip.className = `pchip${i === G.cur ? ' cur' : ''}`;
    chip.id = `chip${i}`;
    chip.innerHTML = `
      <div class="pchip-dot" style="background:${p.color}"></div>
      <div class="pchip-name">${p.name}</div>
      <div class="pchip-pos">${pos === 0 ? 'スタート' : pos === GOAL ? '🏆GOAL' : pos + 'マス'}</div>`;
    bar.appendChild(chip);
  });
}

function updateTurn(){
  const p = G.players[G.cur];
  document.getElementById('turn-info').innerHTML =
    `<span class="turn-name">${p.name}</span> のターン`;
}

// ===== DICE =====
function rollDice(){
  if(G.rolling || G.over) return;
  G.rolling = true;
  const btn  = document.getElementById('roll-btn');
  const dice = document.getElementById('dice');
  const num  = document.getElementById('dice-num');
  btn.disabled = true;
  num.classList.remove('pop');
  num.textContent = '-';

  dice.classList.add('rolling');
  let count = 0;
  const iv = setInterval(() => {
    dice.textContent = FACES[rnd(6)];
    if(++count >= 14){
      clearInterval(iv);
      dice.classList.remove('rolling');
      const result = rnd(6) + 1;
      dice.textContent = FACES[result - 1];

      num.textContent = result;
      void num.offsetWidth;
      num.classList.add('pop');

      setTimeout(() => movePlayer(result), 500);
    }
  }, 55);
}

// ===== STEP-BY-STEP ANIMATION: 前進 (GOAL自動チェック付き) =====
function stepAnimate(pi, stepsLeft, cb){
  if(stepsLeft <= 0){ cb(); return; }
  const next = G.positions[pi] + 1;
  if(next > GOAL){ cb(); return; }
  G.positions[pi] = next;
  renderTokens(); renderBar();
  flashSquare(next);
  if(next >= GOAL){ setTimeout(() => showVictory(pi), 500); return; }
  setTimeout(() => stepAnimate(pi, stepsLeft - 1, cb), 270);
}

// ===== STEP-BY-STEP ANIMATION: 後退 =====
function stepAnimateBack(pi, stepsLeft, cb){
  if(stepsLeft <= 0){ cb(); return; }
  const prev = Math.max(G.positions[pi] - 1, 0);
  G.positions[pi] = prev;
  renderTokens(); renderBar();
  flashSquare(prev);
  setTimeout(() => stepAnimateBack(pi, stepsLeft - 1, cb), 270);
}

function flashSquare(idx){
  const el = document.getElementById(`sq${idx}`);
  if(!el) return;
  el.classList.remove('sq-step-flash');
  void el.offsetWidth;
  el.classList.add('sq-step-flash');
}

// 画面フラッシュエフェクト
function flashScreen(color){
  const flash = document.createElement('div');
  flash.className = 'screen-flash';
  flash.style.background = color;
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 700);
}

// ===== MOVE PLAYER =====
// ゴールをオーバーした場合は「超えた分だけ戻る」バウンスルール
function movePlayer(totalSteps){
  const pi       = G.cur;
  const startPos = G.positions[pi];
  const rawPos   = startPos + totalSteps;

  if(rawPos === GOAL){
    stepForward(pi, totalSteps, () => showVictory(pi));
  } else if(rawPos > GOAL){
    const stepsToGoal = GOAL - startPos;
    const stepsBack   = rawPos - GOAL;
    stepForward(pi, stepsToGoal, () => {
      setTimeout(() => {
        stepAnimateBack(pi, stepsBack, () => {
          doSquareEvent(G.positions[pi], pi);
        });
      }, 480);
    });
  } else {
    stepForward(pi, totalSteps, () => {
      doSquareEvent(G.positions[pi], pi);
    });
  }
}

// 1マスずつ前進（GOAL自動停止なし。呼び出し元が制御する）
function stepForward(pi, stepsLeft, cb){
  if(stepsLeft <= 0){ cb(); return; }
  G.positions[pi]++;
  renderTokens(); renderBar();
  flashSquare(G.positions[pi]);
  setTimeout(() => stepForward(pi, stepsLeft - 1, cb), 270);
}

// ===== SQUARE EVENTS =====
// chainDepth: advance/retreat/warp の連鎖深さ（無限ループ防止、最大3回）
function doSquareEvent(pos, pi, chainDepth = 0){
  const sq    = G.squares[pos];
  const pname = G.players[pi].name;

  switch(sq.type){
    case 'drink':{
      const e = pick(DRINK);
      showModal('🍺','飲むマス',`${pname}が飲む！`, e.body, '#ff4d4d', () => nextTurn());
      break;
    }
    case 'all_drink':{
      const e = pick(ALL_DRINK);
      showModal('🥂','全員飲むマス','全員で乾杯！🥂', e.body, '#ff8c42', () => nextTurn());
      break;
    }
    case 'quiz':{
      const e = pick(QUIZ);
      showQuizModal(e.q, e.a, pname, () => nextTurn());
      break;
    }
    case 'game':{
      const e = pick(GAME);
      showModal('🎲','ゲームマス','ミニゲーム！', e.body, '#9333ea', () => nextTurn());
      break;
    }
    case 'advance':{
      const e = pick(ADVANCE);
      showModal('⏩','ラッキーマス','チャンス！', e.body, '#22c55e', () => {
        stepAnimate(pi, e.steps, () => {
          if(G.positions[pi] >= GOAL) showVictory(pi);
          // 着地マスのイベントを発動（チェーン制限あり）
          else if(chainDepth < 3) doSquareEvent(G.positions[pi], pi, chainDepth + 1);
          else nextTurn();
        });
      });
      break;
    }
    case 'retreat':{
      const e = pick(RETREAT);
      showModal('⏪','アンラッキーマス','ガーン…', e.body, '#64748b', () => {
        stepAnimateBack(pi, e.steps, () => {
          // 着地マスのイベントを発動（チェーン制限あり）
          if(chainDepth < 3) doSquareEvent(G.positions[pi], pi, chainDepth + 1);
          else nextTurn();
        });
      });
      break;
    }

    // ===== 特殊マス =====
    case 'electric':{
      flashScreen('rgba(255,230,50,0.85)');
      showModal('⚡','電撃マス','ビリビリ⚡！！',
        '全員まとめて一気飲み！このマスに言い訳は通じない！',
        '#D97706', () => nextTurn());
      break;
    }
    case 'reversal':{
      const n = G.players.length;
      if(n < 2){
        showModal('🔄','逆転マス','効果なし…',
          'プレイヤーが1人なので逆転できなかった。', '#06B6D4', () => nextTurn());
      } else {
        const p1 = rnd(n);
        let p2;
        do { p2 = rnd(n); } while(p2 === p1);
        const tmp = G.positions[p1];
        G.positions[p1] = G.positions[p2];
        G.positions[p2] = tmp;
        renderTokens(); renderBar();
        showModal('🔄','逆転マス','まさかの位置交換！',
          `${G.players[p1].name} ↔ ${G.players[p2].name} の位置が入れ替わった！`,
          '#06B6D4', () => nextTurn());
      }
      break;
    }
    case 'king':{
      const cmd = pick(KING);
      showModal('👑','王様マス',`👑 ${pname}が王様！`, cmd, '#D97706', () => nextTurn());
      break;
    }
    case 'warp':{
      // ワープ先はwarpマス以外のランダムマス
      let dest;
      do { dest = 1 + rnd(GOAL - 1); } while(G.squares[dest].type === 'warp');
      showModal('🌀','ワープマス','吸い込まれた！',
        `${pname}が虚空に消えた… → ${dest}マス目へワープ！`,
        '#7C3AED', () => {
          G.positions[pi] = dest;
          renderTokens(); renderBar();
          flashSquare(dest);
          if(dest >= GOAL) showVictory(pi);
          else setTimeout(() => {
            if(chainDepth < 3) doSquareEvent(dest, pi, chainDepth + 1);
            else nextTurn();
          }, 400);
        });
      break;
    }
    case 'death':{
      showModal('💀','デスマス','即死…💀',
        `${pname}はスタートへ強制送還！罰として1杯必飲！`,
        '#111827', () => {
          flashScreen('rgba(0,0,0,0.92)');
          setTimeout(() => {
            G.positions[pi] = 0;
            renderTokens(); renderBar();
            flashSquare(0);
            setTimeout(() => {
              showModal('🍺','強制送還完了', `スタートに戻された${pname}！`,
                '罰として1杯！', '#ff4d4d', () => nextTurn());
            }, 400);
          }, 350);
        });
      break;
    }
    default: nextTurn();
  }
}

// ===== MODAL =====
function showModal(icon, type, title, body, color, cb){
  modalMode = 'normal';
  modalCb = cb;
  document.getElementById('m-icon').textContent  = icon;
  document.getElementById('m-type').textContent  = type;
  document.getElementById('m-title').textContent = title;
  document.getElementById('m-body').textContent  = body;
  document.getElementById('m-btn').style.background = color;
  document.getElementById('m-btn').textContent   = 'わかった！';
  document.getElementById('m-btn2').style.display = 'none';
  document.getElementById('m-answer').style.display = 'none';
  document.getElementById('modal').classList.add('show');
}

// クイズマス専用モーダル: 問題表示 → 正解表示 の2ステップ
function showQuizModal(q, a, pname, cb){
  modalMode  = 'quiz-q';
  modalCb    = cb;
  quizAnswer = a;
  document.getElementById('m-icon').textContent  = '❓';
  document.getElementById('m-type').textContent  = 'クイズマス';
  document.getElementById('m-title').textContent = `${pname}、みんなで考えよう！`;
  document.getElementById('m-body').textContent  = q;
  document.getElementById('m-btn').style.background = '#FAB005';
  document.getElementById('m-btn').textContent   = '答えを見る 👀';
  document.getElementById('m-btn2').style.display = 'none';
  document.getElementById('m-answer').style.display = 'none';
  document.getElementById('modal').classList.add('show');
}

// プライマリボタン（わかった！/ 答えを見る / 飲む！）のクリック処理
function modalBtnPrimary(){
  if(modalMode === 'quiz-q'){
    modalMode = 'quiz-a';
    document.getElementById('m-answer-text').textContent = quizAnswer;
    document.getElementById('m-answer').style.display = 'block';
    document.getElementById('m-btn').textContent = '飲む！🍺（間違えた人）';
    const btn2 = document.getElementById('m-btn2');
    btn2.textContent   = '全員セーフ 🙌';
    btn2.style.display = 'block';
  } else {
    closeModal();
  }
}

function closeModal(){
  document.getElementById('modal').classList.remove('show');
  document.getElementById('m-btn2').style.display  = 'none';
  document.getElementById('m-answer').style.display = 'none';
  modalMode = 'normal';
  const cb = modalCb;
  modalCb = null;
  if(cb) setTimeout(cb, 200);
}

// ===== NEXT TURN =====
function nextTurn(){
  G.cur = (G.cur + 1) % G.players.length;
  G.rolling = false;
  document.getElementById('roll-btn').disabled = false;
  document.getElementById('dice').textContent  = '🎲';
  renderBar(); updateTurn(); renderTokens();
}

// ===== VICTORY =====
function showVictory(wi){
  G.over = true;
  const winner = G.players[wi];
  const losers = G.players.filter((_, i) => i !== wi).map(p => p.name).join('・');
  document.getElementById('v-title').textContent = `🎉 ${winner.name} の勝ち！`;
  document.getElementById('v-sub').textContent   =
    losers ? `残りの ${losers} は全員罰杯！🍺` : 'おめでとう！';
  document.getElementById('victory').classList.add('show');
  confetti();
}

function confetti(){
  const colors = ['#FF6B35','#FFD700','#FF6B6B','#4ECDC4','#a29bfe','#55efc4','#fd79a8'];
  for(let i = 0; i < 80; i++){
    setTimeout(() => {
      const el   = document.createElement('div');
      el.className = 'confetti';
      const size = 4 + Math.random() * 10;
      el.style.cssText = `
        left:${Math.random()*100}vw;top:-${size}px;
        width:${size}px;height:${size}px;
        background:${colors[rnd(colors.length)]};
        border-radius:${Math.random() > .5 ? '50%' : '2px'};
        animation-duration:${2 + Math.random()*2.5}s;
        animation-delay:${Math.random()*.8}s;opacity:1;`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }, i * 25);
  }
}

// ===== RESET =====
function resetGame(){
  document.getElementById('victory').classList.remove('show');
  document.getElementById('game').style.display  = 'none';
  document.getElementById('setup').style.display = 'flex';
}

// ===== UTILS =====
function rnd(n){ return Math.floor(Math.random() * n); }
function pick(arr){ return arr[rnd(arr.length)]; }
function shuffle(a){
  for(let i = a.length - 1; i > 0; i--){
    const j = rnd(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
}
