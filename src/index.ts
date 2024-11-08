import { Server } from './Server';


Server.getInstance()
    .startServer()
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });


