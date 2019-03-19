'use strict'
const async = require('async');
const format = require('util').format;
const moment = require('moment');
moment.createFromInputFallback = function(config) { config._d = new Date(config._i); };


const request = require('request');
const readline = require('readline');



exports.Init = async function(g_G) {
    var FMT = 'YYYY-M-DD HH:mm:ss';

    g_G.UnixTime2Date = function (unixTime){
        return new Date(unixTime*1000);
    }
    g_G.Date2UnixTime = function( date ){
        return new Date(date).getTime();
    }

    g_G.daysBetween = function(date1, date2) {
        //Get 1 day in milliseconds
        var one_day = 1000 * 60 * 60 * 24;

        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();

        // Calculate the difference in milliseconds
        var difference_ms = date2_ms - date1_ms;

        // Convert back to days and return
        return Math.round(difference_ms / one_day);
    }

    g_G.string_to_time = function(time) {
        //g_G.log('string_to_time time = ' ,time);
        var tt = typeof(time);
        if (tt == 'string')
            return (new Date(time)).getTime()
        else if (tt == 'number') return time;

        g_G.error('string_to_time() : typeof(time)==' + tt + ' time=' + time);
        return 'string_to_time() error :' + time;
    }

    g_G.calc_left_second = function(date) {
        var t = moment(date, FMT);
        var diff = t.diff(moment(), 'seconds');
        //if (diff <= 0) return 0;
        return diff; // 음수이면 시간이 지났다.
    }

    // time1 - time2 한후 남은 시간 초
    g_G.diff_time_second = function(time1, time2) {
        var t = moment(time1, FMT);
        var diff = t.diff(moment(time2, FMT), 'seconds');
        return diff;

    }

    // obj[field]의 값이 현제 시간 보다 지났는지 체크. 
    // 리턴값은 현제 시간으로 부터 남은 시간(분)를 리턴.
    //  0 또는 -값이면 완료된것이다.
    g_G.check_time_over = function(val) {
        if (typeof(val) != 'string') { g_G.error('g_G.check_time_over() : val is not string', val); }
        var t2 = moment(val, FMT);
        var diff = t2.diff(moment(), 'minutes');
        return diff;
        //if (diff > 0) return false;
        //return true;
    }
    // ----------------------------------------------------------------------------
    g_G.TIMESTAMP = function() {
        return moment().format().replace(/T/, ' ').replace(/\+.+/, '');
    };

    g_G.utc_to_time = function(utc) {
        return moment(utc).format(FMT);
    }

    g_G.time = function(fmt) { //현제 시간.
        if (fmt == null) fmt = FMT;
        return moment().format(fmt);
    }
    g_G.after_time = function(after_sec) { //현제 부터 after second초 만큼 지난 시간을 리턴.
        return moment().add(after_sec, 's').format(FMT);
    }
    g_G.after_time2 = function(this_time, after_sec) { //this_time으로 부터 after second초 만큼 지난 시간을 리턴.
        return moment(this_time, FMT).add(after_sec, 's').format(FMT);
    }

    // ----------------------------------------------------------------------------
    g_G.is_period_date = function(start, curr, end) {
        //var startDate = moment( '2013-5-11 8:73:18', 'YYYY-M-DD HH:mm:ss' )
        //var endDate = moment( '2013-5-11 10:73:18', 'YYYY-M-DD HH:mm:ss' )
        var s = moment(start, FMT);
        var e = moment(end, FMT);
        var c = moment(curr, FMT);
        return e.diff(c, 'seconds') >= 0 && c.diff(s, 'seconds') >= 0;
    }
    //console.log( is_period_date( '2013-4-11 8:73:17', '2013-6-11 8:73:18', '2013-6-11 8:73:17' ) );
    //console.log( is_period_date( '2013-4-11', '2013-6-12', '2013-6-11' ) );

    //한주의 해당 요일에 해당 하는 날짜. 1 이면 월요일 7일면 일요일.
    g_G.getWeekDay = function(index) {
        return moment().day(parseInt(index)).add(0, 'days').format('YYYY-MM-DD');
    }

    //한주의 시작 날짜.
    g_G.getWeeklyStartDay = function() {
        return moment().day(1).add(0, 'days').format('YYYY-MM-DD');
    }

    //지난주의 시작 날짜.
    g_G.getPrevWeeklyStartDay = function() {
        return moment().day(1).add(-7, 'days').format('YYYY-MM-DD');
    }

    /**
    http://cheolguso.com/date%EC%97%90-%EA%B4%80%ED%95%9C-%EC%84%A4%EC%A0%95%EC%9D%84-%ED%8E%B8%EB%A6%AC%ED%95%98%EA%B2%8C-moment-js/
    
     * 한 주의 시작일과 마지막일을 구합니다.
     *
     * @returns {Array} 해당 주의 시작일과 끝일을 구합니다.
     * @param week {Number} 몇 주 전인지... (ex. 0: 이번주, 1: 1주전, 2: 2주전)
     */
    g_G.getWeeklyDateBetweenStartAndEnd = function(week) {

        var beforeWeek = week * -7;
        var weekDayStart = moment().day(1).add(beforeWeek, 'days').format('YYYY-MM-DD');
        var weekDayEnd;

        // moment().format('YYYY-MM-DD') 는 기본값으로 오늘의 날짜를 YYYY-MM-DD의 형식(ex. 2016-06-11)으로 출력합니다.
        //
        // moment().day(1) 는 해당 주의 날짜를 구합니다. 여기서 1은 월요일 입니다. 
        // ex.
        // 0: 일요일, 1: 월요일, 2: 화요일
        // moment().day("Monday") 로 사용할 수 도 있습니다.
        //
        // moment().add({Number}, 'days') {Number}의 날짜만큼 이동합니다.
        // ex. 
        // moment().add(1, 'days') : 내일
        // moment().add(-1, 'days') : 어제

        // 가정: 해당 주가 이번주 일때에는 마지막 날짜는 오늘 날짜로 하겠다
        if (week === 0 || !week) {
            weekDayEnd = moment().format('YYYY-MM-DD');
        } else {
            weekDayEnd = moment(weekDayStart).add(6, 'days').format('YYYY-MM-DD');
            // moment().add(6, 'days') : 6일 후
        }

        return [weekDayStart, weekDayEnd];

    }


} //exports.Init = function (g_G)