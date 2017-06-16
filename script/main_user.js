var validFlag = true;
var para = {};
var currentDelId = '';
var sessionUserId = sessionStorage.getItem('userId');
var userManagment = function () {
    var oTable = null;
    return {
        oTable: function () {
            return oTable;
        },
        init: function () {
            oTable = $('#userManagment').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 6,
                "sAjaxSource": 'http://localhost:8088/user/queryAllUser',
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "bServerSide": false,
                "bProcessing": false,
                "sAjaxDataProp": 'dataList',
                "bFilter": false,                       //不使用过滤功能   
                "bLengthChange": false,                 //用户不可改变每页显示数量   
                "bPaginate": true,
                "oLanguage": {
                    "sLengthMenu": "_MENU_ records per page",
                    "oPaginate": {
                        "sPrevious": "Prev",
                        "sNext": "Next"
                    }
                },
                "aoColumns": [
                    { "mDataProp": "userId" },
                    { "mDataProp": "userName" },
                    { "mDataProp": "userNickName" },
                    { "mDataProp": "userPositionId" },
                    { "mDataProp": "userPositionId" },
                ],
                aoColumnDefs: [
                     {
                         "aTargets": [4],
                         "mRender": function (data, type, full) { // 返回自定义内容
                             return '<a class="userManagmentEdit" data-id="' + data + '"  data-toggle="modal" data-target="#UPAddUserForm"><i class="icon icon-pencil"></i>修改密码</a>';
                         }
                     },
                     {
                         "aTargets": [3],
                         "mRender": function (data) {
                             console.log(data)
                             switch(data) {
                                case 1:
                                    return '学生';
                                case 2:
                                    return '律师';
                                case 3:
                                    return '警察';
                                case 4:
                                    return '医生';
                                case 5:
                                    return '设计师';
                                case 6:
                                    return '教师';
                                case 7:
                                    return '自由职业者';
                                case 8:
                                    return '其他职业';
                                default:
                                    return '未知身份';
                             }
                         }
                     },         
                ]
            });
        },

         AddUser: function (para, URL) {
            console.log(typeof para.status)
            $.ajax({
                url: URL,
                type: "POST",
                data: para,
                cache: false,
                datatype: "json",
                success: function (response) {
                    $("#UPCloseButton").trigger("click");
                    $("#uusername").val("");
                    $("#password").val("");
                    $("#age").val("");
                    $("#gender").val("");
                    $("#email").val("");
                    $("#status").val("");
                    oTable.fnDraw();
                },
                error: function (err) {
                    console.log(err);
                }
            });
        },

        CheckFromValidation: function (Flag, Id) {
            para = { 'userId': $('#ID').val(), 'password': $('#changePassword').val() }

            if (para.userId == '' || para.password == '') {
                $('.alert-error')[0].style.display = 'block';
                return validFlag = false;
            } else {
                validFlag = true;
            }           
        }

    };

}();

$(document).ready(function () {
    $.fn.dataTableExt.sErrMode = 'throw';

    var currentUserId = window.sessionStorage.getItem('userId');
    if (!currentUserId) {
        window.scroll = false;
        $('.noLoginMask').css('display', 'block');
        setTimeout(function(){
            window.location = 'login_soft.html';
        },1000)
    }
    userManagment.init();
    $("#userManagment").on("click", ".userManagmentEdit", function (e) {

        $('.alert-error')[0].style.display = 'none';
        $('.alert-success')[0].style.display = 'none';
        $("#UPFormTitle").html("修改用户密码");
        $('#ID').parent().parent().css('display', 'block');
        var rData = userManagment.oTable().fnGetData($(e.target).parents("tr")[0]);
        $('#ID').val(rData.userId);
    });

    $("#addUPButton").click(function (e) {
        userManagment.CheckFromValidation(validFlag, $("#ID").val());

        if (validFlag == true) {
            $('.alert-error')[0].style.display = 'none';
            $('.alert-success')[0].style.display = 'block';
            userManagment.AddUser(para, 'http://localhost:8088/user/updateUserInfo');
        } else {
            $('.alert-error')[0].style.display = 'block';
            $('.alert-success')[0].style.display = 'none';
        }

        e.preventDefault ? e.preventDefault() : e.returnValue = false;

    });

    $('button.close-button').click(function() {
        console.log(1);
        $('.alert-error')[0].style.display = 'none';
    });

})