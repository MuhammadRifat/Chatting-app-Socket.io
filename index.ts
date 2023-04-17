import express, { Application, Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { connectDB } from "./utils/db";
import { User } from "./model/user.model";

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);
connectDB();

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "/views/index.html"));
});
app.get("/chat", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "/views/chat.html"));
});
app.get("/login", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "/views/login.html"));
});

let activeUsers: { sid: string, id?: number, name?: string }[] = [];
let notifications: string[] = [];

io.on("connection", (socket) => {
    const user = socket.handshake.auth.user;

    activeUsers.push({ sid: socket.id, ...user });

    // login
    socket.on("login", async (data) => {
        try {
            const name = String(data.name);
            const mobile = String(data.mobile);
            let user = await User.findOne({ where: { mobile: mobile } });

            if (!user) {
                user = await User.create({ name: name, mobile: mobile });
            }
            socket.emit("login", user);
        } catch (error: any) {
            console.log(error.message);
        }
    });

    // chatting
    socket.on("chat", (message, receiverId) => {
        const receiver = activeUsers.find(user => user.id == receiverId);
        console.log(message);
        if (receiver) {
            socket.to(receiver.sid).emit("chat", message);

        } else {
            console.log("user not active");
        }
    })

    // notifications
    socket.on("notification", (notification) => {
        try {
            notifications.push(notification);
            io.emit("notification", notifications);

        } catch (error) {
            console.log(error);
        }
    })


    socket.on("disconnect", () => {
        try {
            const newArr = activeUsers.filter((user) => user.sid != socket.id);
            activeUsers = newArr;
        } catch (error) {
            console.log(error);
        }
    });


    io.emit("active", { active: activeUsers });
    io.emit("notification", notifications);
});

server.listen(3000, () => {
    console.log("server listening on the port 3000");
});

