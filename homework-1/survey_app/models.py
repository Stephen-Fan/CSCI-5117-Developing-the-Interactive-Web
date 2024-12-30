from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class SurveyResponse(db.Model):
    __tablename__ = 'survey_responses'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    radio_option = db.Column(db.String(50), nullable=False)
    select_option = db.Column(db.String(50), nullable=False)
    checkbox_value = db.Column(db.Boolean, nullable=False)
    optional_text = db.Column(db.String(500), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def as_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'radio_option': self.radio_option,
            'select_option': self.select_option,
            'checkbox_value': self.checkbox_value,
            'optional_text': self.optional_text,
            'timestamp': self.timestamp
        }