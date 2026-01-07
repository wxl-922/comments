from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(50), nullable=False)
    text = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    likes = db.Column(db.Integer, nullable=False, default=0)
    image = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'author': self.author,
            'text': self.text,
            'date': self.date.isoformat() + 'Z',
            'likes': self.likes,
            'image': self.image
        }
