import { useState } from 'react';

const useLeafFetch = (props) => {
    const [state, setState] = useState(props)

    const updateData = async(url, options) => {
      await fetch(url, options).then(res => res.json()).then(result => setState(result))
    }

  return [state, updateData] 
}

export default useLeafFetch