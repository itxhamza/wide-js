import { FMNodeType } from "./lib/types";
declare class FMNode implements FMNodeType {
    get(req: any, res: any): void;
    post(req: any, res: any): void;
    put(req: any, res: any): void;
    delete(req: any, res: any): void;
    middleware(req: any, res: any, next: any): void;
}
export default FMNode;
