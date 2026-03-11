import { CostMilestoneEntity } from "@db/entities";
import { DeepPartial } from "typeorm";

export const costMilestoneRawData: DeepPartial<CostMilestoneEntity>[] = [
	{
		costFrom: 0,
		costTo: 5,
		secPerCost: 0,
	},
	{
		costFrom: 5.5,
		costTo: 7.5,
		secPerCost: 4,
	},
	{
		costFrom: 8,
		costTo: 11.5,
		secPerCost: 6,
	},
	{
		costFrom: 12,
		costTo: 15.5,
		secPerCost: 8,
	},
	{
		costFrom: 16,
		secPerCost: 10,
	},
];
