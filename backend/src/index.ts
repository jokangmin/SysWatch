import express, { Router, Request, Response, NextFunction } from "express";
import path from "path";
import systemRouter from "./routes/system";

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

//분리 라우트 적용
app.use('/system', systemRouter);

//error 핸들러 (middleWare 이용)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send(err.message || "알수없는 에러 발생");
});

app.listen(PORT, () => {
    console.log(`서버 실행 중, http://localhost:${PORT}`);
});