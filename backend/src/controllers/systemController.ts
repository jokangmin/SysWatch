import { Request, Response } from "express";
import { getSystemStatus } from "../utils/process";

export const systemProcessController = async (req: Request, res: Response) => {
    try{
        const data = await getSystemStatus();
        res.json(data);
    }catch (err) {
        res.status(500).json({message: "프로세스 정보 가져오기 오류", error: err});
    }
};