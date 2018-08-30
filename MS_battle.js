//変化率を計算する関数の定義
var diff = function(s, t, p, q){
    return (quote(s, t + p) - quote(s, t + q)) / p;
}

// 株sについて、時間　t　~　t + uの区間でdiffが最大となる売却時間を得る関数の定義
var sell_time = function(s, t, u){
    var q = 0;
    // p = 10 ~ uのdiff(s, t, p)の配列を作成
    var arr = [];
    for (var p = 10; p < u; p++){
        arr.push(diff(s, t, p, q)); 
    }
    // diff(s, t, p)の配列のうち最大のdiffを取る売却時間を得る
    return arr.indexOf(Math.max.apply(null, arr));
}

// 購入株buy_stock_sについて、時間 t ~ t + p_s_sの区間でdiffが最大となる購入時間を得る関数の定義
var buy_time = function(buy_stock_s, t, p_s_s){
    var arr = []
        //例外処理　t == 0, p_s_s == 0の場合
        if (t == 0 && p_s_s == 0){
            arr.push(0);
        }
        else{
            for (var q = 0; q <= p_s_s; q++){
                arr.push(diff(buy_stock_s, t, p_s_s, q));
            }
        }
    return arr.indexOf(Math.max.apply(null, arr));
}



for (var t = 0; t < T; t++){
    // diff計算時、pをどこまで計算させるかによって最終結果が上下するため、u_1,u_2,u_3を調整する必要がある
    var [u_1, u_2, u_3, t_2, t_3] = [30, 30, 25, 160, 210];
    var p_s_2 = 0;
    var p_s_3 = 0;
    
    
    // s = 0 ~ 2のdiff(s, t, p_s_1 + 10)の配列を作成
	var stock_1 = [];
	for (var s = 0; s < 3; s++){
        //売却時間の計算
        var p = sell_time(s, t, u_1);

        var q = 0;
        stock_1.push(diff(s, t, p + 10, q));
	}
    // diff(s, t, p_s_1)の配列のうち最大のdiffを取る株buy_stock_1を得る
	var buy_stock_1 = stock_1.indexOf(Math.max.apply(null, stock_1));

    //購入株buy_stock_1の売却時間p_s_1を再計算
    var p_s_1 = sell_time(buy_stock_1, t, u_1);

    // 購入時間を考える
    var q_s_1 = buy_time(buy_stock_1, t, p_s_1);
    
	//株buy_stock_1を時間t + q_s_1で購入し時間t + 10 + p_s_1で売却する

    buy(buy_stock_1, t + q_s_1);
	sell(buy_stock_1, t + 10 + p_s_1);
    

    
	// t > t_2 で二つ目の株buy_stock_2を購入する
    if (t > t_2){
        // s = 0 ~ 2のdiff(s, t, p_s_2 + 10)の配列を作成
    	var stock_2 = [];
        for (var s = 0; s <3; s++){
            if(s != buy_stock_1){
                sell_time(s, t, u_2);
            }
            // diff(s, t, p, q)の配列のうち最大のdiffを取る売却時間pを得る
            var p = sell_time(s, t, u_2);

            var q = 0;
            stock_2.push(diff(s, t, p + 10, q));
        }
        //配列stock_2の「buy_stock_1」番目に0項を挿入、配列の位置調整をする
        stock_2.splice(buy_stock_1 , 0, 0);
        
        // diff(s, t, p_s_2)の配列のうち最大のdiffを取る株buy_stock_2を得る
        
        var buy_stock_2 = stock_2.indexOf(Math.max.apply(null, stock_2)); 
    
        //購入株buy_stock_2の売却時間p_s_2を再計算
        var p_s_2 = sell_time(buy_stock_2, t, u_2);
    
        // 購入時間を考える
        var q_s_2 = buy_time(buy_stock_2, t, p_s_2);
    
        //株buy_stock_2を時間t + q_s_2で購入し時間t + 10 + p_s_2で売却する
        if (diff(buy_stock_2, t, p_s_2, q_s_2) > 0){
            buy(buy_stock_2, t + q_s_2);
        	sell(buy_stock_2, t + 10 + p_s_2);  
        }


        
        // t > t_3 で三つ目の株buy_stock_3を買う
        if (t > t_3){
            // 株0 ~ 2のうちbuy_stock_1, buy_stock_2ではない株、buy_stock_3を得る
            for (var s = 0; s <3; s++){
                if(s != buy_stock_1 && s != buy_stock_2){
                    var buy_stock_3 = s;
                }
            }
            //購入株buy_stock_3の売却時間p_s_3を計算
            var p_s_3 = sell_time(buy_stock_3, t, u_3);

            // 購入時間を考える
            var q_s_3 = buy_time(buy_stock_3, t, p_s_3);
        
            //株buy_stock_3を時間t + q_s_3で購入し時間t + 10 + p_s_3で売却する
            if (diff(buy_stock_3, t, p_s_3, q_s_3) > 0){
                buy(buy_stock_3, t + q_s_3);
            	sell(buy_stock_3, t + 10 + p_s_3);  
            }
        }
    }

    //時間を10 + Math.max(p_s_1, p_s_2, p_s_3)だけ進める
    t = t + 10 + Math.max(p_s_1, p_s_2, p_s_3);
}