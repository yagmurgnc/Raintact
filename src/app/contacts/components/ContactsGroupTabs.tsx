import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Add } from "iconsax-reactjs"
import { useState } from "react"

interface ContactsGroupTabsProps {
    groups: { id: string; label: string }[];
    activeTab: string;
    onTabChange: (value: string) => void;
    onAddGroup: (groupName: string) => void;
}

export function ContactsGroupTabs({ groups, activeTab, onTabChange, onAddGroup }: ContactsGroupTabsProps) {
    const [open, setOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");

    const handleAddGroup = (e: React.FormEvent) => {
        e.preventDefault();
        onAddGroup(newGroupName);
        setNewGroupName("");
        setOpen(false);
    }

    return (
        <div className="flex w-full justify-center gap-6 fixed bottom-10 z-50 left-1/2 -translate-x-1/2">
            <Tabs value={activeTab} onValueChange={onTabChange}>
                <TabsList className="flex gap-3 px-3 py-3 shadow-[0_30px_100px_0_rgba(0,0,0,0.40)] bg-white  rounded-full flex-wrap h-auto">
                    {groups.map((group) => (
                        <TabsTrigger className="rounded-full px-4 shadow-sm hover:bg-zinc-200 data-[state=active]:bg-zinc-200 transition-all" key={group.id} value={group.id}>
                            {group.label}
                        </TabsTrigger>
                    ))}

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild className=""
                        >
                            <Button variant="outline" className="[&>svg>path]:!stroke-[2px] hover:bg-zinc-200 border-none  rounded-full shadow-sm"><Add size="20" color="#000000ff" /></Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[455px]">
                            <form onSubmit={handleAddGroup}>
                                <DialogHeader>
                                    <DialogTitle>Yeni Grup Ekle</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col p-2 gap-8 ">
                                    <div className="grid gap-3">
                                        <Label htmlFor="group-name">Grup Adı</Label>
                                        <Input
                                            className="rounded-full shadow-md"
                                            id="group-name"
                                            name="group-name"
                                            value={newGroupName}
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                            placeholder="...example"
                                            required
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button">Yoksay</Button>
                                    </DialogClose>
                                    <Button type="submit">Ekle</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </TabsList>
            </Tabs>
        </div>
    )
}

