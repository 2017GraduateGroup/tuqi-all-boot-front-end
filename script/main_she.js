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
                "sAjaxSource": 'http://localhost:8088/programme/queryProgramme.do?userId=' + sessionUserId,
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
                        "sPrevious": "前一页",
                        "sNext": "下一页"
                    }
                },
                "aoColumns": [
                    { "mDataProp": "programmeid" },
                    { "mDataProp": "content" },
                    { "mDataProp": "programmeTime" },
                    { "mDataProp": "programmeid" },
                ],
                aoColumnDefs: [
                     {
                         "aTargets": [3],
                         "mRender": function (data, type, full) { // 返回自定义内容
                             return '<a class="userManagmentEdit" data-id="' + data + '"  data-toggle="modal" data-target="#UPAddUserForm"><i class="icon icon-pencil"></i>编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class="userManagmentEdit" data-id="' + data + '"  data-toggle="modal" data-target="#confirmModal"><i class="icon icon-trash"></i>删除</a>';
                         }
                     },
                     {
                         "aTargets": [1],
                         "mRender": function (data) {
                             return function () {
                                 if (data.length >= 10) {
                                     return data.substring(0,10) + '...';
                                 } else {
                                     return data
                                 }
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
            var paraGender = $('#gender input[name="sex"]:checked').val();
            var paraStatus = $('#status input[name="radioStatus"]:checked').val();
            console.log(paraGender, paraStatus);
            console.log(paraGender == undefined);
            if (paraGender == undefined || paraGender == '' || paraGender == null) {
                paraGender = 2;
            }
            if (paraStatus == undefined || paraStatus == '' || paraStatus == null) {
                paraStatus = 0;
            }

            console.log(Id)
            if (Id) {
                para = { "programmeId": Id, "content": $("#sheContent").val() };
            } else {               
                para = { "userId": sessionUserId, "programmeTime": $("#sheTime").val(), "content": $("#sheContent").val(), "programmeType": $('#sheType').val() };
            }

            if (para.content == '') {
                console.log(para)
                $('.alert-error')[0].style.display = 'block';
                return validFlag = false;
            } else {
                validFlag = true;
            }
            
            // validFlag = validFlag && CommonMoudule.Validate.isEmail(para.email);
        }

    };

}();

$(document).ready(function () {
    $.fn.dataTableExt.sErrMode = 'throw';
    userManagment.init();
    $("#userManagment").on("click", ".userManagmentEdit", function (e) {

        $('.alert-error')[0].style.display = 'none';
        $('.alert-success')[0].style.display = 'none';
        $("#UPFormTitle").html("编辑日程");
        $('#ID').parent().parent().css('display', 'block');
        var rData = userManagment.oTable().fnGetData($(e.target).parents("tr")[0]);
        console.log(rData.programmeid)
        $("#ID").val(rData.programmeid);
        $("#sheTime").val(rData.programmeTime);
        $("#sheContent").val(rData.content);
        $("#sheType").val(rData.programTypeId);
        // console.log(rData.Gender)
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


    //click add/update confirm btn 
    $("#addUPButton").click(function (e) {
        if ($("#ID").val()) {
            userManagment.CheckFromValidation(validFlag, $("#ID").val());
        } else {
            userManagment.CheckFromValidation(validFlag);
        }
        console.log(validFlag);
        if (validFlag == true) {
            console.log(typeof validFlag, validFlag);
            $('.alert-error')[0].style.display = 'none';
            $('.alert-success')[0].style.display = 'block';
            if (para.programmeId) {
                userManagment.AddUser(para, 'http://localhost:8088/programme/updateProgramme.do');
            } else {
                userManagment.AddUser(para, 'http://localhost:8088/programme/addProgramme.do');
            }
        } else {
            $('.alert-error')[0].style.display = 'block';
            $('.alert-success')[0].style.display = 'none';
        }

        e.preventDefault ? e.preventDefault() : e.returnValue = false;

    });

    // add new or update 
    $("#addNewUser").on("click", function () {
        $('#ID').parent().parent().css('display', 'none');
        $('.alert-error')[0].style.display = 'none';
        $('.alert-success')[0].style.display = 'none';
        $("#ID").val("");
        $("#sheTime").val("");
        $("#sheType").val("");
        $("#sheContent").val("");
        $("#UPFormTitle").html("增加新的日程");
    });

    //get current click programid
    $("#userManagment").on("click", ".userManagmentEdit", function (e) {
        var rData = userManagment.oTable().fnGetData($(e.target).parents("tr")[0]);
        currentDelId = rData.programmeid;
    })

    //confirm click btn
    $("#confirmModal").on('click', '.confirm', function() {
        $.ajax({
            url: 'http://localhost:8088/programme/deleteProgramme.do',
            type: 'POST',
            data: { "programmeId": currentDelId },
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