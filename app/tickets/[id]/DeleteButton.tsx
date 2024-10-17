
"use client"  

import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; 
import axios from 'axios';

const DeleteButton = ({ ticketId }: { ticketId: number }) => {
    const router = useRouter() 
    const [error, setError] = useState("")
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteTicket = async () => {
        try {
            setIsDeleting(true)
            await axios.delete("/api/tickets/" + ticketId);
            router.push("/tickets"); 
            router.refresh();  
        } catch (error) {
            setIsDeleting(false)
            setError("Unknown Error Occurred.");
        }
    }

    return (
        <>
        <AlertDialog>
            <AlertDialogTrigger className={buttonVariants({
                variant: "destructive",
            })}>
                Delete Ticket
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your ticket.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className={buttonVariants({
                            variant: "destructive",
                        })}
                        onClick={deleteTicket} 
                        disabled={isDeleting}  
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <p className='text-destructive'>{error}</p>
        </>
    )
}

export default DeleteButton
