if (window.g_G == null) window.g_G = {
    olle_api_url: 'http://localhost:10001'
};

g_G = window.g_G;
g_G.isMobile = function() {
    var md = new MobileDetect(window.navigator.userAgent);
    return md.mobile();
    if (md.mobile()) {
        console.log('roy : mobile');

    } else {
        console.log('roy : not mobile');

    }
}

g_G.queryString = function() {
    var vars = {}, hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
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