import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Grid, Col } from "@/components/layout/grid";

export default function DesignSystemPage() {
    return (
        <div className="min-h-screen bg-background-default p-section space-y-16 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-halftone-grid opacity-10 pointer-events-none"></div>

            <header className="space-y-4 relative z-10">
                <h1 className="text-display-xl font-sans text-text-primary">MAINFRAME</h1>
                <p className="text-heading-md text-text-secondary font-mono">Design System v1.1.0 - Components</p>
            </header>

            <section className="space-y-8 relative z-10">
                <h2 className="text-heading-lg text-text-primary border-b border-utility-border-subtle pb-4">Atoms</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-heading-md text-text-primary">Buttons</h3>
                        <div className="flex flex-wrap gap-4">
                            <Button>Default</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button size="sm">Small</Button>
                            <Button size="lg">Large</Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-heading-md text-text-primary">Inputs</h3>
                        <div className="max-w-sm space-y-4">
                            <Input placeholder="Default Input" />
                            <Input disabled placeholder="Disabled Input" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-8 relative z-10">
                <h2 className="text-heading-lg text-text-primary border-b border-utility-border-subtle pb-4">Molecules</h2>

                <Grid>
                    <Col span={6} className="space-y-4">
                        <h3 className="text-heading-md text-text-primary">Select</h3>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Col>

                    <Col span={6} className="space-y-4">
                        <h3 className="text-heading-md text-text-primary">Dialog</h3>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Open Dialog</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click save when you're done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label htmlFor="name" className="text-right text-sm text-text-secondary">Name</label>
                                        <Input id="name" value="Pedro Duarte" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <label htmlFor="username" className="text-right text-sm text-text-secondary">Username</label>
                                        <Input id="username" value="@peduarte" className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </Col>
                </Grid>

                <div className="space-y-4 mt-8">
                    <h3 className="text-heading-md text-text-primary">Table</h3>
                    <Card>
                        <Table>
                            <TableCaption>A list of your recent invoices.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Invoice</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-medium">INV-001</TableCell>
                                    <TableCell>Paid</TableCell>
                                    <TableCell>Credit Card</TableCell>
                                    <TableCell className="text-right">$250.00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">INV-002</TableCell>
                                    <TableCell>Pending</TableCell>
                                    <TableCell>PayPal</TableCell>
                                    <TableCell className="text-right">$150.00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium">INV-003</TableCell>
                                    <TableCell>Unpaid</TableCell>
                                    <TableCell>Bank Transfer</TableCell>
                                    <TableCell className="text-right">$350.00</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </section>

            <section className="space-y-8 relative z-10">
                <h2 className="text-heading-lg text-text-primary border-b border-utility-border-subtle pb-4">Organisms</h2>

                <div className="space-y-4">
                    <h3 className="text-heading-md text-text-primary">Card</h3>
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle>Create project</CardTitle>
                            <CardDescription>Deploy your new project in one-click.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form>
                                <div className="grid w-full items-center gap-4">
                                    <div className="flex flex-col space-y-1.5">
                                        <label htmlFor="name" className="text-sm font-medium text-text-secondary">Name</label>
                                        <Input id="name" placeholder="Name of your project" />
                                    </div>
                                    <div className="flex flex-col space-y-1.5">
                                        <label htmlFor="framework" className="text-sm font-medium text-text-secondary">Framework</label>
                                        <Select>
                                            <SelectTrigger id="framework">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent position="popper">
                                                <SelectItem value="next">Next.js</SelectItem>
                                                <SelectItem value="sveltekit">SvelteKit</SelectItem>
                                                <SelectItem value="astro">Astro</SelectItem>
                                                <SelectItem value="nuxt">Nuxt.js</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Cancel</Button>
                            <Button>Deploy</Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>
        </div>
    );
}
