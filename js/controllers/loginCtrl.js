'use strict';

module.exports = ['$http', '$scope', 'apiUrlStart', function($http, $scope, apiUrlStart) {

    var g_G = window.g_G;
    $scope.g_G = g_G;
    $scope.rq = {
        locale: 'ko',
    };

    var loginInfo = Cookies.getJSON('olle_monitor_admin');
    if(loginInfo){
        $scope.rq.email = loginInfo.email;
        $scope.rq.password = loginInfo.password;
    }

    var ret = Cookies.getJSON('eUSER_LOGIN');
    if (ret) {
        g_G.isLogin = true;
        g_G.user = ret.user;
        console.log('eUSER_LOGIN=',ret);
    }
    $scope.clearCookie = function(){
        Cookies.remove('eUSER_LOGIN');
        Cookies.remove('olle_monitor_admin');
        g_G.user = null;
        g_G.isLogin = false;
        $scope.rq = {};
    }

    $scope.send_eUSER_LOGOUT = function() {
        g_G.isLogin = false;
        g_G.user = null;
        Cookies.remove('eUSER_LOGIN');
    }

    $scope.send_eUSER_LOGIN = function() {
        if ($scope.isLogging) return;
        $scope.isLogging = true;
        //g_G.toastr.success('접속을 시도합니다. 기다려 주세요.', rq.email);
        var rq = $scope.rq;
        if (g_G.checkString(rq, 'email')) return;
        if (g_G.checkString(rq, 'password')) return;
        if (rq.password.length < 4) {
            g_G.toastr.error('암호는 4자이상 입력해주세요', '에러');
            return;
        }


        $http.post(g_G.olle_api_url + '/api/v3/eUSER_LOGIN', rq)
            .then(function success(res) {
                var ret = res.data;
                delete $scope.isLogging;
                g_G.log('ret = ', ret);

                if (ret.error) {
                    g_G.toastr.error('접속 실패.', ret.error);
                    g_G.error("eUSER_LOGIN err=", ret.error);
                    return;
                }
                if (ret.user.role != 'admin') return g_G.toastr.error('권한이 없습니다.')

                Cookies.set('olle_monitor_admin', rq, { expires: 1 });
                Cookies.set('eUSER_LOGIN', ret, { expires: 1 });
                g_G.isLogin = true;
                g_G.user = ret.user;
                //window.location = '/#/ollefinder';

            });
    }

}];