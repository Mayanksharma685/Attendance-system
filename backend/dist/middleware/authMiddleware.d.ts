import { type Request, type Response, type NextFunction } from "express";
declare module "express" {
    interface Request {
        userId?: number;
        role?: string;
    }
}
declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default authMiddleware;
//# sourceMappingURL=authMiddleware.d.ts.map