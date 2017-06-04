$(document).ready(function() {

		  App.init();

		  Login.init();
		  var _gaq = _gaq || [];  _gaq.push(['_setAccount', 'UA-37564768-1']);  _gaq.push(['_setDomainName', 'keenthemes.com']);  _gaq.push(['_setAllowLinker', true]);  _gaq.push(['_trackPageview']);  (function() {    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;    ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);  })();

		  $('#resetRegister').click(function() {
		  	$('#rUsername').val("");
		  	$('#rNickname').val("");
		  	$('#rPassword').val("");
		  	$('#rRepassword').val("");
		  	$('#position').val("");
		  });

		  console.log('ready')
		  $('#register').click(function() {
		  	var para = { 'rUsername': $('#rUsername').val(), 'rPasswd': $('#rNickname').val(), "rNickname": $('#rPassword').val(), "rPosition": $('#position').val() };
		  	$.ajax({
		  		url: 'http://localhost:8088/user/userRegister',
		  		data: para,
		  		type: "POST",
		  		datetype: "json",
		  		success: function(returnData) {
		  			if(returnData == 1) {
		  				window.location = "login_soft.html"
		  			} else if(returnData == 0) {
		  				alert('register failed. has the same nicekname');
		  			}
		  		},
		  		error: function(errorData) {
		  			console.log(errorData);
		  		}
		  	})
		  })
})