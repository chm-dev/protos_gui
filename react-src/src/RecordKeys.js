import { useRecordHotkeys } from 'react-hotkeys-hook';

function RecordKeys() {
    const [keys, { start, stop, isRecording }] = useRecordHotkeys()
  console.log(keys)
  console.log(isRecording)
  //console.log(start)
  //console.log(stop)

    return (
      <div onKeyDown={start} onKeyUp={stop}>
        <p>Is recording: {isRecording ? 'yes' : 'no'}</p>
        <p>Recorded keys: {Array.from(keys)}</p>
        <br />
        <button onClick={start}>Record</button>
        <button onClick={stop}>Stop</button>
      </div>
    )
  }

  export default RecordKeys