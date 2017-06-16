var URL_SCHEDUAL_ADD = 'http://localhost:8088/programme/addProgramme.do',
	URL_SCHEDUAL_UPDATE = 'http://localhost:8088/programme/updateProgramme.do',
	URL_SCHEDUAL_DEL = 'http://localhost:8088/programme/deleteProgramme.do',
	URL_SCHEDUAL_GET = 'http://localhost:8088/programme/queryProgramme.do';

var URL_DAILY_ADD = 'http://localhost:8088/dairecord/addDailyRecord.do',
	URL_DAILY_UPDATE = 'http://localhost:8088/dairecord/updateDailyRecord.do',
	URL_DAILY_DEL = 'http://localhost:8088/dairecord/deleteDailyRecord.do',
	URL_DAILY_GET = 'http://localhost:8088/dairecord/queryDailyRecord.do';


var Schedule = function () {
	return {
			init: function() {
			
			},
			PostHandle: function(para, URL) {
				$.ajax({
					url: URL,
					type: 'POST',
					data: para,
					datatype: 'json',
					cache: false,
					success: function(response) {
						console.log(response);
					},
					error: function(error) {
						console.log(error);
					}
				})
			},

			GetHandle: function(URL) {
				$.ajax({
					url: URL,
					type: 'GET',
					datatype: 'json',
					cache: false,
					success: function(response) {
						console.log(response);
						Schedule.bindData(response)
					},
					error: function(error) {
						console.log(error);
					}
				})
			},
			bindData: function(data) {
				for(var item of data) {
					console.log($(`.fc-day[data-date=${item.programmeTime}]`))
					switch(item.programTypeId) {
						case 1:
							item.programTypeId = '普通';
							break;
						case 2:
							item.programTypeId = '出行';
							break;
						case 3:
							item.programTypeId = '会议';
							break;
						case 4:
							item.programTypeId = '约会';
							break;
						case 5:
							item.programTypeId = '纪念日';
							break;
						case 6:
							item.programTypeId = '其他';
							break;
						default: 
							item.programTypeId = 'error';
					}
					$(`.fc-day[data-date=${item.programmeTime}]`).find('.fc-day-content').css({'border':'1px solid orange'}).css({'color':'red', 'cursor':'pointer'});
					$(`.fc-day[data-date=${item.programmeTime}]`).find('.fc-day-content').append(`<p>${item.programTypeId}</p>`);
				}
			}
		}
	}();

$(document).ready(function() {
	var currentUserId = window.sessionStorage.getItem('userId');
	if (!currentUserId) {
		window.scroll = false;
		$('.noLoginMask').css('display', 'block');
		setTimeout(function(){
			window.location = 'login_soft.html';
		},1000)
	}
	Schedule.init();	
	Schedule.GetHandle(URL_SCHEDUAL_GET+ "?userId=" + currentUserId);
	console.log("Ready");
	console.log($('.fc-content'));
	var currentDays = $('.fc-content tbody td:not(.fc-other-month)');
	currentDays.find('.fc-day-number').parent().append('<span data-toggle="modal" data-target="#addSchedule"class="add-item hidden">添加日程</span>');

	currentDays.hover(function() {
		$(this).addClass('th-hover').find('span').removeClass('hidden');
	},function() {
		$(this).removeClass('th-hover').find('span').addClass('hidden');
	})
	console.log($('#addSchedule'));

	//Add Schedule
	$(".add-item").on("click", function() {
		var clickTime = $(this).parent().parent().attr('data-date');
		$('#scheduleTime').val(clickTime);
		$('#scheduleText').val("");
		$('#scheduleType').val("普通");
		console.log($(this).parent().parent().attr('data-date'));
	})

	$("#saveChanges").on("click", function() {
		para = { "userId": currentUserId, "content": $('#scheduleText').val(), "programmeTime": $('#scheduleTime').val(), "programmeType": $('#scheduleType').val() };
		Schedule.PostHandle(para, URL_SCHEDUAL_ADD);
		$('#closeModal').trigger('click');
	})


})