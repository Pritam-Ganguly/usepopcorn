import {useEffect} from 'react';

export function useKey(key: string, action: ()=>void){
    
    useEffect(() => {
        const callback = (ev: KeyboardEvent) => {
          if (ev.code === key) action();
        };
    
        document.addEventListener("keydown", callback);
    
        return () => {
          document.removeEventListener("keydown", callback);
        };
      }, [key, action]);

}