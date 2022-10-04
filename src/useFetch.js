import { useState } from 'react';

const useFetch = (props) => {
    const [state, setState] = useState(props)

    const updateData = async(url, options) => {
      await fetch(url, options).then(res => res.json()).then(result => setState([...state, result]))
    }

  return [state, updateData] 
}

export default useFetch