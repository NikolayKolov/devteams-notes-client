import { z } from 'zod';

const CreateNoteListItem = z.object({
    text: z.string().min(2, { message: 'Note item text must be at least 2 characters long' })
    .max(50, {message: 'Note item text must be less than 50 characters long'}),
    order: z.number().gt(0),
    isDone: z.boolean()
})

export const CreateNote = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('TEXT'),
        title: z.string().min(2, { message: 'Note title must be at least 2 characters long' })
        .max(100, {message: 'Note title must be less than 100 characters long'}),
        userId: z.number().gt(0),
        content: z.string().min(10, { message: 'Note content must be at least 10 characters long' })
        .max(1000, {message: 'Note content must be less than 100 characters long'}),
    }),
    z.object({
        type: z.literal('CHECKLIST'),
        title: z.string().min(2, { message: 'Note title must be at least 2 characters long'}).max(100, { message: 'Note title must be less than 100 characters long'}),
        userId: z.number().gt(0),
        content: z.string().optional(),
        checkList: z.array(CreateNoteListItem).nonempty(),
    })
]);

export type CreateNoteType = z.infer<typeof CreateNote>;
export type CreateNoteListItemType = z.infer<typeof CreateNoteListItem>;
