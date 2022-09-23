@Injectable()
export class AppService {
    async createNewBill(request: Request) {
        console.log("phase2");
        let reqBody: {
            name: string;
            precentage: number;
            expenses: Array<{
                totalcost: number;
                date: string;
                day: string;
                materialName: string;
                billCode: string;
            }>;
            revenues: Array<{ amount: number; date: string }>;
        } = request.body as any;
        
        let oldBill = await prisma.projectBill.findFirst({
            where: {
                name: reqBody.name,
            },
        })

        async function createBill() {
            console.log("phase3");
            console.log(reqBody.expenses);
            if (reqBody.expenses && reqBody.revenues) {
                const projectBill = await prisma.projectBill.create({
                    data: {
                        name: reqBody.name,
                        officePrecentage: reqBody.precentage,
                    },
                });

                const expenses = reqBody.expenses;
                for (let i = 0; i < expenses.length; i++) {
                    const rev = await prisma.expenses.create({
                        data: {
                            totalcost: expenses[i].totalcost,
                            date: new Date(expenses[i].date),
                            materialName: expenses[i].materialName,
                            day: expenses[i].day,
                            billCode: expenses[i].billCode,
                            ProjectBill: {
                                connect: {
                                    id: projectBill.id,
                                },
                            },
                        },
                    });
                }
                const revenues = reqBody.revenues;
                for (let i = 0; i < revenues.length; i++) {
                    console.log(revenues[i]);
                    const rev = await prisma.revenue.create({
                        data: {
                            amount: revenues[i].amount,
                            date: new Date(revenues[i].date),
                            ProjectBill: {
                                connect: {
                                    id: projectBill.id,
                                },
                            },
                        },
                    });
                }
            } else {
                console.log("Error");
                return true;
            }
        }
        
        try {
            if (oldBill.expenses && oldBill.revenues) {
                createBill();
            } else {
                await prisma.projectBill.delete({
                    where: {
                        name: oldBill.name,
                    },
                });
            }
        } catch (e) {
            createBill();
        }
    }
}
