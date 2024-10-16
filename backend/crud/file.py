from db.db import get_db
from models.file import File
from schemas.file import File as FileSchema


class FileCRUD:
    def create_file(file: FileSchema):
        db = get_db()
        db_file = File(filename=file.filename, uploader_id=file.uploader_id)
        db.add(db_file)
        db.commit()
        db.close()
        return {'status': 'success'}

    def read_all_file():
        db = get_db()
        files = db.query(File).all()
        db.close()
        return {'status': 'success', 'files': files}
