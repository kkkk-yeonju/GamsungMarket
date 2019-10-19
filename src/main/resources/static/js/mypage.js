$(function() {
	// 프로필 이미지를 클릭하면 input[type=file] 창이 뜨게 하는 이벤트 리스너 등록
	$('#profileImgIcon').on("click", function(e){
		$('#profileImgFile').trigger("click");
	});
	
	// 프로필 사진이 등록되면 이를 감지하여 프로필 사진을 전송
	$("#profileImgFile").on("change", function(e){
		e.preventDefault();
		submitProfileImage();
	});
	
	//소개글 수정 아이콘 눌렀을 때
	$('#update').on("click", function(e){
		
		var introduction = $(this).attr('data-introduction');
		$('#intro_view').empty();
		$('#intro_view').html('<textarea class="checkout_input col-8 h-100" id="intro" name="introduction">'+introduction+'</textarea>\
				<div class="button col-2" onclick="javascript:introduction();"><a href="#">수정</a></div>');
		$(this).remove();
	});
	
	/*별점*/
	
	$('.starRev span').click(function() {
		$(this).parent().children('span').removeClass('on');
		$(this).addClass('on').prevAll('span').addClass('on');
		$("#rating").val($(this).attr('data-star'));
		return false;
	});

});

/*찜하기*/
function heart(productno){
	//var heart_cnt = Number($("#heart_count").text());
	$.ajax({
		url:"/product/heart",
		methods:"get",
		data:{productNo : productno},
		success:function(data, status, xhr){
			 if(data == "success") {
				 //heart_cnt =heart_cnt+1;
	             $('#heart'+productno).attr("class","fa fa-heart");    
	             $("#heart_count").text(Number($("#heart_count").text())+1);
	         }else if(data == "removeheart"){
				 //heart_cnt =heart_cnt-1;
	             $('#heart'+productno).attr("class","fa fa-heart-o");
	             $("#heart_count").text(Number($("#heart_count").text())-1 );
	         }else if(data == "error"){
	        	 alert("로그인 후 이용가능합니다.");
	         }
		},
		error:function(status, xhr, err){
			alert("찜 할 수 없습니다.\n" + err);
		}
	});
}

//프로필 이미지를 ajax로 전송
//jpg, jpeg, png, gif, bmp포맷만 등록이 가능하도록 제한해야 한다.
function submitProfileImage(){
	var profileImgFile = document.querySelector("#profileImgFile").files[0];
	var formData = new FormData();
	//폼 객체에 파일추가, append("변수명", 값)
	formData.append("profileImgFile", profileImgFile);
	
	$.ajax({
		type: "post",
		url: "/member/mypage/fileUpload",
		contentType: false,
		dataType: "text",
		processData: false,
		data: formData,
		success: function(data, resp){
			//통신 성공
			$(".profile").attr('src','/files/profile-files/'+ data);
		}, error:function(resp){
			alert("통신 실패...");
		}
	});
}

/*소개글*/
function introduction(){
	var formData = $("#introduction").serialize();
	var intro = $('#intro').val();
	$.ajax({
		url:"/member/mypage/introduction",
		methods:"post",
		data:formData,
		success:function(data, status, xhr){
			$("#intro_div").empty();
			$("#intro_div").html('<i id="update" class="fa fa-edit col-2" data-introduction="'+data+'"></i>\
					<div id="intro_view" class="col-8 row">'+intro+'</div>');
				
			alert("수정성공!");
		},
		error:function(status, xhr, err){
			alert("수정할 수 없습니다.\n" + err);
		}
	});
}

/* **********************************************
 * 						chat
 * **********************************************/
$(function(){
	function nowTime(now){
	    var year= now.getFullYear();
	    var mon = (now.getMonth()+1)>9 ? ''+(now.getMonth()+1) : '0'+(now.getMonth()+1);
	    var day = now.getDate()>9 ? ''+now.getDate() : '0'+now.getDate();
	    var ampm = now.getHours() < 12 ? "오전" : "오후";
	    
	    return year + '-' + mon + '-' + day +' ' + ampm + ' ' + now.getHours() + ':' +now.getMinutes();
	}
	
	//소켓서버 접속, 정보셋팅, 응답 fn 정의
	connect(function(obj){//발신
		$('#greetings').append(
				'<div class="row py-3 justify-content-end">\
					<div>\
						<div class="contents">'+obj.contents+'</div><span>'+nowTime(new Date())+'</span>\
					</div>\
				</div>');	
		$('#contents').val('');
	},function(obj){//수신
		$('#greetings').append(
				'<div class="row py-3 justify-content-start">\
					<img class="profile col-2" src="/files/profile-files/'+receiverProfile+'">\
					<div>\
						<div>'+obj.senderNickName+'</div><div class="contents">'+obj.contents+'</div><span>'+nowTime(new Date())+'</span>\
					</div>\
				</div>');	
		$('#contents').val('');
	});
	
	$('#send').click(function(){//메세지 전송
		sendContent($('#contents').val());
	});
});

//채팅창 팝업
function chatpop(){
	var seller = $('.seller').attr('value');	
    window.open('/member/chatting/'+seller,'popName',
                'width=600,height=700,top=100,left=100,toolbar=no,menubar=no,scrollbars=no,resizable=no,status=no');    
}

var senderNickName = $("#senderNickName").val();
var receiverProfile = $("#profile").val();
var currentId = $("#currentId").val();

function connect(sendfn, receivefn){
	var socket = new SockJS('http://192.168.35.69:8088/websocket'); //실행하는 서버 ip주소로 변경해야 웹소켓 가능
	stompClient = Stomp.over(socket);
	stompClient.connect({},function(frame){
		console.log('Connected : '+frame);
		stompClient.subscribe('/topic/receive', function(obj){
			if(JSON.parse(obj.body).sender==currentId){//발신
				console.log(JSON.parse(obj.body).sender+" / "+currentId);
				sendfn(JSON.parse(obj.body));
			}else{//수신
				console.log(JSON.parse(obj.body).sender+" / "+currentId);
				receivefn(JSON.parse(obj.body));
			}
		});
	});
}

function sendContent(contents){
	var query={}
	query.senderNickName=senderNickName;
	query.sender=$("#senderId").val();
	query.receiverNickName=$("#receiverNickName").val();
	query.receiver=$("#receiverId").val();
	query.contents = contents;
	
	stompClient.send('/app/receive',{}, JSON.stringify(query));
}
