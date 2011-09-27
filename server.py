from os import path as op

import tornado.web
import tornadio
import tornadio.router
import tornadio.server
import thread
import logging

global connections

ROOT = op.normpath(op.dirname(__file__))

class IndexHandler(tornado.web.RequestHandler):
    """Regular HTTP handler to serve the chatroom page"""
    def get(self):
        self.render("index.html")

class ChatConnection(tornadio.SocketConnection):
    # Class level variable
    participants = set()

    def __init__(self, protocol, io_loop, heartbeat_interval):
        tornadio.SocketConnection.__init__(self, protocol, io_loop, heartbeat_interval)

    def on_open(self, *args, **kwargs):
        self.participants.add(self)
        self.send("CONNECTED")
        
    def on_message(self, message):
        for p in self.participants:
            p.send(message)

    def on_close(self):
        self.participants.remove(self)
        self.send("DISCONNECTED")

#use the routes classmethod to build the correct resource
ChatRouter = tornadio.get_router(ChatConnection)

#configure the Tornado application
application = tornado.web.Application(
    [(r"/", IndexHandler, None), ChatRouter.route()],
    enabled_protocols = ['websocket',
                         'flashsocket',
                         'xhr-multipart',
                         'xhr-polling'],
    flash_policy_port = 843,
    flash_policy_file = op.join(ROOT, 'flashpolicy.xml'),
    socket_io_port = 8001
)

if __name__ == "__main__":
    # initialize login
    logging.getLogger().setLevel(logging.DEBUG)
    
    # initliaze connections instance
    global connections
    connections = set()
    
    try:
        thread.start_new_thread(readLog, ("LogReader", 1,) )
    except:
        print "Error: unable to start thread"
    
    # start server
    tornadio.server.SocketServer(application)
    


