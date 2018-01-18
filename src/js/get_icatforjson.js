//icat for jsonを使ってjsonデータを取得
function getIcatJson(divId) {
    var param = "icath";
	var errMsg = "データの読込みに失敗しました。";
	var errRetry = 3;
	var timeout = 10000;
	var errCnt = 1;
	var protocol = location.protocol;
    $.ajax({
           "url": protocol + "//isec-myjvn-feed1.ipa.go.jp/IPARssReader.php?" + parseInt((new Date)/1000),
           "dataType": "json",
	       "data": "tool=" + param,
	       "timeout": timeout,
	       "cache" : false,
	       "success": function(data) {
	       try {
		        //メッセージが設定されている場合、データを表示せずメッセージを表示して処理終了
                if(data.message != null){
		        	var msgStr = errMsg;
                    if(data.message != ""){
		        		msgStr = data.message;
		            };
                    returnErr(msgStr + "(" + data.messageid + ")", divId);
                    return;
		        }

                //成功時
                var ul = $("<ul/>").addClass("list-group");
                $.each(data.itemdata, function(i, val) {
                    var li = $("<li/>").addClass("list-group-item");
                    var a = $("<a/>").attr("href", val.item_link).text(val.item_title);
                    var time = $("<time/>").attr("datetime", val.item_date).text(getTime(val.item_date));
                    li.append(a).append(" (").append(time).append(")");
                    ul.append(li);
                });
                $("#" + divId).append(ul);
	        }
            catch (e){
                returnErr(errMsg, divId);
            }
	    },
        "error": function(xhr, textStatus, errorThrown) {
            returnErr(errMsg, divId);
        }
    })
}
//エラー時処理
function returnErr(message, divId){
    $("#" + divId).text(message);
}
//時刻を取得
function getTime(dateStr) {
    var date = new Date(dateStr); 

    //年・月・日を取得する
    var year = date.getFullYear();
    var month = zeroPadding(date.getMonth() + 1);
    var day = zeroPadding(date.getDate());
    //時・分・秒を取得する
    var hour = zeroPadding(date.getHours());
    var minute = zeroPadding(date.getMinutes());
    var second = zeroPadding(date.getSeconds());

    //"yyyy-MM-dd hh:ii:ss"の形式に整形して返す
    var str = year + "/" + month + "/" + day + " " + hour + ":" + minute + ":" + second;
    return str;
}
//頭に0を追加
function zeroPadding(str) {
    if (str < 10) {
        str = "0" + str;
    }
    return str;
}

getIcatJson("show");