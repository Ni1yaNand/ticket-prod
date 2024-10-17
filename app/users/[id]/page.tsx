import options from '@/app/api/auth/[...nextauth]/options';
import UserForm from '@/components/UserForm copy';
import prisma from '@/prisma/db';
import { User } from 'lucide-react';
import { getServerSession } from 'next-auth';
import React from 'react'

interface Props {
    params: {
        id: string;
    };
}

const EditUser = async({params}: Props) => {

    const session = await getServerSession(options); 

    if(session?.user.role !== "ADMIN") {
      return <p className='text-destructive'>Admin access required</p>
    }

    const user = await prisma?.user.findUnique({
        where: {
            id: parseInt(params.id)
        },
    });

    if(!user) {
        return <div className='text-destructive'>User not found.</div>
    }

    user.password = '';
    return <UserForm user={user} />
}

export default EditUser