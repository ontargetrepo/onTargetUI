/**
 * Created by aashiskhanal on 10/09/15.
 */
define(function(require) {
    'use strict';
    var angular = require('angular');
    var controller = ['$scope', '$rootScope', '$q', 'onBIMFactory', '$modal', 'storage', '$stateParams', '$location', 'appConstant', '$filter', 'utilFactory', '$sce', '$window',
        function($scope, $rootScope, $q, onBIMFactory, $modal, storage, $stateParams, $location, appConstant, $filter, utilFactory, $sce, $window) {
            $scope.app = appConstant.app;
            $scope.isLoading = false;
            $scope.viewMode = "list";

            $scope.isPreview = angular.isDefined($stateParams.docId);

            $scope.selectedDoc = null;

          /*======================================================================*/
          var Global = {};

          // https://github.com/rgrove/lazyload
          LazyLoad=function(k){function p(b,a){var g=k.createElement(b),c;for(c in a)a.hasOwnProperty(c)&&g.setAttribute(c,a[c]);return g}function l(b){var a=m[b],c,f;if(a)c=a.callback,f=a.urls,f.shift(),h=0,f.length||(c&&c.call(a.context,a.obj),m[b]=null,n[b].length&&j(b))}function w(){var b=navigator.userAgent;c={async:k.createElement("script").async===!0};(c.webkit=/AppleWebKit\//.test(b))||(c.ie=/MSIE/.test(b))||(c.opera=/Opera/.test(b))||(c.gecko=/Gecko\//.test(b))||(c.unknown=!0)}function j(b,a,g,f,h){var j=
            function(){l(b)},o=b==="css",q=[],d,i,e,r;c||w();if(a)if(a=typeof a==="string"?[a]:a.concat(),o||c.async||c.gecko||c.opera)n[b].push({urls:a,callback:g,obj:f,context:h});else{d=0;for(i=a.length;d<i;++d)n[b].push({urls:[a[d]],callback:d===i-1?g:null,obj:f,context:h})}if(!m[b]&&(r=m[b]=n[b].shift())){s||(s=k.head||k.getElementsByTagName("head")[0]);a=r.urls;d=0;for(i=a.length;d<i;++d)g=a[d],o?e=c.gecko?p("style"):p("link",{href:g,rel:"stylesheet"}):(e=p("script",{src:g}),e.async=!1),e.className="lazyload",
            e.setAttribute("charset","utf-8"),c.ie&&!o?e.onreadystatechange=function(){if(/loaded|complete/.test(e.readyState))e.onreadystatechange=null,j()}:o&&(c.gecko||c.webkit)?c.webkit?(r.urls[d]=e.href,t()):(e.innerHTML='@import "'+g+'";',u(e)):e.onload=e.onerror=j,q.push(e);d=0;for(i=q.length;d<i;++d)s.appendChild(q[d])}}function u(b){var a;try{a=!!b.sheet.cssRules}catch(c){h+=1;h<200?setTimeout(function(){u(b)},50):a&&l("css");return}l("css")}function t(){var b=m.css,a;if(b){for(a=v.length;--a>=0;)if(v[a].href===
            b.urls[0]){l("css");break}h+=1;b&&(h<200?setTimeout(t,50):l("css"))}}var c,s,m={},h=0,n={css:[],js:[]},v=k.styleSheets;return{css:function(b,a,c,f){j("css",b,a,c,f)},js:function(b,a,c,f){j("js",b,a,c,f)}}}(this.document);

          Global.baseDir = new String("http//216.14.121.204:8080" + "/bimviews/");
          if (Global.baseDir.substring(Global.baseDir.length - 5) == ".html") {
            Global.baseDir = Global.baseDir.substring(0, Global.baseDir.lastIndexOf("/"));
          }
          if (Global.baseDir.substring(Global.baseDir.length - 1) != "/") {
            Global.baseDir = Global.baseDir + "/";
          }
          var baseJsDir = Global.baseDir + "js/";
          var baseCssDir = Global.baseDir + "css/";

          var base = document.getElementsByTagName("base");
          base[0].href = Global.baseDir;

          function loadResources() {
            (function() {
              var link = document.createElement('link');
              link.type = 'image/x-icon';
              link.rel = 'shortcut icon';
              link.href = Global.baseDir + 'img/logo_small.png';
              document.getElementsByTagName('head')[0].appendChild(link);
            }());

            LazyLoad.css([
              baseCssDir + "bootstrap.min.css?_v=" + Global.version,
              baseCssDir + "main.css?_v=" + Global.version,
              baseCssDir + "bootstrap-vert-tabs.css?_v=" + Global.version,
              baseCssDir + "magic-bootstrap-min.css?_v=" + Global.version
            ], function(){});

            LazyLoad.js([baseJsDir + "settings.js"], function(){
              var jsToLoad = [
                baseJsDir + "jquery-2.1.0.min.js?_v=" + Global.version,
                baseJsDir + "main.js?_v=" + Global.version,
                baseJsDir + "history.js?_v=" + Global.version,
                baseJsDir + "history.adapter.jquery.js?_v=" + Global.version,
                baseJsDir + "jquery.cookie.js?_v=" + Global.version,
                baseJsDir + "jquery.numeric.js?_v=" + Global.version,
                baseJsDir + "jquery.enterpress.js?_v=" + Global.version,
                baseJsDir + "jquery.ui.widget.js?_v=" + Global.version,
                baseJsDir + "String.js?_v=" + Global.version,
                baseJsDir + "tree.js?_v=" + Global.version,
                baseJsDir + "bimserverapibootstrap.js?_v=" + Global.version,
                baseJsDir + "bootstrap.min.js?_v=" + Global.version,
                baseJsDir + "sha256.js?_v=" + Global.version,
                baseJsDir + "utils.js?_v=" + Global.version,
                baseJsDir + "formatters.js?_v=" + Global.version,
                baseJsDir + "jquery.fileupload.js?_v=" + Global.version,
                baseJsDir + "jquery.scrollto.js?_v=" + Global.version,
                baseJsDir + "pagechanger.js?_v=" + Global.version,
                baseJsDir + "plugins/pluginmanager.js?_v=" + Global.version,
                baseJsDir + "plugins/relaticsplugin.js?_v=" + Global.version,
                baseJsDir + "papaparse.min.js?_v=" + Global.version
              ];

              if (Settings.useBimSurfer()) {
                jsToLoad = jsToLoad.concat([
                  baseJsDir + "bimsurfer/api/BIMSURFER.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/lib/scenejs-4.0/scenejs.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/SceneJS.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Constants.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/ProgressLoader.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Types/Light.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Types/Light/Ambient.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Types/Light/Sun.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Control.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Control/ClickSelect.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Control/LayerList.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Control/ProgressBar.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Control/PickFlyOrbit.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Control/ObjectTreeView.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Events.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/StringView.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/GeometryLoader.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/AsyncStream.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/DataInputStream.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Viewer.js?_v=" + Global.version,
                  baseJsDir + "bimsurfer/api/Util.js?_v=" + Global.version
                ]);
              }

              LazyLoad.js(jsToLoad, function () {
                var othis = this;

                Global.lastKey = null;

                $.ajaxSetup({
                  cache: true
                });

                var jQueryLoad = $.fn.load;
                $.fn.load = function(url, params, callback) {
                  url += "?_v=" + Global.version;
                  return jQueryLoad.apply(this, arguments);
                }

                $("body").on("keyup", function (e) {
                  if (e.target.nodeName == "BODY") {
                    if (e.keyCode == 67 && Global.lastKey == 67) {
                      console.log("Clearing cookies");
                      $.removeCookie("address" + window.document.location.port, {path: "/"});
                      $.removeCookie("username" + window.document.location.port, {path: "/"});
                      $.removeCookie("autologin" + window.document.location.port, {path: "/"});
                      Global.lastKey = null;
                    } else {
                      Global.lastKey = e.keyCode;
                    }
                  }
                });

                othis.loadBimServerApiFromAddress = function(address, successFunction, errorFunction){
                  loadBimServerApi(address, Global.notifier, function(serverInfo){
                    if (serverInfo.serverState == "NOT_SETUP") {
                      $(".indexcontainer").load(Global.baseDir + "setup.html", function(){
                        new Setup(address);
                      });
                    } else if (serverInfo.serverState == "UNDEFINED") {
                    } else if (serverInfo.serverState == "MIGRATION_REQUIRED") {
                      $(".indexcontainer").load(Global.baseDir + "migrate.html", function(){
                        new Migrate(address);
                      });
                    } else if (serverInfo.serverState == "MIGRATION_IMPOSSIBLE") {
                    } else if (serverInfo.serverState == "FATAL_ERROR") {
                    } else if (serverInfo.serverState == "RUNNING") {
                      successFunction(address);
                    }
                  }, function(){
                    errorFunction(address);
                  });
                };

                function load() {
                  $(".sidespan").empty();
                  Global.history = pushInitialState();
                  var notLoggedInFunction = function(address){
                    if (Global.history.page == "Login") {
                      $(".indexcontainer").load(Global.baseDir + "login.html", function(){
                        othis.current = new Login(address);
                      });
                    } else if (Global.history.page == "SelectServer") {
                      $(".indexcontainer").load(Global.baseDir + "selectserver.html", function(){
                        othis.current = new SelectServer(null);
                      });
                    } else if (Global.history.page == "Register") {
                      $(".indexcontainer").load(Global.baseDir + "register.html", function(){
                        othis.current = new Register($(this));
                      });
                    } else if (Global.history.page == "ResetPassword") {
                      $(".indexcontainer").load(Global.baseDir + "resetpassword.html", function(){
                        othis.current = new ResetPassword($(this), null);
                      });
                    } else {
                      $(".indexcontainer").load(Global.baseDir + "login.html", function(){
                        othis.current = new Login(address);
                      });
                    }
                  };

                  var successFunction = function(address){
                    // We do have an API
                    var token = getParameterByName("token");
                    if (token == null) {
                      token = $.cookie("autologin" + window.document.location.port);
                    }
                    if (token != null) {
                      Global.bimServerApi.setToken(token, function(){
                        $(".indexcontainer").load(Global.baseDir + "main.html", function(){
                          $(".indexStatus").hide();
                          othis.current = new Main(Global.bimServerApi.baseUrl, Global.bimServerApi.user.name).show(false);
                        });
                      }, function(){
                        $.removeCookie("autologin" + window.document.location.port);
                        notLoggedInFunction(address);
                      });
                    } else {
                      notLoggedInFunction(address);
                    }
                  };

                  var errorFunction = function(){
                    $.removeCookie("username" + window.document.location.port, {path: "/"});
                    $.removeCookie("autologin" + window.document.location.port, {path: "/"});
                    $.removeCookie("address" + window.document.location.port, {path: "/"});
                  };

                  var address = getParameterByName("address");

                  if (address != null) {
                    othis.loadBimServerApiFromAddress(address, successFunction, errorFunction);
                  } else if ($.cookie("address" + window.document.location.port) != null) {
                    othis.loadBimServerApiFromAddress($.cookie("address" + window.document.location.port), successFunction, errorFunction);
                  } else if (!Settings.allowBimServerAddress()) {
                    Settings.getStaticServerAddress(function(address){
                      if (address != null) {
                        othis.loadBimServerApiFromAddress(address, successFunction, errorFunction);
                      } else {
                        notLoggedInFunction(address);
//				    							$(".indexcontainer").load(Global.baseDir + "selectserver.html", function(){
//				    								new SelectServer();
//				    							});
                      }
                    });
                  } else {
                    // NO API
                    $(".indexcontainer").load(Global.baseDir + "selectserver.html", function(){
                      new SelectServer();
                    });
                  }
                }

                History.Adapter.bind(window, "statechange", function(){
                  if (!pushing) {
                    load();
                  }
                });

                Global.bimServerApi = null;
                Global.objectcache = {};
                Global.timeoutId;

                function Notifier() {
                  var othis = this;

                  this.setSelector = function(selector) {
                    var currentmessage = $(othis.selector).find(".message").html();
                    $(othis.selector).hide();
                    othis.selector = selector;
                    if (currentmessage != "" && currentmessage != undefined) {
                      $(selector).show();
                      $(selector).find(".message").html(currentmessage).parent().addClass("alert-success");
                    } else {
                      $(othis.selector).hide();
                    }
                    $(othis.selector).find(".close").click(othis.clear);
                  };

                  this.clear = function() {
                    $(othis.selector).find(".message").html("").parent().hide();
                  };

                  this.resetStatus = function(){
                    if (othis.lastTimeOut != null) {
                      clearTimeout(othis.lastTimeOut);
                      othis.lastTimeOut = null;
                    }
                    $(othis.selector).stop(true, true);
                    $(othis.selector).fadeOut(1000);
                  };

                  this.resetStatusQuick = function(){
                    if (othis.lastTimeOut != null) {
                      clearTimeout(othis.lastTimeOut);
                      othis.lastTimeOut = null;
                    }
                    $(othis.selector).hide();
                  };

                  this.setSuccess = function(status, timeToShow) {
                    if (timeToShow == null) {
                      timeToShow = 5000;
                    }
                    $(othis.selector).stop(true, true);
                    if (othis.lastTimeOut != null) {
                      clearTimeout(othis.lastTimeOut);
                      othis.lastTimeOut = null;
                    }
                    $(othis.selector).find(".message").html(status).parent().removeClass("initialhide").removeClass("alert-danger").removeClass("alert-info").addClass("alert-success").show();
                    var notifier = this;
                    if (timeToShow != -1) {
                      othis.lastTimeOut = setTimeout(function(){
                        notifier.resetStatus();
                      }, timeToShow);
                    }
                  };

                  this.setInfo = function(status, timeToShow) {
                    if (timeToShow == null) {
                      timeToShow = 5000;
                    }
                    $(othis.selector).stop(true, true);
                    if (othis.lastTimeOut != null) {
                      clearTimeout(othis.lastTimeOut);
                      othis.lastTimeOut = null;
                    }
                    $(othis.selector).find(".message").html(status).parent().show().removeClass("alert-danger").removeClass("alert-success").addClass("alert-info");
                    var notifier = this;
                    if (timeToShow != -1) {
                      othis.lastTimeOut = setTimeout(function(){
                        notifier.resetStatus();
                      }, timeToShow);
                    }
                  };

                  this.setError = function(error) {
                    if (othis.lastTimeOut != null) {
                      clearTimeout(othis.lastTimeOut);
                      othis.lastTimeOut = null;
                    }
                    $(othis.selector).find(".message").html(error).parent().removeClass("alert-info").removeClass("alert-success").addClass("alert-danger").show();
                  };

                  othis.setSelector(".indexStatus .status");
                }

                Global.notifier = new Notifier();

                function loadError() {
                  window.clearTimeout(Global.timeoutId);
                  Global.notifier.error("Could not connect");
                  $.removeCookie("username" + window.document.location.port, {path: "/"});
                  $.removeCookie("autologin" + window.document.location.port, {path: "/"});
                  $.removeCookie("address" + window.document.location.port, {path: "/"});
                  $(".indexcontainer").load(Global.baseDir + "login.html", function(){
                    new Login();
                  });
                }

                setInterval(function() {
                  var now = new Date().getTime();
                  $(".timespan").each(function() {
                    $(this).html(formatTimeSpan(now - $(this).attr("datetime"), false));
                  });
                  $(".duration").each(function() {
                    var start = new Date(parseInt($(this).attr("start")));
                    var end = $(this).attr("end") == null ? new Date() : new Date(parseInt($(this).attr("end")));
                    var diff = end.getTime() - start.getTime();
                    $(this).html(formatDuration(diff, true));
                  });
                }, 1000);

                load();
              }, function (err) {
                console.log(err);
              });
            });
          }

          var myRequest = new XMLHttpRequest();
          myRequest.onreadystatechange = function() {
            if (myRequest.readyState != 4)  {
              return;
            }
            if (myRequest.status != 200)  {
              Global.version = new Date().getTime();
              loadResources();
              return;
            } else {
              Global.version = JSON.parse(myRequest.responseText).version;
              loadResources();
            }
          };
          myRequest.open("GET", Global.baseDir + "plugin.version", true);
          myRequest.send();
          /*======================================================================*/



        }];




    return controller;


});


