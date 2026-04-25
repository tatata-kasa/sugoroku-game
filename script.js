// ===== CONSTANTS =====
const COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#FFA07A','#C3A6FF','#FBBF24'];
const FACES  = ['⚀','⚁','⚂','⚃','⚄','⚅'];

// 25マス構成: index 0=START, 1-23=イベント(23マス), 24=GOAL
const TOTAL = 25;
const GOAL  = 24;

// ===== SPIRAL LAYOUT (5列×5行グリッド) =====
//
//  グリッド可視化 (sq番号):
//    [00] [01] [02] [03] [04]
//    [15] [16] [17] [18] [05]
//    [14] [23] [24] [19] [06]
//    [13] [22] [21] [20] [07]
//    [12] [11] [10] [09] [08]
//
//  螺旋ルート: 外周 → 内周 → 中央(GOAL)
//    Ring1: sq0(START,左上)→右→下→左→上
//    Ring2: sq16→右→下→左→上
//    Center: sq24(GOAL,中央)
//
const SQUARE_POS = [
  // Ring 1 outer
  {r:1,c:1},{r:1,c:2},{r:1,c:3},{r:1,c:4},{r:1,c:5}, // sq0-4  上辺 →
  {r:2,c:5},{r:3,c:5},{r:4,c:5},{r:5,c:5},           // sq5-8  右辺 ↓
  {r:5,c:4},{r:5,c:3},{r:5,c:2},{r:5,c:1},           // sq9-12 下辺 ←
  {r:4,c:1},{r:3,c:1},{r:2,c:1},                     // sq13-15 左辺 ↑
  // Ring 2 inner
  {r:2,c:2},{r:2,c:3},{r:2,c:4},                     // sq16-18 内上辺 →
  {r:3,c:4},{r:4,c:4},                               // sq19-20 内右辺 ↓
  {r:4,c:3},{r:4,c:2},                               // sq21-22 内下辺 ←
  {r:3,c:2},                                         // sq23   内左辺 ↑
  // Center
  {r:3,c:3},                                         // sq24 GOAL（中央）
];

// 方向矢印: 次のマスへ向かう方向を示す
const SQUARE_DIR = [
  '→','→','→','→','↓',    // sq0-4   上辺(右端で折れる)
  '↓','↓','↓','←',        // sq5-8   右辺(下端で折れる)
  '←','←','←','↑',        // sq9-12  下辺(左端で折れる)
  '↑','↑','→',            // sq13-15 左辺(上端で内周へ)
  '→','→','↓',            // sq16-18 内上辺
  '↓','←',               // sq19-20 内右辺
  '←','↑',               // sq21-22 内下辺
  '→','',                 // sq23-24 中央へ(GOALは矢印なし)
];

// ===== EVENT DATA =====
const DRINK = [
  {body:'理由は特にないけど飲む。'},
  {body:'なんとなく雰囲気で1杯！'},
  {body:'人生に乾杯🥂'},
  {body:'今週頑張った自分へのご褒美1杯！'},
  {body:'飲まないと始まらないので1杯！'},
  {body:'運命なので飲む。'},
  {body:'今の気持ちを飲み込む1杯！'},
  {body:'なぜかわからないけど飲む。'},
  {body:'深く考えず飲む。'},
  {body:'宇宙の意志に従い1杯！'},
  {body:'まあ飲むしかないよね。'},
  {body:'気づいたら飲んでた。'},
  {body:'特に理由はないが飲む。以上。'},
  {body:'飲まなかった未来を想像して、やっぱり飲む。'},
  {body:'このマスに止まった時点で運命だった。'},
  {body:'人類の歴史に敬意を払い1杯！'},
  {body:'ノリで1杯！'},
  {body:'なんか知らんけど1杯！'},
  {body:'酒の神様に選ばれました。1杯！'},
  {body:'飲まない理由が見当たらない。'},
  {body:'一番飲みたそうな顔してたので1杯！'},
  {body:'このゲームを作った人への感謝を込めて1杯！'},
  {body:'言い訳せずに飲む。'},
  {body:'粛々と1杯。'},
];

const ALL_DRINK = [
  {body:'理由なし！全員飲め！これが飲みすごろく！'},
  {body:'今ここにいる全員に感謝して飲もう！乾杯🥂'},
  {body:'全員でシンクロして飲め！タイミングがズレた人はもう1杯！'},
  {body:'「かんぱーい！」と全員で叫んでから飲む！声が小さい人はもう1杯！'},
  {body:'全員で立ち上がって飲む！最後まで立ってた人は勝者として別に1杯！'},
  {body:'テーブルを3回叩いてから「ドン！ドン！ドン！かんぱーい！」！'},
  {body:'全員で目を閉じたまま飲む！こぼした人は追加1杯！'},
  {body:'隣の人と乾杯してから飲む！グラスが当たらなかった人は飲み直し！'},
  {body:'全員で「今日ここに来てよかった！」と叫んでから飲む！'},
  {body:'今夜一番テンションが上がった瞬間を全員同時に叫んでから飲む！'},
  {body:'全員で好きな飲み物の名前を同時に言え！被った人たちはもう1杯！'},
  {body:'乾杯の掛け声を外国語で言え！全員成功したら1杯、失敗者は2杯！'},
  {body:'全員でグラスを天高く掲げてから飲む！一番高く上げた人だけセーフ！他は1杯追加！'},
  {body:'「飲みすごろく最高！」と全員で合唱してから飲む！'},
  {body:'全員で今夜の一言を一斉に言え！最高の一言を言った人は飲まなくていい！他は飲む！'},
  {body:'全員で左隣の人を褒めてから飲む！褒め言葉が被った人はもう1杯！'},
];

// クイズデータ（将来また使う可能性あり、現在はコメントアウト中）
/*
const QUIZ = [
  // ── お酒・飲み物 ──
  {q:'ビールの主な原料を4つ答えよ',                         a:'麦芽・ホップ・水・酵母'},
  {q:'日本酒の主な原料は？（3つ）',                         a:'米・水・麹（こうじ）'},
  {q:'テキーラの原料となる植物の名前は？',                   a:'アガベ（竜舌蘭）'},
  {q:'シャンパンはどこの国のどの地方のお酒？',               a:'フランス・シャンパーニュ地方'},
  {q:'ウォッカの主な原産国はどこ？',                         a:'ロシア'},
  {q:'マルガリータカクテルの主な材料を3つ答えよ',             a:'テキーラ・ライムジュース・トリプルセック'},
  {q:'カルピスの原液を水で薄める推奨比率は？',               a:'1:4（原液1：水4）'},
  {q:'世界で最もビール消費量が多い国は？（2024年）',          a:'中国'},
  {q:'ハイボールは何と何を混ぜたもの？',                     a:'ウイスキー＋炭酸水'},
  {q:'ワインの主な原料は？',                                a:'ぶどう'},
  {q:'「角」と言えば何のブランドのウイスキー？',              a:'サントリー（角瓶）'},
  {q:'ビールの度数は一般的に何%くらい？',                    a:'約4〜6%'},
  {q:'世界で最も消費されている蒸留酒は？',                   a:'バイジュー（白酒）— 中国のお酒'},
  {q:'「乾杯」を英語・フランス語・ドイツ語それぞれで言うと？', a:'Cheers / Santé（サンテ）/ Prost（プロースト）'},
  {q:'ビールの泡の役割を1つ答えよ',                         a:'香りを閉じ込める・酸化防止・口当たりまろやか など'},
  // ── 日本・一般常識 ──
  {q:'日本で一番高い山は？',                                a:'富士山（3,776m）'},
  {q:'東京タワーの高さは何メートル？',                       a:'333m'},
  {q:'東京の旧名は？',                                     a:'江戸（えど）'},
  {q:'日本でお酒が飲めるのは何歳から？',                     a:'20歳以上（未成年飲酒禁止！）'},
  {q:'日本の国旗は何色と何色？',                            a:'白と赤'},
  {q:'日本のコンビニは全国に何万店くらい？（2024年）',        a:'約5万5千店'},
  {q:'「ありがとう」の語源の意味は？',                       a:'有り難い（めったにない）という意味'},
  {q:'人間の体で最も大きな臓器は？',                        a:'皮膚（肝臓と答えがち！）'},
  {q:'光の速さは秒速何km？',                                a:'約30万km（299,792km）'},
  {q:'日本で不吉とされる数字は？（2つ）',                    a:'4（し＝死）と9（く＝苦）'},
  // ── 食べ物 ──
  {q:'チーズの主な原料は？',                                a:'牛乳'},
  {q:'カレーはもともとどの国の料理？',                       a:'インド'},
  {q:'味噌の原料を答えよ',                                  a:'大豆・塩・麹'},
  {q:'コーラを最初に作った国は？',                          a:'アメリカ'},
  {q:'ラーメンの語源はどの言語から？',                       a:'中国語の拉麺（ラーミエン）'},
  // ── スポーツ ──
  {q:'サッカーワールドカップは何年に1度？',                   a:'4年に1度'},
  {q:'サッカーの1チームのフィールドプレイヤー数は？',          a:'11人（GK含む）'},
  {q:'オリンピックの五輪の5色をすべて答えよ',                a:'青・黄・黒・緑・赤（白地含め5色）'},
  {q:'バスケットボールのゴールの高さは？',                   a:'3.05m（10フィート）'},
  // ── エンタメ ──
  {q:'世界で一番売れたゲームソフトは？（2024年）',            a:'マインクラフト（約2.4億本以上）'},
  {q:'「ONE PIECE」の主人公は？',                           a:'モンキー・D・ルフィ'},
  {q:'ドラゴンボールの主人公は？',                          a:'孫悟空（そんごくう）'},
  // ── ちょっと難しめ ──
  {q:'じゃんけんで「グー」を3回連続で出す確率は？',           a:'1/27（約3.7%）'},
  {q:'「いただきます」を英語で言うと？',                     a:'Enjoy your meal / Let\'s eat!'},
  {q:'円周率πを小数点2位まで答えよ',                        a:'3.14'},
];
*/

const GAME = [
  // ── じゃんけん系 ──
  {body:'隣の人とじゃんけん！負けた方が飲む！あいこは両者飲む！'},
  {body:'全員でじゃんけん！最後まで残った1人だけセーフ！他は全員飲む！'},
  {body:'隣の人とあっち向いてホイ！負けた人が飲む！'},
  {body:'全員でじゃんけん！グーを出した人全員が飲む！誰も出さなかったらやり直し！'},
  {body:'時計回りでじゃんけんリレー！最初に負けた人が飲む！'},
  // ── 同時宣言系 ──
  {body:'全員で同時に好きな食べ物を言え！被った人が飲む！'},
  {body:'全員で同時に好きな季節を言え！（春夏秋冬）一人だけ違う季節の人が飲む！'},
  {body:'全員で同時に好きな芸能人・推しを言え！被ったペアは一緒に乾杯！'},
  {body:'全員で同時に「今一番食べたいもの」を言え！被った人が飲む！'},
  {body:'全員で今の気分を天気で言え！（晴れ/曇り/雨/嵐）一番暗い天気の人が飲む！'},
  {body:'全員で「1」か「2」を同時に言え！少数派が飲む！（同数ならじゃんけんで決定）'},
  {body:'全員で同時に好きな動物を言え！被ったペアは一緒に飲む！'},
  {body:'全員で「赤い食べ物」を同時に言え！被った人が飲む！誰も被らなかったら全員セーフ！'},
  {body:'全員で今日の気分を色で表せ！同じ色が出たペアは一緒に飲む！'},
  // ── 指・ジェスチャー系 ──
  {body:'全員でグーチョキパーを同時に出せ！一人だけ違う手を出した人が飲む！'},
  {body:'全員で0〜5本の指を同時に出せ！合計が奇数なら最多、偶数なら最少を出した人が飲む！'},
  {body:'全員で指1本〜10本を同時に出せ！合計がピッタリ25なら全員セーフ！それ以外は最も遠い人が飲む！'},
  {body:'隣の人と指相撲！負けた人が飲む！両者10秒以内に勝負がつかなかったら両者飲む！'},
  // ── スマホ系 ──
  {body:'今すぐスマホのバッテリー残量を全員に見せろ！一番少ない人が1杯！'},
  {body:'今一番最後に送受信したLINEのスタンプを見せろ！一番シュールなスタンプを送った人が飲む！'},
  {body:'スマホの写真フォルダの一番最新の写真を見せろ！一番地味な写真の人が飲む！'},
  // ── 身体・アクション系 ──
  {body:'全員でグラスを同時に持ち上げて乾杯！最後に上げた人が飲む！'},
  {body:'早口言葉「生麦生米生卵」を3回！噛んだら飲む！（時計回りで全員挑戦）'},
  {body:'利き手と逆の手でコップを持って飲む！こぼしたらもう1杯！'},
  {body:'全員で目を閉じ、5秒後に目を開けろ！最初に目を開けた人が飲む！'},
  {body:'全員でテーブルの上に手を置き、せーので1本ずつ指を立てろ！最後の1本になった人が飲む！'},
  // ── お題・あるある系 ──
  {body:'今日一番テンション高かった人を全員で同時に指させ！最多得票の人が飲む！'},
  {body:'一番最近ドラマ・映画・アニメを見た人が飲む！'},
  {body:'右隣の人に「ありがとう」か「ごめん」を選んで理由付きで言え！言えなかったら1杯！'},
  {body:'「今日ここに来る前にしてたこと」を全員で同時に言え！一番地味なことをしてた人が飲む！'},
  // ── 連想・ワード系 ──
  {body:'「飲み」から始まる言葉リレー！詰まった人が飲む！（例：飲み会→会社→社長→…）'},
  {body:'お酒の種類を時計回りに1つずつ言え！詰まった人または被った人が飲む！'},
  {body:'全員で「今一番言いたいひと言」を紙に書いて同時に見せ合え！被ったペアは一緒に乾杯！'},
  {body:'全員でNGワードを1つ決めろ！次の1分間そのワードを言った人が飲む！'},
  // ── 推理・読み合い系 ──
  {body:'「今日このメンバーで一番先に帰りそうな人」を全員同時に指させ！最多得票の人が飲む！'},
  {body:'「このメンバーで一番お酒が強そうな人」を全員同時に指させ！最多得票の人が飲む！'},
  {body:'「このメンバーで一番モテそうな人」を全員同時に指させ！最多得票の人はセーフ！他は飲む！'},
  {body:'「一番最近告白された人」は正直に申告せよ！嘘ついたと疑われたら飲む！'},
  // ── 数当て系 ──
  {body:'全員で1〜10の数字を頭の中で思い浮かべろ！進行役が「せーの」で全員が言え！被ったペアは飲む！'},
  {body:'このマスに止まった人がサイコロの目を当てろ！外れたら飲む！当たったら全員飲む！'},
  // ── 罰ゲーム決め系 ──
  {body:'全員でじゃんけん！負けた人は「今夜のヒーロー」として次の飲みドリンクを全員分注いで回せ！'},
  {body:'全員で隣の人の「今日の良かったところ」を1つ言え！30秒以内に言えなかった人が飲む！'},
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

// ===== 特殊カード =====
const CARDS = [
  { id:'skip',     icon:'🛡️', name:'イベント無効',  desc:'今回着地したマスのイベントをスキップ！飲まなくてOK！' },
  { id:'transfer', icon:'👉', name:'飲む転嫁',      desc:'今回「飲む」マスに止まっても、右隣のプレイヤーが代わりに飲む！' },
  { id:'bonus',    icon:'⏩', name:'ダイス+2',      desc:'今回のサイコロの目に+2マスのボーナス！' },
  { id:'roll2',    icon:'🎲🎲', name:'2択ロール',  desc:'サイコロを2回振って、大きい方の目を使用！' },
  { id:'party',    icon:'🥂', name:'強制乾杯',      desc:'自分以外の全員が今すぐ1杯飲む！即時発動！' },
  { id:'nominate', icon:'🎯', name:'指名飲み',      desc:'好きなプレイヤーを1人指名して1杯飲ませる！即時発動！' },
];

// ===== STATE =====
let G = {
  players:[], positions:[], cur:0,
  squares:[], rolling:false, over:false,
};
let modalCb    = null;
let modalMode      = 'normal'; // 'normal' | 'quiz-q' | 'quiz-a' | 'drink-select'
let quizAnswer     = '';
let drinkSelectCb  = null;
let numPlayers     = 3;

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

  // 画面回転・モバイルUIの表示/非表示でSVGルート矢印を再描画
  let _rsvgTimer = null;
  function redrawRouteOnResize(){
    clearTimeout(_rsvgTimer);
    _rsvgTimer = setTimeout(() => {
      if(!G.over && document.getElementById('game').style.display !== 'none'){
        requestAnimationFrame(() => renderRouteSVG(G.positions[G.cur]));
      }
    }, 120);
  }
  window.addEventListener('resize', redrawRouteOnResize);
  // iOS Safari はvisualViewportのresizeが信頼性高い
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize', redrawRouteOnResize);
  }
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
  G.drinks  = new Array(names.length).fill(0);
  G.cur     = 0;
  G.rolling    = false;
  G.over       = false;
  G.cardUsed   = new Array(names.length).fill(false);
  G.cardEffect = null;
  G.squares    = makeSquares();

  document.getElementById('setup').style.display = 'none';
  document.getElementById('game').style.display  = 'flex';
  document.getElementById('dice').textContent = '🎲';
  document.getElementById('dice-num').textContent = '-';
  document.getElementById('dice-num').classList.remove('pop');
  document.getElementById('dice').textContent = '🎲';

  renderBoard();
  renderBar();
  updateTurn();
}

// ===== MAKE SQUARES =====
// 配分:
//   endZone (sq21-23, 3マス): drink×1 + all_drink×1 + death×1
//   pool (sq1-20, 20マス): drink×3 + all_drink×1 + game×11
//                          + advance×2 + retreat×1 + king×1 + warp×1
//   合計 pool: 3+1+11+2+1+1+1 = 20 ✓  （quizは現在無効化中）
function makeSquares(){
  // ゴール前3マスを先に確保（endZone: sq21-23）
  const endZone = ['drink','all_drink','death'];
  shuffle(endZone);

  // 残り20マス分のプール（sq1-20）
  const pool = [];
  for(let i = 0; i < 3; i++) pool.push('drink');
  for(let i = 0; i < 1; i++) pool.push('all_drink');
  // for(let i = 0; i < 5; i++) pool.push('quiz'); // クイズ一時無効化中
  for(let i = 0; i < 11; i++) pool.push('game'); // quizの5枠分をgameに振替
  for(let i = 0; i < 2; i++) pool.push('advance');
  for(let i = 0; i < 1; i++) pool.push('retreat');
  pool.push('king');
  pool.push('warp');
  shuffle(pool);

  // advance/retreat が隣接しないよう調整
  noAdjacentOf(pool, ['advance','retreat']);

  const sq = [{ type:'start', icon:'🏁' }];          // index 0  = START
  pool.forEach(t    => sq.push({ type:t, icon:typeIcon(t) })); // index 1-20
  endZone.forEach(t => sq.push({ type:t, icon:typeIcon(t) })); // index 21-23 ゴール前
  sq.push({ type:'goal', icon:'🏆' });               // index 24 = GOAL
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
    const ezClass = (idx >= 21 && idx < GOAL) ? ' sq-endzone' : '';
    el.className = `sq sq-${sq.type}${ezClass}`;
    el.id = `sq${idx}`;
    el.style.gridColumn = pos.c;
    el.style.gridRow    = pos.r;

    const lbl = idx === 0 ? 'START' : idx === GOAL ? 'GOAL' : idx;

    el.innerHTML = `
      <div class="sq-lbl">${lbl}</div>
      <div class="sq-ico">${sq.icon}</div>
      <div class="sq-tokens" id="tk${idx}"></div>`;
    board.appendChild(el);
  });

  renderTokens();
  // レイアウト確定後にSVGルートを描画（double RAF でCSSグリッド計算の完了を待つ）
  requestAnimationFrame(() => requestAnimationFrame(() => renderRouteSVG()));
}

// ===== SVG ルート線 & 矢印 =====
// curPos: 現在プレイヤーの位置（省略時=-1で全区間を等しく描画）
// curPos以降を明るいゴールド、通過済みをダークグレーで描画
function renderRouteSVG(curPos = -1){
  const board = document.getElementById('board');
  const existing = document.getElementById('route-svg');
  if(existing) existing.remove();

  const boardRect = board.getBoundingClientRect();
  if(boardRect.width === 0) return;

  // SVGは position:absolute;inset:0 なので padding-edge(=border内側)が原点
  // getBoundingClientRect は border-edge を返すため border幅を引いて補正する
  const bs = getComputedStyle(board);
  const bLeft = parseFloat(bs.borderLeftWidth) || 0;
  const bTop  = parseFloat(bs.borderTopWidth)  || 0;

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.id = 'route-svg';
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;overflow:visible;';

  // 各マスの中心座標（ボード内部・SVG座標系）
  const pts = [];
  for(let i = 0; i < TOTAL; i++){
    const el = document.getElementById(`sq${i}`);
    if(!el){ pts.push(null); continue; }
    const r = el.getBoundingClientRect();
    pts.push({
      x: r.left - boardRect.left - bLeft + r.width  / 2,
      y: r.top  - boardRect.top  - bTop  + r.height / 2,
    });
  }

  for(let i = 0; i < TOTAL - 1; i++){
    const a = pts[i], b = pts[i + 1];
    if(!a || !b) continue;

    // 通過済み区間: curPos > 0 && i < curPos
    const isPast = curPos > 0 && i < curPos;
    // 次の1区間（最も強調）: i === curPos
    const isNext = i === curPos;

    if(isPast){
      // 通過済み: 暗く細い線のみ（矢印なし）
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', a.x.toFixed(1));
      line.setAttribute('y1', a.y.toFixed(1));
      line.setAttribute('x2', b.x.toFixed(1));
      line.setAttribute('y2', b.y.toFixed(1));
      line.setAttribute('stroke', 'rgba(60,45,15,0.45)');
      line.setAttribute('stroke-width', '1.5');
      line.setAttribute('stroke-linecap', 'round');
      svg.appendChild(line);
      continue;
    }

    // ① グロー線（アンバー）
    const glowW = isNext ? 18 : 12;
    const glowOp = isNext ? '0.42' : '0.28';
    const glow = document.createElementNS(NS, 'line');
    glow.setAttribute('x1', a.x.toFixed(1));
    glow.setAttribute('y1', a.y.toFixed(1));
    glow.setAttribute('x2', b.x.toFixed(1));
    glow.setAttribute('y2', b.y.toFixed(1));
    glow.setAttribute('stroke', `rgba(200,169,81,${glowOp})`);
    glow.setAttribute('stroke-width', String(glowW));
    glow.setAttribute('stroke-linecap', 'round');
    svg.appendChild(glow);

    // ② メイン線
    const lineW = isNext ? '5' : '3.5';
    const lineCol = isNext ? 'rgba(255,235,80,1.0)' : 'rgba(230,200,100,0.9)';
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', a.x.toFixed(1));
    line.setAttribute('y1', a.y.toFixed(1));
    line.setAttribute('x2', b.x.toFixed(1));
    line.setAttribute('y2', b.y.toFixed(1));
    line.setAttribute('stroke', lineCol);
    line.setAttribute('stroke-width', lineW);
    line.setAttribute('stroke-linecap', 'round');
    if(!isNext) line.classList.add('route-pulse');
    svg.appendChild(line);

    // 矢印（中間点）
    const mx  = (a.x + b.x) / 2;
    const my  = (a.y + b.y) / 2;
    const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;

    const g = document.createElementNS(NS, 'g');
    g.setAttribute('transform', `translate(${mx.toFixed(1)},${my.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    if(!isNext) g.classList.add('route-pulse');

    // 輪郭（コントラスト用の暗い影）
    const outline = document.createElementNS(NS, 'polygon');
    outline.setAttribute('points', isNext ? '-12,-10 18,0 -12,10' : '-11,-8.5 16,0 -11,8.5');
    outline.setAttribute('fill', 'rgba(0,0,0,0.5)');
    g.appendChild(outline);

    // グロー
    const triGlow = document.createElementNS(NS, 'polygon');
    triGlow.setAttribute('points', isNext ? '-11,-9 16,0 -11,9' : '-10,-7.5 14,0 -10,7.5');
    triGlow.setAttribute('fill', `rgba(200,169,81,${isNext ? '0.55' : '0.35'})`);
    g.appendChild(triGlow);

    // 本体
    const tri = document.createElementNS(NS, 'polygon');
    tri.setAttribute('points', isNext ? '-9,-7.5 13,0 -9,7.5' : '-8,-6 12,0 -8,6');
    tri.setAttribute('fill', isNext ? 'rgba(255,245,80,1.0)' : 'rgba(245,215,100,0.95)');
    g.appendChild(tri);

    svg.appendChild(g);
  }

  board.insertBefore(svg, board.firstChild);
}

// ===== REACHABLE HIGHLIGHT =====
// サイコロを振る前に1〜6マス先（バウンス考慮）を薄くハイライト
function highlightReachable(){
  clearHighlights();
  if(G.rolling || G.over) return;
  const cur = G.positions[G.cur];
  const seen = new Set();
  for(let dice = 1; dice <= 6; dice++){
    const raw = cur + dice;
    const pos = raw <= GOAL ? raw : 2 * GOAL - raw;
    if(pos >= 0 && pos <= GOAL) seen.add(pos);
  }
  seen.forEach(pos => {
    const el = document.getElementById(`sq${pos}`);
    if(el) el.classList.add('sq-reachable');
  });
}

function clearHighlights(){
  document.querySelectorAll('.sq-reachable,.sq-target')
    .forEach(el => el.classList.remove('sq-reachable','sq-target'));
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
    const drinks   = G.drinks ? G.drinks[i] : 0;
    const posLabel = pos === 0 ? 'スタート' : pos === GOAL ? '🏆 GOAL' : `${pos}マス目`;
    chip.innerHTML = `
      <div class="pchip-dot" style="background:${p.color}"></div>
      <div class="pchip-info">
        <div class="pchip-name">${p.name}</div>
        <div class="pchip-pos">${posLabel}</div>
      </div>
      <div class="pchip-drink">🍺 ${drinks}杯</div>`;
    bar.appendChild(chip);
  });
}

function updateTurn(){
  const p = G.players[G.cur];
  document.getElementById('turn-info').innerHTML =
    `<span class="turn-name">${p.name}</span> のターン`;
  renderRouteSVG(G.positions[G.cur]);
  highlightReachable();
  updateCardBtn();
}

// ===== DICE =====
function rollDice(){
  if(G.rolling || G.over) return;
  G.rolling = true;
  clearHighlights(); // サイコロを振り始めたらreachableを消す
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
      let rollVal = rnd(6) + 1;

      // カード効果: 2択ロール（2つのうち高い方）
      if(G.cardEffect === 'roll2'){
        const r2 = rnd(6) + 1;
        rollVal = Math.max(rollVal, r2);
        G.cardEffect = null;
      }

      // カード効果: ダイス+2
      let bonusSteps = 0;
      if(G.cardEffect === 'bonus'){
        bonusSteps = 2;
        G.cardEffect = null;
      }

      const totalMove = rollVal + bonusSteps;
      dice.textContent = FACES[rollVal - 1];

      num.textContent = bonusSteps > 0 ? `${rollVal}+${bonusSteps}` : rollVal;
      void num.offsetWidth;
      num.classList.add('pop');

      // 着地予定マスを緑ハイライト → 少し見せてからコマを動かす
      setTimeout(() => {
        const startPos = G.positions[G.cur];
        const raw      = startPos + totalMove;
        const finalPos = raw <= GOAL ? raw : Math.max(0, 2 * GOAL - raw);
        const tEl = document.getElementById(`sq${finalPos}`);
        if(tEl) tEl.classList.add('sq-target');
        setTimeout(() => movePlayer(totalMove), 700);
      }, 500);
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
  // 着地予定ハイライトを解除してからアニメ開始
  document.querySelectorAll('.sq-target').forEach(el => el.classList.remove('sq-target'));
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
  // カード効果: イベントスキップ
  if(G.cardEffect === 'skip'){
    G.cardEffect = null;
    showModal('🛡️','🃏 カード効果！','イベントをスキップ！',
      'カードの効果でこのマスのイベントをスキップ！飲まなくてOK！', '#C8A951', () => nextTurn());
    return;
  }

  const sq    = G.squares[pos];
  const pname = G.players[pi].name;

  switch(sq.type){
    case 'drink':{
      const e = pick(DRINK);
      // カード効果: 飲む転嫁
      if(G.cardEffect === 'transfer'){
        G.cardEffect = null;
        const rightIdx = (pi + 1) % G.players.length;
        G.drinks[rightIdx]++;
        const rightName = G.players[rightIdx].name;
        showModal('👉','🃏 カード効果！','飲む転嫁！',
          `${pname}の代わりに${rightName}が飲む！`, '#C8A951', () => nextTurn());
      } else {
        G.drinks[pi]++;
        showModal('🍺','飲むマス',`${pname}が飲む！`, e.body, '#ff4d4d', () => nextTurn());
      }
      break;
    }
    case 'all_drink':{
      const e = pick(ALL_DRINK);
      G.players.forEach((_,i) => G.drinks[i]++);
      showModal('🥂','全員飲むマス','全員で乾杯！🥂', e.body, '#ff8c42', () => nextTurn());
      break;
    }
    // case 'quiz':{ // クイズ一時無効化中
    //   const e = pick(QUIZ);
    //   showQuizModal(e.q, e.a, pname, () => nextTurn());
    //   break;
    // }
    case 'game':{
      const e = pick(GAME);
      showModal('🎲','ゲームマス','ミニゲーム！', e.body, '#9333ea', () => {
        showDrinkSelect(() => nextTurn());
      });
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
      G.players.forEach((_,i) => G.drinks[i]++);
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
      showModal('👑','王様マス',`👑 ${pname}が王様！`, cmd, '#D97706', () => {
        showDrinkSelect(() => nextTurn());
      });
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
            G.drinks[pi]++;
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
  } else if(modalMode === 'quiz-a'){
    // 飲んだ人を選ぶ画面へ
    const savedCb = modalCb;
    modalCb = null;
    document.getElementById('modal').classList.remove('show');
    document.getElementById('m-btn2').style.display = 'none';
    document.getElementById('m-answer').style.display = 'none';
    modalMode = 'normal';
    setTimeout(() => showDrinkSelect(savedCb), 300);
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

// ===== 誰が飲んだか選択モーダル =====
function showDrinkSelect(cb){
  drinkSelectCb = cb;
  modalMode = 'drink-select';

  document.getElementById('m-icon').textContent  = '🍺';
  document.getElementById('m-type').textContent  = '飲んだ人を選択';
  document.getElementById('m-title').textContent = '誰が飲んだ？';
  document.getElementById('m-body').textContent  = '飲んだ人を選んでください（複数選択OK）';
  document.getElementById('m-answer').style.display = 'none';

  // プレイヤーチェックボックス生成
  const checksDiv = document.getElementById('m-player-checks');
  checksDiv.innerHTML = '';
  G.players.forEach((p, i) => {
    const label = document.createElement('label');
    label.className = 'm-player-check';
    label.innerHTML = `
      <input type="checkbox" value="${i}">
      <span class="m-check-dot" style="background:${p.color}"></span>
      <span class="m-check-name">${p.name}</span>
      <span class="m-check-count">現在 ${G.drinks[i]}杯</span>`;
    const inp = label.querySelector('input');
    inp.addEventListener('change', () => label.classList.toggle('checked', inp.checked));
    checksDiv.appendChild(label);
  });

  document.getElementById('m-player-select').style.display = 'block';
  document.getElementById('m-btn').style.display = 'none';

  const btn2 = document.getElementById('m-btn2');
  btn2.textContent = '誰も飲まなかった 🙅';
  btn2.style.display = 'block';
  btn2.onclick = skipDrinkSelect;

  document.getElementById('modal').classList.add('show');
}

function confirmDrinkers(){
  document.querySelectorAll('#m-player-checks input:checked')
    .forEach(inp => { G.drinks[+inp.value]++; });
  closeDrinkSelect();
}

function skipDrinkSelect(){ closeDrinkSelect(); }

function closeDrinkSelect(){
  document.getElementById('m-player-select').style.display = 'none';
  const btn = document.getElementById('m-btn');
  btn.style.display = 'block';
  btn.textContent   = 'わかった！';
  const btn2 = document.getElementById('m-btn2');
  btn2.style.display = 'none';
  btn2.onclick = closeModal;
  modalMode = 'normal';
  document.getElementById('modal').classList.remove('show');
  renderBar();
  const cb = drinkSelectCb;
  drinkSelectCb = null;
  if(cb) setTimeout(cb, 200);
}

// ===== NEXT TURN =====
function nextTurn(){
  G.cardEffect = null;
  G.cur = (G.cur + 1) % G.players.length;
  G.rolling = false;
  document.getElementById('roll-btn').disabled = false;
  document.getElementById('dice').textContent  = '🎲';
  renderBar(); updateTurn(); renderTokens();
}

// ===== SPECIAL CARD =====
function activateCard(){
  const pi = G.cur;
  if(!G.cardUsed || G.cardUsed[pi] || G.rolling || G.over) return;

  const card  = CARDS[rnd(CARDS.length)];
  G.cardUsed[pi] = true;
  updateCardBtn();

  const pname = G.players[pi].name;

  // 即時効果: 強制乾杯（自分以外が飲む）
  if(card.id === 'party'){
    G.players.forEach((_,i) => { if(i !== pi) G.drinks[i]++; });
    renderBar();
    showModal(card.icon, `🃏 カード: ${card.name}`, `${pname}がカードを使った！`,
      card.desc, '#C8A951', () => {});
    return;
  }

  // 即時効果: 指名飲み（誰か1人を選んで飲ませる）
  if(card.id === 'nominate'){
    showModal(card.icon, `🃏 カード: ${card.name}`, `${pname}がカードを使った！`,
      card.desc, '#C8A951', () => {
        showDrinkSelect(() => {});
      });
    return;
  }

  // 次のアクション時に発動する効果をセット
  G.cardEffect = card.id;
  showModal(card.icon, `🃏 カード: ${card.name}`, `${pname}がカードを使った！`,
    card.desc, '#C8A951', () => {});
}

function updateCardBtn(){
  const btn = document.getElementById('card-btn');
  if(!btn) return;
  const pi = G.cur;
  if(!G.cardUsed || G.cardUsed[pi]){
    btn.textContent = '🃏 使用済';
    btn.disabled    = true;
    btn.classList.add('used');
  } else {
    btn.textContent = '🃏 カード';
    btn.disabled    = false;
    btn.classList.remove('used');
  }
}

// ===== VICTORY =====
function showVictory(wi){
  G.over = true;
  const winner = G.players[wi];

  // 最多飲酒者を特定 → +1杯追加
  const maxDrinks = Math.max(...G.drinks);
  const topIdx    = G.drinks.lastIndexOf(maxDrinks); // 同点なら後の人
  if(G.players.length > 1) G.drinks[topIdx]++;

  // ゴールできなかったプレイヤー
  const loserNames = G.players.filter((_, i) => i !== wi).map(p => p.name);

  // 飲酒ランキング（多い順）
  const ranking = G.players
    .map((p, i) => ({ p, drinks: G.drinks[i] }))
    .sort((a, b) => b.drinks - a.drinks);

  // extra drink 行
  let extraRows = '';
  if(loserNames.length > 0)
    extraRows += `<div class="v-extra-row">😭 ${loserNames.join('・')} は罰杯！🍺</div>`;
  if(G.players.length > 1)
    extraRows += `<div class="v-extra-row">🏆 最多飲酒 ${G.players[topIdx].name}（${G.drinks[topIdx]}杯）追加で1杯！</div>`;

  // ランキング行
  const rankRows = ranking.map(({ p, drinks }, i) =>
    `<div class="v-rank-row">
      <span class="v-rank-num">${i + 1}.</span>
      <span class="v-rank-dot" style="background:${p.color}"></span>
      <span class="v-rank-name">${p.name}</span>
      <span class="v-rank-count">🍺 ${drinks}杯</span>
    </div>`).join('');

  document.getElementById('v-title').textContent = `🎉 ${winner.name} の勝ち！`;
  document.getElementById('v-drink-section').innerHTML = `
    ${extraRows ? `<div class="v-extra-drink">${extraRows}</div>` : ''}
    <div class="v-drink-ranking">
      <div class="v-rank-title">最終飲酒ランキング</div>
      ${rankRows}
    </div>`;

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
