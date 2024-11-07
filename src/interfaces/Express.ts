import { NextFunction, Request, Response } from "express";

export interface IRequest extends Request{};
export interface IResponse extends Response{};
export interface INextFunction extends NextFunction{};

