$(function() {

    $("#button").click(refreshTaskList);

    function remplirTaches(repjson) {
      console.log(JSON.stringify(repjson));
      $('#taches').empty();
      $('#taches').append($('<ul>'));
      for(task of repjson){
          console.log(task);
          $('#taches ul')
                .append($('<li>')
                .append($('<a>')
                .text(task.name)
                    ).on("click", task, details)
                );
        }
      }

      function onerror(err) {
          $("#taches").html("<b>Impossible de récupérer les taches à réaliser !</b>"+err);
      }

    function refreshTaskList(){
        $("#currenttask").empty();
        requete = "http://127.0.0.1:5000/api/questionnaires";
        fetch(requete)
        .then( response => {
                  if (response.ok) return response.json();
                  else throw new Error('Problème ajax: '+response.status);
                }
            )
        .then(remplirTaches)
        .catch(onerror);
      }


    function details(event){
        $("#currenttask").empty();
        formTask();
        fillFormTask(event.data);
        }


    class Questionnaire{
        constructor(name, uri){
            this.name = name;
            this.uri = uri;
            console.log(this.uri);
        }
    }


    $("#tools #add").on("click", formTask);
    $('#tools #del').on('click', delTask);

    function formTask(isnew){
        $("#currenttask").empty();
        $("#currenttask")
            .append($('<span>Titre<input type="text" id="titre"><br></span>'))
            .append($('<span><input type="hidden" id="turi"><br></span>'))
            .append(isnew?$('<span><input type="button" value="Sauvegarder le quiz"><br></span>').on("click", saveNewTask)
                         :$('<span><input type="button" value="Modifier le quiz"><br></span>').on("click", saveModifiedTask)
                );
        }

    function fillFormTask(t){
        $("#currenttask #titre").val(t.name);
         t.uri=(t.uri == undefined)?"http://127.0.0.1:5000/api/questionnaires/"+t.id:t.uri;
         $("#currenttask #turi").val(t.uri);
    }

    function saveNewTask(){
        var task = new Questionnaire(
            $("#currenttask #titre").val()
            );
        console.log(JSON.stringify(task));
        fetch("http://127.0.0.1:5000/api/questionnaires",{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(task)
            })
        .then(res => { console.log('Save Success') ;
                       $("#result").text(res['contenu']);
                       refreshTaskList();
                   })
        .catch( res => { console.log(res) });
    }

    function saveModifiedTask(){
        var task = new Questionnaire(
            $("#currenttask #titre").val(),
            $("#currenttask #turi").val()
            );
        console.log("PUT");
        console.log(task.uri);
        console.log(JSON.stringify(task));
        fetch(task.uri,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify(task)
            })
        .then(res => { console.log('Update Success');  refreshTaskList();} )
        .catch( res => { console.log(res) });
    }

    function delTask(){
        if ($("#currenttask #turi").val()){
        url = $("#currenttask #turi").val();
        fetch(url,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "DELETE"
            })
        .then(res => { console.log('Delete Success:' + res); } )
        .then(refreshTaskList)
        .catch( res => { console.log(res);  });
    }
  }
});
