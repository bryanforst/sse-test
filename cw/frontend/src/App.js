import React, { useState, useEffect } from 'react';

const useEventSource = (url) => {
    const [data, updateData] = useState(null);

    useEffect(() => {
        const source = new EventSource(url);

        source.onmessage = function logEvents(event) {      
            updateData(JSON.parse(event.data));     
        }
    }, [url])

    return data;
}

function App() {
  const data = useEventSource(`/sseconnect`);
  if (!data) {
    return <div> No Data yet </div>;
  }

  return <div>Response from server is {data.value}</div>;
}

export default App;
