import prisma from '@/lib/prisma';
import PortfolioPage from './p/components/PortfolioPage';

export default async function Home() {
    // Fetch the user with the specified email
    const user = await prisma.user.findUnique({
        where: {
            email: 'jaija.ismail@gmail.com',
        },
    });

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-red-500">User not found</h1>
                <p>Could not find a user with the specified email</p>
            </div>
        );
    }

    return <PortfolioPage userId={user.id} />;
}