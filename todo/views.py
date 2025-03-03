
from flask import jsonify, abort, make_response, render_template, request
from todo.app import app
from todo.models import Question, Questionnaire, db

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad request'}), 400)

@app.route('/', methods=['GET'])
def home():
    return render_template('todo.html')

@app.route('/api/questionnaires', methods=['GET'])
def get_questionnaires():
    questionnaires = Questionnaire.query.all()
    return jsonify([q.serialize() for q in questionnaires])

@app.route('/api/questionnaires/<int:id>', methods=['GET'])
def get_questionnaire(id):
    questionnaire = Questionnaire.query.get_or_404(id)
    result = questionnaire.serialize()
    result['questions'] = [question.serialize() for question in questionnaire.questions]
    return jsonify(result)

@app.route('/api/questionnaires', methods=['POST'])
def create_questionnaire():
    if not request.json or 'name' not in request.json:
        abort(400)
    questionnaire = Questionnaire(name=request.json['name'])
    db.session.add(questionnaire)
    db.session.commit()
    return jsonify(questionnaire.serialize()), 201

@app.route('/api/questionnaires/<int:id>', methods=['PUT'])
def update_questionnaire(id):
    questionnaire = Questionnaire.query.get_or_404(id)
    questionnaire.name = request.json.get('name', questionnaire.name)
    db.session.commit()
    return jsonify(questionnaire.serialize())

@app.route('/api/questionnaires/<int:id>', methods=['DELETE'])
def delete_questionnaire(id):
    questionnaire = Questionnaire.query.get_or_404(id)
    db.session.delete(questionnaire)
    db.session.commit()
    return jsonify({'result': True})

@app.route('/api/questions', methods=['GET'])
def get_questions():
    questions = Question.query.all()
    return jsonify([q.serialize() for q in questions])

@app.route('/api/questions/<int:id>', methods=['GET'])
def get_question(id):
    question = Question.query.get_or_404(id)
    return jsonify(question.serialize())

@app.route('/api/questions', methods=['POST'])
def create_question():
    if not request.json or not all(k in request.json for k in ('title', 'questionType', 'questionnaire_id')):
        abort(400)
    question = Question(
        title=request.json['title'],
        questionType=request.json['questionType'],
        questionnaire_id=request.json['questionnaire_id']
    )
    db.session.add(question)
    db.session.commit()
    return jsonify(question.serialize()), 201

@app.route('/api/questions/<int:id>', methods=['PUT'])
def update_question(id):
    question = Question.query.get_or_404(id)
    question.title = request.json.get('title', question.title)
    question.questionType = request.json.get('questionType', question.questionType)
    question.questionnaire_id = request.json.get('questionnaire_id', question.questionnaire_id)
    db.session.commit()
    return jsonify(question.serialize())

@app.route('/api/questions/<int:id>', methods=['DELETE'])
def delete_question(id):
    question = Question.query.get_or_404(id)
    db.session.delete(question)
    db.session.commit()
    return jsonify({'result': True})
