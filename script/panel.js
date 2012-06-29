/*
 * Panel logic
 */

(function($){

    $("div.alert a.close").each(function(i, x){
        $(x).click(function(){
            $(x).parent().hide("fast");
        });
    });

    var phaseText = function(num) {
    }

    var enableClass = function(type) {
        $("."+type).removeClass("hide");
    }


	var logout = function() {
		// Error occured, so clear the cookie and redirect to login.html

		$.cookie("username");
		$.cookie("identity");

		location.href = "/login.html";
	}

	// Check cookie to confirm user session

	if (!$.cookie("username") && !$.cookie("identity")) {
		logout();
	} else {
        var identity = $.cookie("identity");
        if (identity == "student"
            || identity == "professor"
            || identity == "admin") {
            enableClass(identity);
        } else {
            logout();
        }
    }

	getJson({
		url : "/profile",
		error : logout,
		callback : function(obj){

			if (obj.err) {
				alert(obj.err);
				logout();
			}

            for (var attr in obj) {
                $(".profile-" + attr).text(obj[attr]);
            }

		}
	});

    var updatePhase = function(){
        getJson({
            url : "/phase",
            callback : function(obj) {
                $(".phase-prev").text(obj.phase-1);
                $(".phase-current").text(obj.phase);
                $(".phase-next").text(obj.phase+1);
            }
        });
    }

    updatePhase();


    // Setup logout button
    $("#logout").click(logout);

    var alertInternalError = function(alertElement, alertTextElement) {
        alertFailure(alertElement, alertTextElement, "系统或网络异常");
    }

    var alertSuccess = function(alertElement, alertTextElement, text) {
        alertElement.removeClass("alert-error");
        alertTextElement.text(text);
        alertElement.show("fast");
    }

    var alertFailure = function(alertElement, alertTextElement, text) {
        alertElement.addClass("alert-error");
        alertTextElement.text(text);
        alertElement.show("fast");
    }

    // Change password logic
    ajaxSubmit($("#changePasswordForm"), function() {
        var username = $.cookie('username');
        var oldPassword = $("#oldPassword").val();
        var newPassword = $("#newPassword").val();
        var confirmPassword = $("#confirmPassword").val();

        if (newPassword != confirmPassword) {
            alertFailure($("#changePasswordAlert"),
                $("#changePasswordAlertText"),
                "两次输入密码不一致");
            return;
        }

        var oldHash = $.sha1(oldPassword + $.sha1(username));
        var newHash = $.sha1(newPassword = $.sha1(username));
        var postData = "password="
                    + encodeURIComponent(oldPassword)
                    + "&new_password="
                    + encodeURIComponent(newPassword);

        postJson({
            url : "/chpasswd",
            data : postData,
            callback : function(obj) {
                if (obj.err) {
                    alertFailure($("#changePasswordAlert"),
                        $("#changePasswordAlertText"),
                        obj.err);
                } else {
                    alertSuccess($("#changePasswordAlert"),
                        $("#changePasswordAlertText"),
                        "修改成功");
                }
            },
            error : function(obj) {
                alertInternalError($("#changePasswordAlert"),
                    $("#changePasswordAlertText"));
            }

        });
    });

    // professor add subject
    ajaxSubmit($("#addSubjectForm"), function() {
        postJson({
            url : "/add",
            data : $("#addSubjectForm").serialize(),
            callback : function(obj) {
                if (obj.err) {
                    alertFailure($("#addSubjectAlert"), $("#addSubjectAlertText"), obj.err);
                } else {
                    alertSuccess($("#addSubjectAlert"), $("#addSubjectAlertText"), "成功添加课题");
                }
            },
            error : function() {
                alertInternalError($("#addSubjectAlert"), $("#addSubjectAlertText"));
            }
        });
    });


    ajaxSubmit($("#phaseControl"), function() {
        postJson({
            url : "/phase",
            data : "",
            callback : function(obj) {
                if (obj.err) {
                    alertFailure($("#phaseControlAlert"), $("#phaseControlAlertText"), obj.err);
                } else {
                    alertSuccess($("#phaseControlAlert"), $("#phaseControlAlertText"), "成功进入下一阶段");
                }
            },
            error : function(obj) {
                alertInternalError($("#phaseControlAlert"), $("#phaseControlAlertText"));
            }
        });
    });


})($);
