from .app import db

class Questionnaire (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))

    def __init__(self, name):
        self.name = name

    def __repr__(self):
        return '<Questionnaire %r>' % (self.id, self.name)
    
    def serialize(self):
        return {
            'id': self.id,
            'name': self.name
        }
    
class Question (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64))
    questionType = db.Column(db.String(64))
    questionnaire_id = db.Column(db.Integer, db.ForeignKey('questionnaire.id'))

    questionnaire = db.relationship('Questionnaire', backref=db.backref('questions', lazy='dynamic'))

    def serialize(self):
        return {
            'id': self.id,
            'title': self.title,
            'questionType': self.questionType,
            'questionnaire_id': self.questionnaire_id
        }
