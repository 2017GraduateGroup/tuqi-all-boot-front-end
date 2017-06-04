$(document).ready(function() {
		 App.init();
		 $('.input-icon input').unbind();
		 $('#loginBtn').unbind();

		  Login.init();
		  var _gaq = _gaq || [];  _gaq.push(['_setAccount', 'UA-37564768-1']);  _gaq.push(['_setDomainName', 'keenthemes.com']);  _gaq.push(['_setAllowLinker', true]);  _gaq.push(['_trackPageview']);  (function() {    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;    ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);  })();

		  console.log('ready')
		  $('#loginBtn').click(function() {
		  	var lUserName = $('#username').val(),
		  		lPassword = $('#password').val();
		  	var para = { 'usernameInput': lUserName, 'passwdInput': lPassword };
		  	$.ajax({
		  		url: 'http://localhost:8088/user/userLogin',
		  		data: para,
		  		type: "POST",
		  		datetype: "json",
		  		success: function(returnData) {
		  			console.log(returnData);
		  			if(returnData.code == 1) {
		  				sessionStorage.setItem('userId', returnData.data);
		  				window.location = 'index.html'
		  			} else if (returnData == 0) {

		  			}
		  		},
		  		error: function(errorData) {
		  			console.log(errorData);
		  		}
		  	})
		  })
})