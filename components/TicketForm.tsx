"use client";
import { ticketSchema } from '@/ValidationSchemas/ticket';
import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from './ui/input';
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { SelectContent, SelectItem, SelectValue, Select, SelectTrigger } from './ui/select';
import { Button } from './ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation'; 
import { Ticket } from '@prisma/client';

type TicketFormData = z.infer<typeof ticketSchema>;

interface Props{
    ticket?: Ticket
}

const TicketForm = ({ticket}: Props) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter(); 

    const form = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            title: ticket?.title || '',
            description: ticket?.description || '',
            status: ticket?.status || 'OPEN',
            priority: ticket?.priority || 'MEDIUM',
        }
    });

    async function onSubmit(values: TicketFormData) {
        try {
            setIsSubmitting(true);
            setError("");

            if (ticket) {
                await axios.patch(`/api/tickets/${ticket.id}`, values);
            } else {
                await axios.post("/api/tickets", values);
            }

            router.push("/tickets");
            router.refresh();
        } catch (error) {
            console.error(error);
            setError("Unknown error occurred");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className='rounded-md border w-full p-4 mb-5'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    <FormField 
                    control={form.control} 
                    name="title" 
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Ticket Title</FormLabel>
                            <FormControl>
                                <Input placeholder='Ticket Title...' {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                    />
                    <Controller 
                    name='description' 
                    control={form.control} 
                    render={({field}) => (
                        <SimpleMDE placeholder="Description" {...field} />
                    )}
                    />
                    <div className='flex w-full space-x-4'>
                        <FormField 
                        control={form.control} 
                        name="status" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="OPEN">Open</SelectItem>
                                        <SelectItem value="STARTED">Started</SelectItem>
                                        <SelectItem value="CLOSED">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                        />
                        <FormField 
                        control={form.control} 
                        name="priority" 
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Priority</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Priority..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="HIGH">High</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                        />
                    </div>
                    <Button type='submit' disabled={isSubmitting}>
                        {ticket ? "Update Ticket" : "Create Ticket"}
                    </Button>
                </form>
            </Form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default TicketForm;
