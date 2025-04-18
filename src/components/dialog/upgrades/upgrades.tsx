import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogImage,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FACTORIES, type FactoryType } from '@/content/factories'
import { ArrowBigUpDash } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip'
import { UpgradesCard } from './upgrades.card'

const UpgradesDialog = () => {
  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="white" size="icon">
              <span className="sr-only">Open Upgrades</span>
              <ArrowBigUpDash />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>

        <TooltipContent>Upgrades</TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogImage src="/images/upgrades/upgrade.webp" alt="Upgrades" />

        <DialogHeader>
          <DialogTitle>Upgrades</DialogTitle>

          <DialogDescription>
            Upgrade your factories to increase your income.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex flex-col">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(FACTORIES).map(([key]) => (
              <UpgradesCard key={key} factoryType={key as FactoryType} />
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose asChild>
            <Button size="lg">Close Upgrades</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpgradesDialog
