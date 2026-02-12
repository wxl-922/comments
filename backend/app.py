from flask import Flask, request, jsonify, send_from_directory
from models import db, Comment
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import uuid

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


@app.route('/uploads/<filename>')
def get_image(filename):
    return send_from_directory('uploads', filename)


@app.route('/comments/<int:id>', methods=['PATCH'])
def update_comment(id):
    try:
        comment = Comment.query.get(id)
        if not comment:
            return api_response(
                'Comment not found',
                None,
                404
            )

        text = request.form.get('text')
        if not text or not text.strip():
            return api_response(
                'Text required',
                None,
                400
            )
        comment.text = text

        image = request.files.get('image')
        image_remove = request.form.get('remove')
        image_url = None
        if image:
            filename = secure_filename(image.filename)
            extension = os.path.splitext(filename)[1]
            image_name = f'{uuid.uuid4().hex}{extension}'
            image.save(os.path.join('uploads', image_name))
            image_url = f'/uploads/{image_name}'
        if image_remove or image_url:
            if comment.image and comment.image.startswith('/uploads'):
                image_path = os.path.join(app.root_path, comment.image.lstrip('/'))
                if os.path.exists(image_path):
                    os.remove(image_path)
            if image_remove:
                comment.image = None
            if image_url:
                comment.image = image_url

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
        author = 'Admin'
        text = request.form.get('text')
        if not text or not text.strip():
            return api_response(
                'Text required',
                None,
                400
            )

        image = request.files.get('image')
        image_url = None
        if image:
            filename = secure_filename(image.filename)
            extension = os.path.splitext(filename)[1]
            image_name = f'{uuid.uuid4().hex}{extension}'
            image.save(os.path.join('uploads', image_name))
            image_url = f'/uploads/{image_name}'
        comment = Comment(author=author, text=text, image=image_url)
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
        if not comment:
            return api_response(
                'Comment not found',
                None,
                404
            )

        if comment.image and comment.image.startswith('/uploads'):
            image_path = os.path.join(app.root_path, comment.image.lstrip('/'))
            if os.path.exists(image_path):
                os.remove(image_path)

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
