if (window.g_G == null) window.g_G = {
    //olle_api_url: 'http://localhost:10001'
    olle_api_url: 'http://test.olle.hansandopool.com:10001'
};


g_G = window.g_G;

g_G.error = console.error;
g_G.log = console.log;
g_G.clog = console.log;
g_G.warn = console.warn;

//  https://github.com/CodeSeven/toastr
g_G.toastr = toastr;
/*
// Display a warning toast, with no title
toastr.warning('My name is Inigo Montoya. You killed my father, prepare to die!')

// Display a success toast, with a title
toastr.success('Have fun storming the castle!', 'Miracle Max Says')

// Display an error toast, with a title
toastr.error('I do not think that word means what you think it means.', 'Inconceivable!')

// Override global options
toastr.success('We do have the Kapua suite available.', 'Turtle Bay Resort', {timeOut: 5000})
*/

g_G.isMobile = function() {
    var md = new MobileDetect(window.navigator.userAgent);
    return md.mobile();
    if (md.mobile()) {
        console.log('roy : mobile');

    } else {
        console.log('roy : not mobile');

    }
}

g_G.checkString = function(val, key, max, min) {
    if (min == null) min = 0;
    var v = val[key];
    if (v == null) {
        g_G.toastr.error(key + ' : 값이 없습니다.');
        g_G.error('checkString() : ' + key + '==null');
        return true;
    }
    if (v.length < min) {
        g_G.toastr.error(key + ' : 최소길이는 ' + min + ' 입니다.');
        g_G.error('checkString() : ' + key + 'length <=min ' + min);
        return true;
    }
    if (max) {
        if (v.length > max) {
            g_G.toastr.error(key + ' : 최대길이는 ' + max + ' 입니다.');
            g_G.error('checkString() : ' + key + 'length >max ' + max);
            return true;
        }
    }
    return false;
}


g_G.queryString = function() {
    var vars = {},
        hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
}


window.g_G.olle_finderData = {
    category_table: {
        "1. 기초상품등록": "olleBasicProduct",
        "2. 구매현황": "olleBuy",
        "3. 생산입고현황": "olleProductInbound",
        "4. 창고이동현황": "shipping",
        "5. 판매현황": "olleSell",
    },
    category: {
        "1. 기초상품등록": [ //
            "품목코드",
            "품목명",
            "품목구분",
            "규격명",
            "그룹명",
            "검색창내용",
            "사용구분",
            "파일관리",
        ],
        "2. 구매현황": [ //
            "월/일",
            "품명 및 규격",
            "수량",
            "단가",
            "공급가액",
            "부가세",
            "합계",
            "구매처명",
        ],
        "3. 생산입고현황": [
            "월/일",
            "생산된공장",
            "입고창고",
            "품명 및 규격",
            "수량",
            "생산금액",
            "작업인원",
            "상태",
        ],
        "4. 창고이동현황": [
            "일자-No.",
            "출고창고명",
            "입고창고명",
            "품목명[규격명]",
            "수량",
            "금액(수량*입고단가)",
            "createdAt",
        ],
        "5. 판매현황": [
            "월/일",
            "품명 및 규격",
            "수량",
            "단가",
            "공급가액",
            "부가세",
            "합 계",
            "판매처명",
            "적요",
        ],

        // create: [
        //     'Lot',
        //     'LotDate',
        //     '추출기',
        //     '원재료',
        //     '원료투입(kg)',
        //     '검수-맛',
        //     '검수-냄새',
        //     '검수-색',
        //     '함수율',
        //     '건조/추출조건',
        //     '담당자',
        //     'createdAt',
        // ],
    }
}


var ret = Cookies.getJSON('eUSER_LOGIN');
if (ret) {
    g_G.isLogin = true;
    g_G.user = ret.user;
    console.log('eUSER_LOGIN=', ret);
}



function _ajax_error(jqXHR, exception) {
    if (jqXHR.status === 0) {
        $('#status').css('color', 'red').html(' Not connect. Verify Network.');
    } else if (jqXHR.status == 404) {
        $('#status').css('color', 'red').html(' Requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        $('#status').css('color', 'red').html(' Internal Server Error [500].');
    } else if (exception === 'parsererror') {
        $('#status').css('color', 'red').html(' Requested JSON parse failed.');
    } else if (exception === 'timeout') {
        $('#status').css('color', 'red').html(' Time out error.');
    } else if (exception === 'abort') {
        $('#status').css('color', 'red').html(' Ajax request aborted.');
    } else {
        $('#status').css('color', 'red').html(' Uncaught Error.' + jqXHR.responseText);
    }
}

function getlocale() {
    var userLang = navigator.language || navigator.userLanguage;
    userLang = userLang.split('-')[0];
    //alert("The language is: " + userLang);
    return userLang;
}

g_G.error_handler = function(eCmd, rq, rs, err) {
    //if (g_G.SERVICE_MODE == 'dev') {
    g_G.toastr.clear();

    g_G.toastr.error(err.message, eCmd);
    //}
}

g_G.http_call = function(method, url, data, CB) {
    data.locale = getlocale();
    console.log('http', 'g_G.http_get = ', url);
    //console.dir(data);
    $.ajax({
        url: url,
        type: method,
        beforeSend: function(xhr) {
            if (g_G.user) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + g_G.user.token);
            }
        },
        data: data,
        dataType: 'json',
        crossDomain: true,

        success: function(ret) {
            if (ret.error) {
                g_G.error(url, ret.error);
                if (CB) CB(ret.error);
                return;
            }
            //g_G.clog('http', 'http_get  success= ', ret);
            if (ret.user) {
                g_G.user = ret.user;
            };
            //$('#status').css('color', 'black').html(' ok : ' + url);
            if (CB) CB(null, ret);
        },
        error: function(xhr, exception) {
            var ret = xhr.responseJSON;
            g_G.error('http_get', url, exception, xhr);
            //_ajax_error(xhr, exception);
            if (CB) {
                if (ret)
                    CB(ret.error ? ret.error : ret, ret);
                else
                    CB(exception.toString());
            }
        }
    });
}