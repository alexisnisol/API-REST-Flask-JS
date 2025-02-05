from .app import app, db

@app.cli.command()
def syncdb():
    '''Creates all missing tables.'''
    db.create_all()
