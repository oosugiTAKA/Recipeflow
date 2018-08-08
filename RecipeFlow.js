//  {"id":"101", "label":"初級者用", "posx":740, "posy":550}, 
//  { "source" : 12, "target" : 7, "id":"101" },

$('#recipe').on('change', function(){
  num = $(this).val(); //選択された項目のvalueを取得

  $("#base").empty();
  
  if(num){ //valueに何か値が入っていた場合
    var failures;
    var image;
        if(num == "1"){ //チャーハンを選択したらチャーハンのフローグラフを出す
          $("#base").empty(); //一度フローを描く場所を初期化
          flow();
        }else if(num == "2"){ 
          $("#base").empty();
          flow();

        }  
  }
});





function flow(){
// svgの設定(サイズの部分)
var svg = d3.select('svg');
var w = document.querySelector("body").clientWidth;
var h = document.querySelector("body").clientHeight;

var lineHeight = 1.4; //四角の中の文字の行幅

var base = svg.select('#base');
var overlay = svg.select('#overlay');
var info = svg.select('#info');
var source = svg.select('#source');

process = 0;


// var description = info.append('text')
//     .attr({
//       'x':20,
//       'y':100,
//       'font-size': 24,
//       'fill':'blue'
//     })

// var video =  info.append('video')
//     .attr({
//       'x':20,
//       'y':150,
//       'width':480,
//       'height':270,
//     })

// var video =  info.append('text')
//     .attr({
//       'x':40,
//       'y':200,
//       'width':480,
//       'height':270,
//       'src':'cook.png',
//     })

// var source = video.append('source')
//     .attr({
//       'x':50,
//       'y':200,
//       'width':480,
//       'height':270,
//       'src':'https://www.youtube.com/watch?v=zdIOiV88lVs',
//     })
//     .transition().style('opacity', 1);

// JSONファイルの読み込み
d3.json('./Recipe/recipe'+ num +'.json', function(error, flow){

// エラー時の処理
if (flow == null) {
            alert(error);
            return;
        }

// Force Layoutの各パラメータの設定
var force = d3.layout.force()
	.nodes(flow.nodes)
	.links(flow.links)
	.size([w, h])
	.gravity(0.1)
	.charge(-500)
	.friction(0.95)
	.linkDistance(220)
	.linkStrength(1);


//force レイアウトの計算を開始
force.start(); 
// for (var i = 10000; i > 0; --i){
// 	force.tick();
// }  //ワンステップ進める	


// リンクのそれぞれの設定(開始位置と終了位置の設定など)
var line = base.selectAll("line")
	.data(flow.links)
	.enter()
	.append("line")
	.attr({
		"stroke": "black",
		"x1":function(d){ return d.source.posx + 100; },
		"y1":function(d){ return d.source.posy + 75; },
		"x2":function(d){ return d.target.posx ; },
		"y2":function(d){ return d.target.posy + 75; },
    "id":function(d){ return d.id}
		// "x1":function(d){ return d.source.x + 100; },
		// "y1":function(d){ return d.source.y + 75; },
		// "x2":function(d){ return d.target.x ; },
		// "y2":function(d){ return d.target.y + 75; },
	});


// 四角とテキストを同じブロックにまとめてる
// ブロックの作成

g = base.selectAll('g.block')
  .data(flow.nodes).enter().append('g')
	.attr({
		class: 'block',
    id:function(d){return d.id},
	});

console.log(flow);

// 四角をブロックに追加
g.append('rect')
	.attr({
		class:"node",
		id:function(d){return d.id},
		"fill": "white",
		// "x": function(d){ return 100 },
		// "y": function(d){ return 100 },
		"x": function(d){ return d.posx },
		"y": function(d){ return d.posy },
		"width": 120,
		"height": 150,
	})
	.call(force.drag);

for(i = 0; i < g[0].length; i++  ){
  if(g[0][i].id >= 100){
    g[0][i].firstChild.attributes[2].nodeValue = "red";
    // console.log(g[0][0].firstChild.attributes[2].ownerElement.x);
    // console.log(g[0][0].firstChild.attributes[2].ownerElement.y);

}
};

// console.log(g[0][0].firstChild.attributes[3].nodeValue);
// console.log(g[0][0].firstChild.attributes);
// console.log(g[0]);



// テキストをブロックに追加
g.append('text')
	.attr({
    	"text-anchor":"middle",
    	"fill":"black",
     //  "x": function(d) { return d.x + 50; },
    	// "y": function(d) { return d.y + 75; },
    	transform: function(d) { //引数dにはrectsのデータが入ってる，枠線の中の文字の原点を移動させる
      return "translate(" + (d.posx + 60) + "," + (d.posy + 75) + ")";
    },
    })
    // .style({"font-size":11})
    .text(function(d) { return d.label; })
    .call(multiline, lineHeight);



// ノードは静止しといてドラッグしたときだけ，動かす
// d3.selectAll(".node").each(function(d){ d.fixed = true })
 
// // リンク，ノード，テキストそれぞれを動かしたときの位置を決定
// force.on("tick", function() {
// 	line
// 		.attr("x1", function(d) { return d.source.x + 100; }) // ソースとターゲットの要素座標を指定していく
// 		.attr("y1", function(d) { return d.source.y + 75; })
// 		.attr("x2", function(d) { return d.target.x ; })
// 		.attr("y2", function(d) { return d.target.y + 75; });
// 	g.select('rect')
// 		.attr("x", function(d) { return d.posx; })    // ノードの座標を指定していく
// 		.attr("y", function(d) { return d.posy; })
// 		.attr("width", 100)
// 		.attr("height", 150);

// 	g.select('text')
// 		.attr("x", function(d) { return d.x - 50; })
//         .attr("y", function(d) { return d.y - 75; })
//         // .attr("text",function(d) { return d.label; })
//         .attr("transform",function(d) { return "translate(" + (d.x+50) + "," + (d.y+75) + ")" });
// });

// 複数行にする関数
function multiline(text, lineHeight) {
  text.each(function() {
    var text = d3.select(this),
        lines = text.text().split(/\n/),
        lineCount = lines.length,
        i,
        line,
        y;
    text.text('');
    for (i = 0; i < lineCount; i++) {
      line = lines[i];
      y = (i - (lineCount - 1) / 2) * lineHeight;

      text.append('tspan')
        .attr({
          'x':0,
          'y': y ? y + 'em' : 0,
          'dy': '.35em'
        })
        .text(line);
    }
  });
}



// 初心者用を押したときに上級者用のアドバイスを消す
// 初心者用のアドバイスのタグには id>100かつid<200を振り分けている
// JSONファイル参照：ブロックとラインの数が合わないのでラインで数調整を行っている
document.getElementById("begginer").onclick = function(){
  for (i = 0; i < g[0].length; i++ ){

    //ブロックとラインの削除 
    if (g[0][i].id >= 200 && g[0][i].id < 300){
      line[0][i].remove();
      g[0][i].remove();
    }
  }
}


// 上級者用を押したときに初級者用のアドバイスを消す
// 上級者用のアドバイスのタグには id>200かつid<300を振り分けている
document.getElementById("experiencer").onclick = function(){
  for (i = 0; i < g[0].length; i++ ){

    if (g[0][i].id >= 100 && g[0][i].id < 200){
      // console.log(line[0]);
      line[0][i].remove();
      g[0][i].remove();
    }
  }
}


// g.on('click', function(d, i){

//     //棒グラフのコピーを作る
//     var copryRect = overlay.append('rect')
//       .on('click', function(){    //コピーがクリックされた際の処理(閉じる)
//         description.text("").style('opacity', 0);
//         video.text("").style('opacity', 0);
//         copryRect.transition().attr({
//           'x': d.posx ,
//           'y': d.posy ,
//           'height':120,
//           'width':150,
//         })
//         .call(endall, function(){
//           copryRect.remove();     
//         })
//       });



//     //オリジナルからattributesを取得し、コピーに適用する
//     Array.prototype.slice.call(d3.select(this).node().attributes).forEach(function(d){
//       copryRect.attr(d.name, d.value)
//     });
    
//     //コピーを画面いっぱいまで広げる
//     copryRect.transition().attr({
//       x:0,
//       y:0,
//       width:w,
//       height:h,
//       fill:'white',
//     })
//     .call(endall, function(){
//       console.log(d.url);
//       description.text(d.description).transition().style('opacity', 1);
//       video.text(d.url).transition().style('opacity', 1);
//       // video.src(d.url).transition().style('opacity', 1);
//     });
//   })
  
  
  function endall(transition, callback) { 
    var n = 0; 
    transition 
      .each(function() { ++n; }) 
      .each("end", function() { if (!--n) callback.apply(this, arguments); }); 
  };


// 調理開始ボタン押したときの処理
document.getElementById("start").onclick = function(){
  process = 0;
  // 発声の処理
  now();
 // nonow();
}

// console.log(g[0][0].__data__);
// console.log(g[0][1].__data__);
// console.log(g[0][2].__data__);
// console.log(g[0][3].__data__);
// console.log(g[0][4].__data__);
// console.log(g[0][5].__data__);
// console.log(g[0][6].__data__);
// console.log(g[0][7].__data__);
// console.log(g[0][8].__data__);
// console.log(g[0][8].__data__.failure);



// xを押せば次の手順へ，zを押せば前の手順へ
window.document.onkeydown = function(event){
  
    if (event.key === 'x'){
      process += 1;
      now();
      // nonow();
    }

    if (event.key === 'z') {
      process -= 1;
      now();
      // nonow();
    }

    if(process == 8){
      var ssu = new SpeechSynthesisUtterance();
      ssu.text = g[0][8].__data__.failure;
      ssu.lang = 'ja-JP';
      speechSynthesis.speak(ssu);
}
}




// 点滅処理と透明化
function now(){
  // 点滅処理
  $(function(){
        setInterval(function(){
          $(g[0][process]).fadeOut(500,function(){$(this).fadeIn(500)});
        },1000);
      });
  // 現在以外透明化
  $('rect[id !=' +process+ ']').css('opacity','0.2');
  $('rect[id =' +process+ ']').css('opacity','1');
}
// function nonow(){
//   // $('.block rect').not().css('fill','red');
//   $('rect[id !=' +process+ ']').css('opacity','0.2');
//   $('rect[id =' +process+ ']').css('opacity','1');

// }

});
};





