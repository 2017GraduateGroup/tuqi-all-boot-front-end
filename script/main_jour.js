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
            // $("#age").inputmask({ "mask": "9", "repeat": 2, "greedy": false });
            oTable = $('#userManagment').dataTable({
                "aLengthMenu": [
                    [5, 15, 20, -1],
                    [5, 15, 20, "All"] // change per page values here
                ],
                // set the initial value
                "iDisplayLength": 10,
                "sAjaxSource": 'http://localhost:8088/dairecord/queryDailyRecord.do?userId=' + sessionUserId,
                "sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
                "sPaginationType": "bootstrap",
                "bServerSide": false,
                "bProcessing": false,
                "sAjaxDataProp": '',
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
                    { "mDataProp": "title" },
                    { "mDataProp": "creatTime" },
                    { "mDataProp": "recordid" },
                ],
                aoColumnDefs: [
                     {
                         "aTargets": [2],
                         "mRender": function (data, type, full) { // 返回自定义内容
                             return '<a class="userManagmentEdit" data-id="' + data + '"  data-toggle="modal" data-target="#UPAddUserForm"><i class="icon icon-pencil"></i>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="userManagmentEdit" data-id="' + data + '"  data-toggle="modal" data-target="#UPAddUserForm"><i class="icon icon-zoom-in"></i>查看</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="userManagmentEdit" data-id="' + data + '"  data-toggle="modal" data-target="#confirmModal"><i class="icon icon-trash"></i>删除</a>';
                         }
                     },
                     // {
                     //     "aTargets": [3],
                     //     "mRender": function (data) {
                     //         console.log(data)
                     //         return function () {
                     //             if (data == 0) {
                     //                 return 'Female'
                     //             } else if (data == 1) {
                     //                 return 'Male'
                     //             } else {
                     //                 return 'Unknow'
                     //             }
                     //         }

                     //     }
                     // },         
                ]
            });
        },

        AddUser: function (para,URL) {
            console.log(para, URL);
            // console.log(typeof para.status)
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
            // var paraGender = $('#gender input[name="sex"]:checked').val();
            // var paraStatus = $('#status input[name="radioStatus"]:checked').val();
            // console.log(paraGender, paraStatus);
            // console.log(paraGender == undefined);
            // if (paraGender == undefined || paraGender == '' || paraGender == null) {
            //     paraGender = 2;
            // }
            // if (paraStatus == undefined || paraStatus == '' || paraStatus == null) {
            //     paraStatus = 0;
            // }

            if (Id) {
                para = { "dailyRecordId": Id, "title": $("#jnlNmae").val(), "content": $("#jnlContent").val(), "remarks": $('#jnlMark').val() };
            } else {               
                para = { "userId": sessionUserId, "title": $("#jnlNmae").val(), "content": $("#jnlContent").val(), "remarks": $('#jnlMark').val() };
            }

            if (para.title == '' || para.content == '' || para.remarks == '' ) {
                console.log(para)
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
    userManagment.init();
    $("#userManagment").on("click", ".userManagmentEdit", function (e) {

        $('.alert-error')[0].style.display = 'none';
        $('.alert-success')[0].style.display = 'none';
        $("#UPFormTitle").html("更新日志");
        $('#ID').parent().parent().css('display', 'block');
        var rData = userManagment.oTable().fnGetData($(e.target).parents("tr")[0]);
        console.log(rData)
        $("#ID").val(rData.recordid);
        $("#jnlNmae").val(rData.title);
        $("#jnlMark").val(rData.remarks);
        $("#jnlContent").val(rData.content);
        // if (rData.Gender == 2) {
        //     $(`#gender input[value=0]`).removeAttr('checked');
        //     $(`#gender input[value=1]`).removeAttr('checked');
        // }
        // $(`#gender input[value=${rData.Gender}]`).attr('checked', true);
        // $("#email").val(rData.Email);
        // if (rData.Status == true) {
        //     $("#status input[value='true']").attr('checked', true);
        // } else {
        //     $("#status input[value='false']").attr('checked', true);
        // }
    });



    $("#addUPButton").click(function (e) {
        if ($("#ID").val()) {
            userManagment.CheckFromValidation(validFlag, $("#ID").val());
        } else {
            userManagment.CheckFromValidation(validFlag);
        }
        console.log(validFlag);
        if (validFlag == true) {
            $('.alert-error')[0].style.display = 'none';
            $('.alert-success')[0].style.display = 'block';
            if (para.dailyRecordId) {
                userManagment.AddUser(para, 'http://localhost:8088/dairecord/updateDailyRecord.do');
            } else {
                userManagment.AddUser(para, 'http://localhost:8088/dairecord/addDailyRecord.do');
            }
        } else {
            $('.alert-error')[0].style.display = 'block';
            $('.alert-success')[0].style.display = 'none';
        }

        e.preventDefault ? e.preventDefault() : e.returnValue = false;

    });

    $("#addNewUser").on("click", function () {
        $('#ID').parent().parent().css('display', 'none');
        $('.alert-error')[0].style.display = 'none';
        $('.alert-success')[0].style.display = 'none';
        $("#ID").val("");
        $("#jnlNmae").val("");
        $("#jnlMark").val("");
        $("#jnlContent").val("");
        $("#UPFormTitle").html("增加新的日志");
    });

    //get current click programid
    $("#userManagment").on("click", ".userManagmentEdit", function (e) {
        var rData = userManagment.oTable().fnGetData($(e.target).parents("tr")[0]);
        console.log(rData)
        currentDelId = rData.recordid;
    })

    //confirm click btn
    $("#confirmModal").on('click', '.confirm', function() {
        $.ajax({
            url: 'http://localhost:8088/dairecord/deleteDailyRecord.do',
            type: 'POST',
            data: { "dailyRecordNum": currentDelId },
            datatype: 'json',
            success: function(returnData) {
                console.log(returnData);
                location.reload();
            },
            error: function(error) {
                console.log(error);
            }
        })
    });


    $('button.close-button').click(function() {
        console.log(1);
        $('.alert-error')[0].style.display = 'none';
    });

})