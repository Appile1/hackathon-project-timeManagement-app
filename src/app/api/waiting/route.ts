import prisma from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { email } = await req.json()
        console.log(email);

        const checkEmail = await prisma.waitinglist.findUnique({
            where: { email: email }
        })
        if (checkEmail) {
            return Response.json({ message: "Email already exists" }, { status: 409 })
        }
        if (!checkEmail) {
            console.log("hello");
        }

        const waitinglist = await prisma.waitinglist.create({
            data: {
                email: email
            }
        })
        if (!waitinglist) {
            return Response.json({ message: "error creating waiting list for user" }, { status: 500 })
        }
        return Response.json({ message: "user added to waiting list successfully" }, { status: 200 })
    }
    catch (err) {
        console.log(err);
        return Response.json({ message: "error creating waiting list for user" }, { status: 500 })
    }
}