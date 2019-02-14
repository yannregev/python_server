###############################################################################
# Web Technology at VU University Amsterdam
# Assignment 3
###############################################################################

from bottle import response, error, get, post, request, template, put, delete
import json


# get request to /phones returns all the phones in the data base
@get('/phones')
def phones(db):

    try:
        db.execute("SELECT * FROM phones")

        phones = db.fetchall()
    	response.headers['Content-Type'] = 'application/json'
    	response.status = 200
    except:
    	response.status = 500 
    	return
    return json.dumps(phones)

# post request to /phones adds new phone to the data base
@post('/phones')
def phones(db):
    # if one of the fields is null return client error
    if (request.json['brand'] == None or request.json['screensize'] == None or request.json['image'] == None or request.json['model'] == None or request.json['os'] == None):
        response.status = 400
        return
    # if one of the fields is an empty string return client error
    if (request.json['brand'] == "" or request.json['screensize'] == "" or request.json['image'] == "" or request.json['model'] == "" or request.json['os'] == ""):
        response.status = 400
        return	
		
    try:
        db.execute("INSERT into phones(brand,screensize,image,model,os) values(?, ?, ?, ?, ?)",
                    (request.json['brand'],
                    request.json['screensize'],
                    request.json['image'],
                    request.json['model'],
                    request.json['os']))
        response.status = 200
    except:
        response.status = 500
        return
    return

# get to /phone/{id} gets a phone from the data base with its id
@get('/phones/<phone_id>')
def retrieve(db, phone_id):
    try:
        db.execute("SELECT * FROM phones WHERE id=?",(phone_id,))
        phone = db.fetchall()
        response.headers['Content-Type'] = 'application/json'
        response.status = 200
    except:
        response.status = 500
        return
    return json.dumps(phone)

# put to /phone/{id} updates a phone from the data base with its id
@put('/phones/<phone_id>')
def update(db, phone_id):
    if (request.json['brand'] == None or request.json['screensize'] == None or request.json['image'] == None or request.json['model'] == None or request.json['os'] == None):
        response.status = 400
        return
    
    if (request.json['brand'] == "" or request.json['screensize'] == "" or request.json['image'] == "" or request.json['model'] == "" or request.json['os'] == ""):
        response.status = 400
        return
    
    print request.json['brand']
    try:
        db.execute("UPDATE phones SET brand=?,image=?, model=?, os=?, screensize=? WHERE id=?",
                    (request.json['brand'],
                    request.json['image'],
                    request.json['model'],
                    request.json['os'],
                    request.json['screensize'],
                    phone_id))
        response.status = 200
    except:
        response.status = 500
        return
    return

# delete to /phone/{id} deletes a phone from the data base with its id
@delete('/phones/<phone_id>')
def delete(db, phone_id):
    try:
        db.execute("DELETE FROM phones WHERE id=?",(phone_id,))
        response.status = 200
    except:
        response.status = 500
    return


# get to /phone/reset resets the data base to its initial state
@get('/phones/reset')
def reset(db):
    try:
        db.execute("DELETE FROM phones")
        db.executescript("""
                CREATE TABLE IF NOT EXISTS phones
                        (id INTEGER PRIMARY KEY,
                         brand CHAR(100) NOT NULL,
                         model CHAR(100) NOT NULL,
                         os CHAR(10) NOT NULL,
                         image char(254) NOT NULL,
                         screensize INTEGER NOT NULL);
                INSERT INTO phones
                        (brand, model, os, image, screensize)
                        VALUES ('Apple', 'iPhone X', 'IOS', 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/IPhone_X_vector.svg/440px-IPhone_X_vector.svg.png', '5');
                INSERT INTO phones
                        (brand, model, os, image, screensize)
                        VALUES ("Samsung", "Galaxy s8", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Samsung_Galaxy_S8_and_S8_Plus.png/569px-Samsung_Galaxy_S8_and_S8_Plus.png", "6");
                """);
    except:
        response.status = 500
        return
    return

# if a webpage or request that does not exist on the server is accessed 
@error(404)
def error404(error):
    response.status = 400
    return 'This page does not exist, Sorry!'

###############################################################################
# This starts the server
#
# Access it at http://localhost:8080
#
# If you have problems with the reloader (i.e. your server does not
# automatically reload new code after you save this file), set `reloader=False`
# and reload manually.
#
# You might want to set `debug=True` while developing and/or debugging and to
# `False` before you submit.
#
# The installed plugin 'WtPlugin' takes care of enabling CORS (Cross-Origin
# Resource Sharing; you need this if you use your API from a website) and
# provides you with a database cursor.
###############################################################################

if __name__ == "__main__":
    from bottle import install, run
    from wtplugin import WtDbPlugin, WtCorsPlugin

    install(WtDbPlugin())
    install(WtCorsPlugin())
    run(host='localhost', port=8080, reloader=True, debug=True, autojson=False)
