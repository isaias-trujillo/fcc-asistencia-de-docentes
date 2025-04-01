import {create} from "zustand/react";

type Store = {
    state: 'asistencia' | 'tardanza' | 'falta' | 'auto';
    update: (state: 'asistencia' | 'tardanza' | 'falta' | 'auto') => void;
}

const useStudentsAttendanceState = create<Store>((setState) => {
    const update: Store['update'] = state => setState(prev => ({...prev, state}))
    return {
        state: 'auto',
        update
    }
})

export default useStudentsAttendanceState