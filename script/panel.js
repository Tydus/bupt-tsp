/*
 * Panel logic
 */

(function($){

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


    // Setup logout button
    $("#logout").click(logout);

    // professor add subject
    ajaxSubmit($("#addSubjectForm"), function() {
        postJson({
            url : "/add",
            data : $("#addSubjectForm").serialize(),
            callback : function(obj) {
                if (obj.err) {
                    $("#addSubjectAlertText").addClass("alert-error");
                    $("#addSubjectAlertText").text(obj.err);
                    $("#addSubjectAlert").show("fast");
                } else {
                    $("#addSubjectAlertText").removeClass("alert-error");
                    $("#addSubjectAlertText").text("成功");
                    $("#addSubjectAlert").show("fast");
                }
            },
            error : function() {
                $("#addSubjectAlertText").addClass("alert-error");
                $("#addSubjectAlertText").text("系统或网络异常);
                $("#addSubjectAlert").show("fast");
            }
        });
    });


    ajaxSubmit($("#phaseControl"), function() {
        // Dummy
    });


})($);
