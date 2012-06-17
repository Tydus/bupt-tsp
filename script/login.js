
;(function($){
    $(".close").click(function(){
        $(".alert").hide("fast");
    });
	ajaxSubmit($("#loginForm"), function(){
        var username = $("#username").val();
        var password = $("#password").val();
        var hash = $.sha1(password+$.sha1(username));
        var postData = "username="
            + encodeURIComponent(username)
            + "&password="
            + encodeURIComponent(hash);

		postJson({
			url : "/login",
			data : postData,
			callback : function(obj){
				if (obj.err) {
					$("#alertText").text(obj.err);
                    $(".alert").show("fast");
				} else {
					location.href = "/panel.html";
				}
			},
			error : function() {
				$("#alertText").text("系统异常，请检查您的网络连接或联系管理员");
                $(".alert").show("fast");
			}
		});
	});

})($);
