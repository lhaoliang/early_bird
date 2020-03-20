var config = {
    // 线上
    // server: "https://admin.anasit.com",
    // source: "https://admin.anasit.com/",

    server: "https://znapi.anasit.com",
    source: "https://znapi.anasit.com/",

    // 赵
    // server: "http://192.168.1.148:8087",
    // source: "http://192.168.1.148:8087/"

    // 童 
    // server: "http://192.168.0.194:88",
    // source: "http://192.168.0.194:88/"

}

var requester = {
    url: function(url, success, check = true) {
        wx.request({
            method: 'GET',
            url: getUrl(url),
            header: this.getHeader(),
            success: function(res) {
                success = success || function() {}
                res.statusCode == 200 ? interseptor(success, res.data, check) : showRequestError
                if (res.statusCode == 401) {
                    clearToken()
                }
            },
            fail: function(res) {
                if (res.statusCode == 401) {
                    clearToken()
                } else {
                    showRequestError()
                }
            }
        })
    },
    get: function(url, params, success, check = true) {
        wx.request({
            method: 'GET',
            url: getUrl(url, params),
            header: this.getHeader(),
            success: function(res) {
                success = success || function() {}
                res.statusCode == 200 ? interseptor(success, res.data, check) : showRequestError
                if (res.statusCode == 401) {
                    clearToken()
                }
            },
            fail: function(res) {
                if (res.statusCode == 401) {
                    clearToken()
                } else {
                    showRequestError()
                }
            }
        })
    },
    post: function(url, params, success, check = true) {
        wx.request({
            method: 'POST',
            data: params,
            url: getUrl(url),
            header: this.getHeader(),
            success: function(res) {
                success = success || function() {}
                res.statusCode == 200 ? interseptor(success, res.data, check) : showRequestError
                if (res.statusCode == 401) {
                    clearToken()
                }
            },
            fail: function(res) {
                if (res.statusCode == 401) {
                    clearToken()
                } else {
                    showRequestError()
                }
            }
        })
    },
    delete: function(url, params, success, check = true) {
        wx.request({
            method: 'DELETE',
            url: getUrl(url, params),
            header: this.getHeader(),
            success: function(res) {
                success = success || function() {}
                res.statusCode == 200 ? interseptor(success, res.data, check) : showRequestError
                if (res.statusCode == 401) {
                    clearToken()
                }
            },
            fail: function(res) {
                if (res.statusCode == 401) {
                    clearToken()
                } else {
                    showRequestError()
                }
            }
        })
    },
    put: function(url, params, success, check = true) {
        wx.request({
            method: 'PUT',
            data: params,
            url: getUrl(url),
            header: this.getHeader(),
            success: function(res) {
                success = success || function() {}
                res.statusCode == 200 ? interseptor(success, res.data, check) : showRequestError
                if (res.statusCode == 401) {
                    clearToken()
                }
            },
            fail: function(res) {
                if (res.statusCode == 401) {
                    clearToken()
                } else {
                    showRequestError()
                }
            }
        })
    },
    getToken: function() {
        var params = []
        // params['token'] = wx.getStorageSync('token') || ''
        // params['loginid'] = wx.getStorageSync('loginid') || 0
        params['ng-params-one'] = wx.getStorageSync('ng-params-one') || ''
        params['ng-params-two'] = wx.getStorageSync('ng-params-two') || ''
        params['ng-params-three'] = wx.getStorageSync('ng-params-three') || ''
        return params
    },
    setToken: function(params) {
        wx.setStorageSync('token', params.token)
        wx.setStorageSync('loginid', params.loginid)
    },
    getHeader: function() {
        var params = this.getToken();
        return {
            'ng-params-one': params['ng-params-one'],
            'ng-params-two': params['ng-params-two'],
            'ng-params-three': params['ng-params-three']
        }
    },
    checkLogin: function(success, error) {
        var params = this.getToken()
        if (!params['ng-params-three']) {
            typeof error == "function" && error()
        } else {
            typeof success == "function" && success()
        }
    },
    getUserInfo: function(cb) {
        wx.getUserInfo({
            withCredentials: false,
            success: function(res) {
                typeof cb == "function" && cb(res.userInfo)
            },
            fail: function(res) {
                wx.showModal({
                    title: '警告',
                    showCancel: false,
                    content: '您拒绝了授权登陆，目前将无法使用我们的小程序。但后期仍可正常使用小程序，需要在微信【发现】-【小程序】-删掉，重新搜索并授权登陆，方可使用。',
                    confirmText: '我已确认',
                })
            }
        })
    }
}

function interseptor(success, data, check) {
    if (check && !data.result) {
        wx.showToast({
            title: data.message,
            duration: 1200,
            icon: "none"
        })
    } else {
        success(data);
    }
}

function parseParams(json) {
    var query = []
    for (var key in json) {
        query.push(key + "=" + json[key])
    }
    return query.join('&')
}

function getUrl(url, params) {
    params = params || ""
    var paramsStr = parseParams(params)
    return config.server + url + (paramsStr == '' ? paramsStr : '?' + paramsStr);
}

function showRequestError() {
    wx.showToast({
        title: '网络异常',
        duration: 1500,
        icon: 'none'
    })
}

function clearToken() {
    wx.showToast({
        title: '获取失败，请重新授权',
        duration: 1500,
        icon: 'none'
    });
    wx.redirectTo({
        url: '/page/common/pages/authorization/authorization'
    })
}
// 秒转成时分秒
function timeFormat(time) {
    if (time <= 0) {
        time = 0;
    }
    var hours = parseInt(time / 3600);
    hours = hours >= 10 ? hours : ('0' + hours);
    time = time % 3600;
    var munites = parseInt(time / 60);
    munites = munites >= 10 ? munites : ('0' + munites);
    time = time % 60;
    time = time >= 10 ? time : ('0' + time)
    return hours + ':' + munites + ':' + time;
}
// 秒转成时分秒
function timeToArray(time) {
    if (time <= 0) {
        time = 0;
    }
    var hours = parseInt(time / 3600);
    hours = hours >= 10 ? hours : ('0' + hours);
    time = time % 3600;
    var munites = parseInt(time / 60);
    munites = munites >= 10 ? munites : ('0' + munites);
    time = time % 60;
    time = time >= 10 ? time : ('0' + time)
    return [hours, munites, time];
}

// 获取提货时间
function getRecieveTime(time) {
    if (!time) {
        time = new Date().getTime();
    }
    let day = new Date(time + 1000 * 60 * 60 * 24 * 3);
    return `${day.getMonth() + 1}月${day.getDate()}日`;
}

module.exports = {
    getUrl: getUrl,
    requester: requester,
    config: config,
    timeFormat: timeFormat,
    timeToArray: timeToArray,
    getRecieveTime: getRecieveTime
}