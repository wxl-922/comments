from app import app
from models import db, Comment
from datetime import datetime
import json


with app.app_context():
    db.create_all()

    with open('../comments.json', 'r') as f:
        data = json.load(f)

    for comment in data['comments']:
        new_comment = Comment(
            id=int(comment['id']),
            author=comment['author'],
            text=comment['text'],
            date=datetime.fromisoformat(comment['date'].replace('Z', '+00:00')),
            likes=comment['likes'],
            image=comment.get('image') or None
        )
        db.session.add(new_comment)

    db.session.commit()
