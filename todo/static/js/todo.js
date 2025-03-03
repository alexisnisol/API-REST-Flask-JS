$(function() {

    $("#button").click(refreshQuizList);

function remplirTaches(repjson) {
    console.log(JSON.stringify(repjson));
    $('#taches').empty();
    const ul = $('<ul>');
    $('#taches').append(ul);

    for (const quiz of repjson) {
        console.log(quiz);
        const quizLi = $('<li>');
        const quizLink = $('<a>').text(quiz.name).on("click", quiz, details);
        quizLi.append(quizLink);
        ul.append(quizLi);

        const questionsUl = $('<ul>');
        quizLi.append(questionsUl);

        //add button add in the ul
        //<img id="add" src="{{ url_for('static', filename='img/new.png') }}" alt="Nouvelle chose à faire"/>
        const addLi = $('<li>');
        const addLink = $('<img>').attr('src', 'static/img/new.png').on("click", formQuiz);
        addLi.append(addLink);
        questionsUl.append(addLi);

        for (const question of quiz.questions) {
            const questionLi = $('<li>').text(question.title);
            questionsUl.append(questionLi);
        }
    }
}

      function onerror(err) {
          $("#taches").html("<b>Impossible de récupérer les taches à réaliser !</b>"+err);
      }

    function refreshQuizList(){
        $("#current_quiz").empty();
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
        $("#current_quiz").empty();
        formQuiz();
        fillFormQuiz(event.data);
        }


    class Questionnaire{
        constructor(name, uri){
            this.name = name;
            this.uri = uri;
            console.log(this.uri);
        }
    }

    $("#tools #add").on("click", formQuiz);
    $('#tools #del').on('click', delQuiz);

    function formQuiz(isnew){
        $("#current_quiz").empty();
        $("#current_quiz")
            .append($('<span>Titre<input type="text" id="titre"><br></span>'))
            .append($('<span><input type="hidden" id="quiz_uri"><br></span>'))
            .append(isnew?$('<span><input type="button" value="Sauvegarder le quiz"><br></span>').on("click", saveNewQuiz)
                         :$('<span><input type="button" value="Modifier le quiz"><br></span>').on("click", saveModifiedQuiz)
                );
    }

    function fillFormQuiz(quiz){
        $("#current_quiz #titre").val(quiz.name);
        quiz.uri=(quiz.uri == undefined)?"http://127.0.0.1:5000/api/questionnaires/"+quiz.id:quiz.uri;
        $("#current_quiz #quiz_uri").val(quiz.uri);

    }

    function saveNewQuiz(){
        var quiz = new Questionnaire(
            $("#current_quiz #titre").val()
            );
        console.log(JSON.stringify(quiz));
        fetch("http://127.0.0.1:5000/api/questionnaires",{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(quiz)
            })
        .then(res => { console.log('Save Success') ;
                       $("#result").text(res['contenu']);
                       refreshQuizList();
                   })
        .catch( res => { console.log(res) });
    }

    function saveModifiedQuiz(){
        var quiz = new Questionnaire(
            $("#current_quiz #titre").val(),
            $("#current_quiz #quiz_uri").val()
            );
        console.log("PUT");
        console.log(quiz.uri);
        console.log(JSON.stringify(quiz));
        fetch(quiz.uri,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "PUT",
        body: JSON.stringify(quiz)
            })
        .then(res => { console.log('Update Success');  refreshQuizList();} )
        .catch( res => { console.log(res) });
    }

    function delQuiz(){
        if ($("#current_quiz #quiz_uri").val()){
        url = $("#current_quiz #quiz_uri").val();
        fetch(url,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "DELETE"
            })
        .then(res => { console.log('Delete Success:' + res); } )
        .then(refreshQuizList)
        .catch( res => { console.log(res);  });
    }
  }
});
