from .app import db

class Questionnaire(db.Model):
    __tablename__ = 'questionnaire'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    questions = db.relationship('Question', backref='questionnaire', lazy=True)

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Questionnaire %r>' % (self.id, self.name)
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'questions': [question.serialize() for question in self.questions]
        }
    
class Question(db.Model):
    __tablename__ = 'question'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64))
    questionType = db.Column(db.String(64))
    questionAnswer = db.Column(db.String(64))
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'))


    #TODO : Remplacer le serialize par les annotations vu en cours
    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'questionType': self.questionType,
            'questionnaire_id': self.questionnaire_id
        }