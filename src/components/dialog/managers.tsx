import { Button } from "@/components/ui/button";

import { FACTORIES, type FactoryType } from "@/data/factories";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { amountFormatter } from "@/utils/formatters";
import { cn } from "@/utils/cn";
import { useFactory, upgradeAuto } from "@/store/atoms/factories";
import { useWallet } from "@/store/atoms/wallet";
import { UserRound } from "lucide-react";

export const ManagersDialog = () => {
	const wallet = useWallet();

	const handleAutomatic = (type: FactoryType) => {
		upgradeAuto(type);
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="icon">
					<div className="sr-only">Open Managers</div>
					<UserRound />
				</Button>
			</DialogTrigger>

			<DialogContent className="flex flex-col">
				<DialogHeader>
					<DialogTitle>Managers</DialogTitle>
					<DialogDescription>
						Hire managers to automate your factories.
					</DialogDescription>
				</DialogHeader>

				<div className="grid grid-cols-2 gap-2 py-2">
					{Object.entries(FACTORIES).map(([key, value]) => {
						const factory = useFactory(key as FactoryType);

						return (
							<Button
								key={key}
								data-auto={factory.isAuto}
								className="w-full h-32 flex-col data-[auto='true']:bg-green-500"
								onClick={() => handleAutomatic(key as FactoryType)}
							>
								<span className="capitalize text-2xl text-bold">{key}</span>
								<span>
									{!factory?.isAuto && (
										<div>
											{`Price ${amountFormatter(
												FACTORIES[key as FactoryType]?.autoCost,
											)}`}
										</div>
									)}
								</span>
							</Button>
						);
					})}
				</div>
			</DialogContent>
		</Dialog>
	);
};
