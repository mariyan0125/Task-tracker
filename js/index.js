//==== EVENT LISTENERS ====
$(function (){
  const _host = "https://quiet-meadow-81492.herokuapp.com/";
  const socket = io.connect(_host);
  let userName = "Mr.X";
  let tasklist = [];
  
  

    $("#btn_login").click(function(e){
      e.preventDefault();
      userName = $('#user').val();       
      socket.emit('app users', userName, function(user){
        if(user){
          $('#users').hide();
          $('#generalgr').hide();
          $('img').show();
          $('#task').show();
        }
      });
        $('#user').val('');  
        if(user){ 
        let uName = document.getElementById("uname"); 
        uName.innerHTML='Welcome '+ userName + '!'; 
        }else{
          uName.innerHTML="";
        }   
    });
     
    $('#img').on('change', function(){
      if (this.files && this.files[0]) {
          let img = document.querySelector('img');  // $('img')[0]
          img.src = URL.createObjectURL(this.files[0]); // set src to file url
      }
    });
 

    $('#btn_leave').click(function(e){
      e.preventDefault();
      let userLeft = userName + ' has left the app';
      $('.form_task_text').val('You have left the app!');
      socket.emit('hasLeft', userLeft);
      socket.disconnect();
      
      let uName = document.getElementById("uname"); 
        uName.innerHTML='See you soon '+ userName + '  :)';  
       $('.form_task_button').hide(); 
       $('.item').hide();
       $('img').hide();
    });
    
    let addEventRemove = function(){
      let listRmtask = document.getElementsByClassName("task_remove");
      for(let i = 0; i < listRmtask.length; i++){
        listRmtask[i].addEventListener("click", function(e) {
          e.preventDefault();
          tasklist.splice( e.target.id, 1 );
          let tasklistHtml = tasklist.length === 0 ? "Task list is empty ..." : "" ;
          for(let i = 0; i < tasklist.length;i++){
            tasklistHtml += '<li class="item"><a class="task_remove" href="" title="Delete task" id="'+ i +'"> Done </a> - '+ tasklist[i] + '</li>';
          }
          document.querySelector(".tasklist ul").innerHTML = tasklistHtml;
          addEventRemove();
          socket.emit("remove", e.target.id);
        });
      }
    }

    document.getElementsByClassName("form_task_button")[0].addEventListener("click", (e) => {
      e.preventDefault();
      let inputTxt = document.getElementsByClassName("form_task_text")[0];
      let uName = userName;
      socket.emit("add", inputTxt.value + ' by: ' + uName);
      if(tasklist.length === 0 ){
        document.querySelector(".tasklist ul").innerHTML = "";
      }
      tasklist.push(inputTxt.value);

      let tasklistTxt = document.querySelector(".tasklist ul");
      tasklistTxt.innerHTML += '<li class="item"><a class="task_remove" href="" title="Delete task" id="'+ (tasklist.length-1) +'"> Done </a> - <span></span>' + ' by: ' + uName + '</li>' ;
      tasklistTxt.getElementsByTagName("span")[tasklist.length-1].innerText = tasklist[tasklist.length-1];

      inputTxt.value = "";
      addEventRemove();

    });


 //===========SOCKET LISTENERS HERE============

    socket.on('app users', function(user){
      $('#loggedin_users').append($('<li>').text(user));
    });

    socket.on('hasLeft', function(userLeft){
        $('#loggedin_users').append($('<li>').text(userLeft)); 
      });
  



    socket.on("tasklist" , (p_tasklist) => {
      tasklist = p_tasklist;

      let tasklistHtml = tasklist.length > 0 ? "" : " Task list is empty ...";
      for(let i = 0; i < tasklist.length;i++){
        tasklistHtml += '<li class="item"><a class="task_remove" href="" title="Delete task" id="' + i + '"> Done </a> - <span>' + tasklist[i] + '</span></li>';
      }
      document.querySelector(".tasklist ul").innerHTML = tasklistHtml;
      addEventRemove();

    });

    socket.on("add", (p_task) => {
      if(tasklist.length === 0){
        document.querySelector(".tasklist ul").innerHTML = "";
      }
      tasklist.push(p_task);
      document.querySelector(".tasklist ul").innerHTML += '<li class="item"><a class="task_remove" href="" title="Delete task" id="'+(tasklist.length-1) + '"> Done </a> - <span>'+tasklist[tasklist.length-1] + '</span></li>' ;
      addEventRemove();
    });

    socket.on("remove", (p_id) => {
      if(p_id >= 0 && p_id < tasklist.length){
        tasklist.splice( p_id, 1 );

        let tasklistHtml = tasklist.length === 0 ? "Task list is empty ..." : "" ;

        for(let i = 0; i < tasklist.length;i++){
          tasklistHtml += '<li class="item"><a class="task_remove" href="" title="Delete task" id="' + i + '"> Done </a> - '+ tasklist[i]+'</li>';
        }
        document.querySelector(".tasklist ul").innerHTML = tasklistHtml;
        addEventRemove();
      }
    });

});