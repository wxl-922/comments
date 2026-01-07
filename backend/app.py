from flask import Flask, request, jsonify
from models import db, Comment
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/comments_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)


def api_response(message=None, data=None, status=200):
    return jsonify({
        'message': message,
        'data': data
    }), status


@app.route('/comments/<int:id>', methods=['PATCH'])
def update_comment(id):
    try:
        data = request.get_json() or {}
        text = data.get('text', '')
        comment = Comment.query.get(id)
        comment.text = text
        db.session.commit()
        return api_response(
            'Comment updated successfully',
            comment.to_dict(),
            200
        )
    except Exception:
        db.session.rollback()
        return api_response(
            'Failed to update comment',
            None,
            500
        )


@app.route('/comments', methods=['POST'])
def create_comment():
    try:
        data = request.get_json() or {}
        author = 'Admin'
        text = data.get('text', '')
        image = data.get('image', '')
        comment = Comment(author=author, text=text, image=image)
        db.session.add(comment)
        db.session.commit()
        return api_response(
            'Comment created successfully',
            comment.to_dict(),
            201
        )
    except Exception:
        db.session.rollback()
        return api_response(
            'Failed to create comment',
            None,
            500
        )


@app.route('/comments/<int:id>', methods=['DELETE'])
def delete_comment(id):
    try:
        comment = Comment.query.get(id)
        db.session.delete(comment)
        db.session.commit()
        return api_response(
            'Comment deleted successfully',
            comment.to_dict(),
            200
        )
    except Exception:
        db.session.rollback()
        return api_response(
            'Failed to delete comment',
            None,
            500
        )


@app.route('/comments', methods=['GET'])
def list_comments():
    try:
        comments = Comment.query.all()
        return api_response(
            'Comments retrieved successfully',
            [comment.to_dict() for comment in comments],
            200
        )
    except Exception:
        return api_response(
            'Failed to retrieve comments',
            None,
            500
        )


if __name__ == '__main__':
    app.run(debug=True)
