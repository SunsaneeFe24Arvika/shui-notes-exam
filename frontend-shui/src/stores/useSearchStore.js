import { create } from 'zustand';

export const useSearchStore = create(set => ({
    searchFilter : {
        user: "",
        title: "",
        createAt: ""
    }
    
}));
